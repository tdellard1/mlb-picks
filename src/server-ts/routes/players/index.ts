// -------------------------------------------------------------------
// PLAYERS
// -------------------------------------------------------------------

import express from "express";
import {storage} from "../../singletons/firebase.js";
import {ref, getDownloadURL} from "firebase/storage";
import {getList, listAddAll, length} from "../../singletons/redis.js";

const router = express.Router();
const key = 'players';

router.get('/', async (req, res) => {
  let results;

  try {
    const cacheResults = await getList(key);
    if (cacheResults) {
      results = cacheResults.map((result: string) => JSON.parse(result));
      res.send(results);
    } else {
      const storageRef = ref(storage, `${key}.json`);
      const file = await getDownloadURL(storageRef);

      fetch(file).then(file => file.json()).then((data) => {
        listAddAll(key,data.map((d: any) => JSON.stringify(d)));
        res.json(data);
      });
    }
  } catch (error) {
    console.error(error);
    res.status(404);
  }
});

router.get('/count', async (req, res) => {
  const count = await length(key);
  res.send({ count });
});

export default router;
