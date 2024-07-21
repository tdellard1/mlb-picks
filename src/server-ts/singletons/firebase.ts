import {initializeApp, FirebaseApp} from "firebase/app";
import {getStorage, FirebaseStorage, ref, uploadBytes} from "firebase/storage";
import {StorageReference} from "@firebase/storage";
import {UploadStatus} from "../models/upload-status.js";
const firebaseConfig: {[config: string]: string} = {
  apiKey: "AIzaSyAJbrUUSPEwfhxAax7qOYq9-QV_eg61o1U",
  authDomain: "mlb-picks-2162b.firebaseapp.com",
  projectId: "mlb-picks-2162b",
  storageBucket: "mlb-picks-2162b.appspot.com",
  messagingSenderId: "1062344277302",
  appId: "1:1062344277302:web:dece8657a6165b351d0797",
  measurementId: "G-3123M9SGD1"
};

// @ts-ignore
export async function uploadFile<T>(fileName: string, fileData: T): Promise<UploadStatus> {
  const storage: FirebaseStorage = getStorage(app);
  const storageRef: StorageReference = ref(storage, `${fileName}.json`);

  const jsonString: string = JSON.stringify(fileData, null, 2);
  const blob: Blob = new Blob([jsonString], {type: 'application/json'});
  const file: File = new File([blob], `${fileName}.json`);
return await uploadBytes(storageRef, file).then(async () => {
    console.log(`Uploaded ${fileName} To Firebase!`);
    return {uploaded: true, reason: ''} as UploadStatus;
  }).catch((reason: any) => {
    return {uploaded: false, reason} as UploadStatus;
  });
}

const app: FirebaseApp = initializeApp(firebaseConfig);
export const storage: FirebaseStorage = getStorage(app);
