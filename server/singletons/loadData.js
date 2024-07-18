const {ref, getDownloadURL} = require("firebase/storage");
const firebaseFileKeys = ['boxScores', 'rosters', 'teams', 'slates', 'schedules', 'players'];
const redis = require('./redis');

module.exports = async () => {
  for (const fileKey of firebaseFileKeys) {
    const redisData = await redis.get(fileKey);

    if (!redisData) {
      const data = await loadData(fileKey);
      console.log('Adding data to Redis Client');

      await redis.set(fileKey, data);
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
          resolve(JSON.stringify(data));
        });
    });
  });
}
