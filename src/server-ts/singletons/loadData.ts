import {ref, getDownloadURL} from "firebase/storage";
import {has, listAddAll} from './redis.js';
import { storage } from "./firebase.js"

const firebaseFileKeys: string[] = ['boxScores', 'rosters', 'teams', 'slates', 'schedules', 'players'];

const loadData = async () => {
  for (const fileKey of firebaseFileKeys) {
    const redisData: number = await has(fileKey);

    if (!redisData) {
      const data = await load(fileKey);
      console.log(`Adding ${fileKey} to Redis...`);

      const count: number = await listAddAll(fileKey, data);
      console.log(`Set ${count} ${fileKey}`);
    }
  }
}

function load(keyFile: string): Promise<any> {
  return new Promise((resolve) => {
    const storageRef = ref(storage, `${keyFile}.json`);
    getDownloadURL(storageRef).then((url) => {
      fetch(url)
        .then(file => file.json())
        .then((data) => {
          resolve(data.map((d: any) => JSON.stringify(d)));
        });
    });
  });
}

export default loadData;
