const router = require('express').Router();
const boxScoresOnly = require('../../assets/boxScoresOnly.json');
const {getStream, getDownloadURL, getStorage, ref, uploadBytes} = require("firebase/storage");


router.get('/', async (req, res) => {
  const storage = getStorage();
  const storageRef = ref(storage, 'boxScores.json');
  const file = await getDownloadURL(storageRef);

  fetch(file).then(boxScoresFile => boxScoresFile.json()).then((data) => {
    res.json(data);
  });
});

router.post('/', (req, res) => {
  const storage = getStorage();
  const storageRef = ref(storage, 'boxScores.json');

  const jsn = JSON.stringify(req.body, null, 2);
  const blob = new Blob([jsn], {type: 'application/json'});
  const file = new File([blob], 'boxScores.json');

  uploadBytes(storageRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
    res.json({"message": "Updated file successfully"});
  });
});



module.exports = router;
