const {getStorage, ref, getDownloadURL} = require("firebase/storage");
const {initializeApp} = require("firebase/app");
const cache = require("./cache/memoryCache");

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
const storage = getStorage(app);

function loadDataToCache(keyFile) {
  return new Promise((resolve, reject) => {
    console.log(`Load ${keyFile} called!`);
    const storageRef = ref(storage, `${keyFile}.json`);
    getDownloadURL(storageRef).then((url) => {
      fetch(url)
        .then(file => file.json())
        .then((data) => {
          cache.set(keyFile, data);
          console.log(`${keyFile} Cache set: `, cache.has(keyFile));
          resolve();
        });
    });
  });
}

module.exports = {
  loadDataToCache: loadDataToCache
};
