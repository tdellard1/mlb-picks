const router = require('express').Router();
const {ref, uploadBytes, getStorage, getDownloadURL} = require("firebase/storage");
const {storage} = require("../../firebase.init");
const redis = require("../../singletons/redis");
const key = 'slates';

router.get('/', async (req, res) => {
  let results;

  try {
    const cacheResults = await redis.getList(key);
    if (cacheResults) {
      results = cacheResults.map(result => JSON.parse(result));
      console.log(results.length);
      res.send(results);
    } else {
      const storage = getStorage();
      const storageRef = ref(storage, `${key}.json`);
      const file = await getDownloadURL(storageRef);

      fetch(file).then(file => file.json()).then((data) => {
        redis.listAddAll(data.map(d => JSON.stringify(d)));
        res.json(data);
      });
    }
  } catch (error) {
    console.error(error);
    res.status(404);
  }
});

router.post('/', (req, res) => {
  const storageRef = ref(storage, `${key}.json`);

  const jsn = JSON.stringify(req.body, null, 2);
  const blob = new Blob([jsn], {type: 'application/json'});
  const file = new File([blob], `${key}.json`);

  console.log(req.body.length);

  uploadBytes(storageRef, file).then(async () => {
    console.log('Uploaded Box Scores To Firebase!');
    await redis.delete(key);
    await redis.listAddAll(key, req.body.map(d => JSON.stringify(d)));
    res.json({"message": "Updated file successfully"});
  });
});

module.exports = router;
