const router = require('express').Router();
const {getDownloadURL, getStorage, ref, uploadBytes} = require("firebase/storage");
const cache = require('../../cache/memoryCache');
const key = 'boxScores';
const boxScoresFileName = 'boxScores.json';

router.get('/', async (req, res) => {
  if (cache.has(key)) {
    console.log('Cache has boxScores!');
    res.json(cache.get(key))
  } else {
    console.log('Cache does NOT have boxScores!');
    const storage = getStorage();
    const storageRef = ref(storage, boxScoresFileName);
    const file = await getDownloadURL(storageRef);

    fetch(file).then(boxScoresFile => boxScoresFile.json()).then((data) => {
      cache.set(key, data);
      console.log('boxScores Cache set: ', cache.has(key));
      res.json(data);
    });
  }
});

router.post('/', (req, res) => {
  cache.set(key, req.body);
  const storage = getStorage();
  const storageRef = ref(storage, boxScoresFileName);

  const jsn = JSON.stringify(req.body, null, 2);
  const blob = new Blob([jsn], {type: 'application/json'});
  const file = new File([blob], boxScoresFileName);

  uploadBytes(storageRef, file).then(() => {
    console.log('Uploaded Box Scores To Firebase!');
    res.json({"message": "Updated file successfully"});
  });
});

module.exports = router;
