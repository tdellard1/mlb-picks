import {initializeApp, FirebaseApp} from "firebase/app";
const firebaseConfig: {[config: string]: string} = {
    apiKey: "AIzaSyAJbrUUSPEwfhxAax7qOYq9-QV_eg61o1U",
    authDomain: "mlb-picks-2162b.firebaseapp.com",
    projectId: "mlb-picks-2162b",
    storageBucket: "mlb-picks-2162b.appspot.com",
    messagingSenderId: "1062344277302",
    appId: "1:1062344277302:web:dece8657a6165b351d0797",
    measurementId: "G-3123M9SGD1"
};

let firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;