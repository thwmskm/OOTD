//Resusable Service to upload images to Firebase Storage
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const storage = getStorage();

//converting uri to Blob for firebase storage to upload
const blobify = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

//uploading to storage function.
export const storeImage = async (uri: string, path: string): Promise<string> => {
  try {
    const blob = await blobify(uri);
    const storageRef = ref(storage, path);

    const metaData = {
      contentType: "image/jpeg",
      customMetadata: { uploadedAt: new Date().toISOString() },
    };

    const snapshot = await uploadBytes(storageRef, blob, metaData);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.error("Error while uploading image:", error);
    throw error;
  }
};

//Delete image from storage
export const deleteImage = async (path: string): Promise<boolean> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    console.log("File deleted from storage!");
    return true;
  } catch (error) {
    console.error("Error while deleting file:", error);
    throw error;
  }
};

//Helper functions to obtain path based on type of upload image
export const storeClothingItem = async (uri: string, cid: string, uid: string): Promise<string> => {
  const path = `users/${uid}/clothing/${cid}.jpg`;
  return await storeImage(uri, path);
};

export const storeOOTD = async (uri: string, ootdId: string, uid: string): Promise<string> => {
  const path = `users/${uid}/ootd/${ootdId}.jpg`;
  return await storeImage(uri, path);
};

export const storeOutfit = async (uri: string, oid: string, uid: string): Promise<string> => {
  const path = `users/${uid}/outfit/${oid}.jpg`;
  return await storeImage(uri, path);
};

export const storePfp = async (uri: string, uid: string): Promise<string> => {
  const path = `users/${uid}/pfp/pfp.jpg`;
  return await storeImage(uri, path);
};
