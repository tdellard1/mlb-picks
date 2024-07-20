import express from "express";
import {storage} from "../../singletons/firebase.js";
import {uploadBytes} from "firebase/storage";
import {ref, getDownloadURL} from "firebase/storage";
import {getList, listAddAll, remove, length} from "../../singletons/redis.js";

const router = express.Router();
const key = 'rosters';

router.get('/', async (req, res) => {
  let results;

  try {
    const cacheResults = await getList(key);
    if (cacheResults) {
      results = cacheResults.map(result => JSON.parse(result));
      res.send(results);
    } else {
      const storageRef = ref(storage, `${key}.json`);
      const file = await getDownloadURL(storageRef);

      fetch(file).then(file => file.json()).then((data) => {
        listAddAll(data.map(d => JSON.stringify(d)));
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

router.post('/', async (req, res) => {
  const storageRef = ref(storage, `${key}.json`);

  const jsn = JSON.stringify(req.body, null, 2);
  const blob = new Blob([jsn], {type: 'application/json'});
  const file = new File([blob], `${key}.json`);

  const oldLength = await length(key);
  console.log(oldLength, req.body.length);

  if (oldLength < req.body.length) {
    uploadBytes(storageRef, file).then(async () => {
      console.log(`Uploaded ${key} To Firebase!`);
      await remove(key);
      await listAddAll(key, req.body.map(d => JSON.stringify(d)));
      res.json({"message": "Updated file successfully"});
    });
  }
});

export default router;
