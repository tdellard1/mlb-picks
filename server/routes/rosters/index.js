const router = require('express').Router();
const {getStorage, ref, uploadBytes, getDownloadURL} = require("firebase/storage");
const cache = require('../../cache/memoryCache');
const key = 'rosters';
const rosterFileName = 'rosters.json';

router.get('/', async (req, res) => {
  if (cache.has(key)) {
    console.log('Cache has rosters!');
    res.json(cache.get(key))
  } else {
    console.log('Cache does NOT have rosters!');
    const storage = getStorage();
    const storageRef = ref(storage, rosterFileName);
    const file = await getDownloadURL(storageRef);

    fetch(file).then(rostersFile => rostersFile.json()).then((data) => {
      cache.set(key, data);
      console.log('rosters Cache set: ', cache.has(key));
      res.json(data);
    });
  }
});

router.post('/', (req, res) => {
  cache.set(key, req.body);
  const storage = getStorage();
  const storageRef = ref(storage, rosterFileName);

  const jsn = JSON.stringify(req.body, null, 2);
  const blob = new Blob([jsn], {type: 'application/json'});
  const file = new File([blob], rosterFileName);

  uploadBytes(storageRef, file).then(() => {
    console.log('Uploaded Rosters To Firebase!');
    res.json({"message": "Updated file successfully"});
  });
});

module.exports = router;
