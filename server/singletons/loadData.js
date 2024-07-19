const {ref, getDownloadURL} = require("firebase/storage");
const firebaseFileKeys = ['boxScores', 'rosters', 'teams', 'slates', 'schedules', 'players'];
const redis = require('./redis');

module.exports = async () => {
  for (const fileKey of firebaseFileKeys) {
    const redisData = await redis.has(fileKey);

    if (!redisData) {
      const data = await loadData(fileKey);
      console.log(`Adding ${fileKey} to Redis...`);

      const count = await redis.listAddAll(fileKey, data);
      console.log(`Set ${count} ${fileKey}`);
    }
  }
}

function loadData(keyFile) {
  return new Promise((resolve) => {
    const storage = require('../firebase.init').storage;
    const storageRef = ref(storage, `${keyFile}.json`);
    getDownloadURL(storageRef).then((url) => {
      fetch(url)
        .then(file => file.json())
        .then((data) => {
          resolve(data.map(d => JSON.stringify(d)));
        });
    });
  });
}
