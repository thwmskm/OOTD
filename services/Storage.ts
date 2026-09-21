//Resusable Service to upload images to Firebase Storage
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const storage = getStorage();

//converting uri to Blob for firebase storage to upload.
//NOTE: fetch(uri).blob() is unreliable for local file:// / content:// uris in RN —
//it can silently truncate/corrupt the data. uploadString('base64') is also a dead
//end here, since RN's Blob polyfill can't be constructed from an ArrayBuffer.
//XMLHttpRequest with responseType 'blob' goes through RN's native blob bridge
//instead of a JS-side read, and reliably produces the full, correct file data.
//This is Firebase's own documented workaround for React Native.
const blobify = (uri: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response as Blob);
    };
    xhr.onerror = function () {
      reject(new TypeError("Network request failed while reading local file"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
};

//uploading to storage function.
export const storeImage = async (uri: string, path: string): Promise<string> => {
  let blob: Blob | null = null;
  try {
    blob = await blobify(uri);
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
  } finally {
    // release the native blob reference once we're done with it
    // @ts-ignore - close() exists on RN's Blob but isn't in the lib.dom typings
    blob?.close?.();
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