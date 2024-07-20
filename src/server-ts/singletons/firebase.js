import {initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAJbrUUSPEwfhxAax7qOYq9-QV_eg61o1U",
  authDomain: "mlb-picks-2162b.firebaseapp.com",
  projectId: "mlb-picks-2162b",
  storageBucket: "mlb-picks-2162b.appspot.com",
  messagingSenderId: "1062344277302",
  appId: "1:1062344277302:web:dece8657a6165b351d0797",
  measurementId: "G-3123M9SGD1"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

