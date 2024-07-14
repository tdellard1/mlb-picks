const router = require('express').Router();
const schedulesURL = './server/assets/schedules.json';
const schedules = require('../../assets/schedules.json');
const {writeFile} = require("fs");
const NodeCache = require("node-cache");
const schedulesCache = new NodeCache({ stdTTL: 0 });

router.get('/', (req, res) => {
  if (schedulesCache.has('schedules')) {
    res.json(schedulesCache.get('schedules'));
  } else {
    schedulesCache.set('schedules', schedules);
    res.json(schedules);
  }
});

router.post('/', (req, res) => {
  console.log('Update Schedule Requested!');
  writeFile(schedulesURL, JSON.stringify(req.body, null, 2), err => {
    if (err) {
      console.log("Failed to write updated data to file", err);
      return;
    }
    res.json({"message": "Updated file successfully"});
  });
});

module.exports = router;



// const router = require('express').Router();
// const {getStorage, ref, uploadBytes, getDownloadURL} = require("firebase/storage");
// const NodeCache = require("node-cache");
//
// const schedulesCache = new NodeCache({ stdTTL: 0 });
// const key = 'schedules';
// const scheduleFileName = 'schedules.json';
//
// router.get('/', async (req, res) => {
//   if (schedulesCache.has(key)) {
//     console.log('Cache has schedules!');
//     res.json(schedulesCache.get(key))
//   } else {
//     console.log('Cache does NOT have schedules!');
//     const storage = getStorage();
//     const storageRef = ref(storage, scheduleFileName);
//     const file = await getDownloadURL(storageRef);
//
//     fetch(file).then(schedulesFile => schedulesFile.json()).then((data) => {
//       schedulesCache.set(key, data);
//       console.log('schedules Cache set: ', schedulesCache.has(key));
//       res.json(data);
//     });
//   }
// });
//
// router.post('/', (req, res) => {
//   schedulesCache.set(key, req.body);
//   const storage = getStorage();
//   const storageRef = ref(storage, scheduleFileName);
//
//   const jsn = JSON.stringify(req.body, null, 2);
//   const blob = new Blob([jsn], {type: 'application/json'});
//   const file = new File([blob], scheduleFileName);
//
//   uploadBytes(storageRef, file).then(() => {
//     console.log('Uploaded Schedules To Firebase!');
//     res.json({"message": "Updated file successfully"});
//   });
// });
//
// module.exports = router;
