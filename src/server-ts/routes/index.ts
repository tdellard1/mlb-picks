import express, {Router} from "express";
import {Request, Response} from "express-serve-static-core";
import {getList, length, listAddAll, remove, metaData} from "../singletons/redis.js";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import {uploadFile} from "../singletons/firebase.js";

const router: Router = express.Router();

router.use("/domain", async (request: Request, response: Response): Promise<any> => {
  let results;
  const key: string = request.query['type'] as string;

  try {
    const cacheResults: any = await getList(key);
    if (cacheResults) {
      results = cacheResults.map((result: string) => JSON.parse(result));
      response.send(results);
    } else {
      const storage = getStorage();
      const storageRef = ref(storage, `${key}.json`);
      const file = await getDownloadURL(storageRef);

      fetch(file).then(file => file.json()).then((data) => {
        listAddAll(key, data.map((d: any) => JSON.stringify(d)));
        response.json(data);
      });
    }
  } catch (error) {
    console.error(error);
    response.status(404);
  }
});

router.get('/metaData', async (request: Request, response: Response): Promise<void> => {
  response.send({metaData});
});

router.post('/domain', async (request: Request, response: Response) => {
  const key: string = request.query['type'] as string;
  const data: any[] = request.body;

  const {uploaded, reason}: { uploaded: boolean, reason: string } = await uploadFile(key, data);

  if (uploaded) {
    await remove(key);
    const added: number = await listAddAll(key, data.map((d: any[]) => JSON.stringify(d)));
    response.json({message: "Uploaded file successfully", added});
  } else {
    response.json({message: "Uploaded failed to upload!", reason});
  }
});

export default router;
