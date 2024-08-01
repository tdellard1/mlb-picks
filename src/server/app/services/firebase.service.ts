import type {UploadTaskSnapshot, UploadTask} from '@firebase/storage';
import {FirebaseStorage, getStorage, ref, uploadBytesResumable} from "@firebase/storage";
import {StorageReference, getDownloadURL} from "@firebase/storage";
import {addToCache, exists} from "./cache.service.js";
import CliProgress, {SingleBar} from 'cli-progress';
import firebase from "../clients/firebase.client.js";

const storage: FirebaseStorage = getStorage(firebase);

export async function uploadFile<T>(fileName: string, fileData: T): Promise<any> {
    const storageRef: StorageReference = ref(storage, `${fileName}.json`);

    const fileString: string = JSON.stringify(fileData, null, 2);
    const blob: Blob = new Blob([fileString], {type: 'application/json'});
    const file: File = new File([blob], `${fileName}.json`);

    const uploadTask: UploadTask = uploadBytesResumable(storageRef, file);
    const progressBar: SingleBar = new CliProgress.SingleBar({
        format: ' {bar} | {fileName} | {value}/{total}',
        stopOnComplete: true
    }, CliProgress.Presets.shades_classic);

    progressBar.start(uploadTask.snapshot.totalBytes, 0);
    uploadTask.on('state_changed',
        ({bytesTransferred}: UploadTaskSnapshot): void => {
            progressBar.update(bytesTransferred, {fileName});
        });

    return uploadTask.then(({state}: UploadTaskSnapshot) => {
       return state;
    });
}

export async function downloadFile(keyFile: string): Promise<any[]> {
    const storageRef: StorageReference = ref(storage, `${keyFile}.json`);

    const fileUrl: string = await getDownloadURL(storageRef);
    const response: Response = await fetch(fileUrl);
    const reader: ReadableStreamDefaultReader<any> = response.body!.getReader();
    const contentLength: number = +response.headers.get('Content-Length')!;
    const chunks: any[] = [];
    const progressBar: SingleBar = new CliProgress.SingleBar({
        format: ' {bar} | {filename} | {value}/{total}'
    }, CliProgress.Presets.shades_classic);

    let receivedLength: number = 0;

    progressBar.start(contentLength, receivedLength);
    while (true) {
        const {done, value}: ReadableStreamReadResult<any> = await reader.read();

        if (done) {
            progressBar.stop();
            break;
        }

        chunks.push(value);
        receivedLength += value.length;
        progressBar.update(receivedLength, {filename: `${keyFile}.json`});
    }

    let chunksAll: Uint8Array = new Uint8Array(receivedLength);
    let position: number = 0;
    for (let chunk of chunks) {
        chunksAll.set(chunk, position); // (4.2)
        position += chunk.length;
    }

    let result: string = new TextDecoder("utf-8").decode(chunksAll);
    return JSON.parse(result);
}

export async function downloadFileWithType<T>(keyFile: string, type: { new(parse: any): T }): Promise<T[]> {
    const results: any[] = await downloadFile(keyFile);
    return results.map((result: string) => new type(result));
}

export const loadData = async (fileKeys: string[]): Promise<void> => {
    for (const fileKey of fileKeys) {
        const length: number = await exists(fileKey);

        if (length !== 0) {
            const data: any[] = await downloadFile(fileKey);
            console.log(`Adding ${fileKey} to Redis...`);

            const sortedByProps: any[] = data.sort((a, b) => {
                return Object.getOwnPropertyNames(a).length -Object.getOwnPropertyNames(b).length
            });

            const most = sortedByProps.pop();

            console.log('first: ', Object.getOwnPropertyNames(most));
            console.log('last: ', most);

            // await addToCache(fileKey, data);
        }
    }
}