const router = require('express').Router();
const {getStorage, ref, uploadBytes, getDownloadURL} = require("firebase/storage");
const rosterFile = 'rosters.json';

router.get('/', async (req, res) => {
  const storage = getStorage();
  const storageRef = ref(storage, rosterFile);
  const file = await getDownloadURL(storageRef);

  fetch(file).then(rostersFile => rostersFile.json()).then((data) => {
    res.json(data);
  });
});

router.post('/', (req, res) => {
  const storage = getStorage();
  const storageRef = ref(storage, rosterFile);

  const jsn = JSON.stringify(req.body, null, 2);
  const blob = new Blob([jsn], {type: 'application/json'});
  const file = new File([blob], rosterFile);

  uploadBytes(storageRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
    res.json({"message": "Updated file successfully"});
  });
});

module.exports = router;
