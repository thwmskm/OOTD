const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

initializeApp();

//collections whose documents carry a `uid` field for their owner
const OWNED_COLLECTIONS = ["clothings", "outfits", "ootds"];

//Permanently deletes the signed-in user's account and all of their data.
//Admin SDK calls bypass security rules, so the locked-down client rules stay as they are.
//Order matters: data first, Auth user last. If anything fails midway the user can still
//sign in and retry, and every step is safe to run twice.
exports.deleteUserAccount = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be signed in.");
  }
  const uid = request.auth.uid;
  const db = getFirestore();

  try {
    //1. owned documents (bulkWriter handles batching and retries)
    const writer = db.bulkWriter();
    for (const name of OWNED_COLLECTIONS) {
      const snap = await db.collection(name).where("uid", "==", uid).get();
      snap.docs.forEach((doc) => writer.delete(doc.ref));
    }
    writer.delete(db.doc(`userStats/${uid}`));
    writer.delete(db.doc(`users/${uid}`));
    await writer.close();

    //2. every image under users/{uid}/ (clothing, outfit, ootd, pfp)
    await getStorage()
      .bucket()
      .deleteFiles({ prefix: `users/${uid}/` });

    //3. the Auth user, last
    await getAuth().deleteUser(uid);
  } catch (error) {
    console.error("Account deletion failed for", uid, error);
    throw new HttpsError("internal", "Account deletion failed.");
  }

  return { success: true };
});
