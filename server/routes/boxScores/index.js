const router = require('express').Router();
const boxScoresURL = './server/assets/boxScores.json';
const boxScoresOnlyURL = './server/assets/boxScoresOnly.json';
const boxScores = require('../../assets/boxScores.json');
const boxScoresOnly = require('../../assets/boxScoresOnly.json');
const {writeFile} = require("fs");
const {getStream, getDownloadURL, getStorage, ref, uploadBytes} = require("firebase/storage");

router.get('/', (req, res) => {
  res.json(boxScoresOnly);
});

// router.get('/only', (req, res) => {
//   console.log('requesting BoxScores');
//   res.json(boxScoresOnly);
// });

// router.post('/', (req, res) => {
//   console.log('Update BoxScore Requested!');
//   writeFile(boxScoresURL, JSON.stringify(req.body, null, 2), err => {
//     if (err) {
//       console.log("Failed to write updated data to file", err);
//       return;
//     }
//     res.json({"message": "Updated file successfully"});
//   });
// });

// router.post('/only', (req, res) => {
//   console.log('Update BoxScore Requested!');
//   writeFile(boxScoresOnlyURL, JSON.stringify(req.body, null, 2), err => {
//     if (err) {
//       console.log("Failed to write updated data to file", err);
//       return;
//     }
//     res.json({"message": "Updated file successfully"});
//   });
// });

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
  });
});



module.exports = router;
