const router = require('express').Router();
const {getDownloadURL, getStorage, ref, uploadBytes} = require("firebase/storage");
const NodeCache  = require("node-cache");
const boxScoresCache = new NodeCache ({ stdTTL: 9999 * 9999 });
const key = 'boxScores';


router.get('/', async (req, res) => {
  if (boxScoresCache.has(key)) {
    console.log('Cache has boxScores!');
    res.json(boxScoresCache.get(key))
  } else {
    console.log('Cache does NOT have boxScores!');
    const storage = getStorage();
    const storageRef = ref(storage, 'boxScores.json');
    const file = await getDownloadURL(storageRef);

    fetch(file).then(boxScoresFile => boxScoresFile.json()).then((data) => {
      boxScoresCache.set(key, data);
      console.log('boxScores Cache set: ', boxScoresCache.has(key));
      res.json(data);
    });
  }
});

router.post('/', (req, res) => {
  boxScoresCache.set(key, req.body);
  const storage = getStorage();
  const storageRef = ref(storage, 'boxScores.json');

  const jsn = JSON.stringify(req.body, null, 2);
  const blob = new Blob([jsn], {type: 'application/json'});
  const file = new File([blob], 'boxScores.json');

  uploadBytes(storageRef, file).then((snapshot) => {
    console.log('Uploaded Box Scores To Firebase!');
    res.json({"message": "Updated file successfully"});
  });
});



module.exports = router;
