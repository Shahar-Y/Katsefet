import * as express from 'express';
import * as mongoose from 'mongoose';
import { IFile } from '../file.interface';
import { fileModel } from '../file.model';
import { s3 } from './storage.manager';
import { bucketName } from './storage.config';
import * as FS from 'fs';

export class storageService {

  public static delete(filePath: string) {
    const params = {
      Bucket: bucketName,
      Delete: {
        Objects: [
          {
            Key: filePath
          },
        ],
      },
    };

    s3.deleteObjects(params, (err, data) => {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
  }

  public static update(newPath: string, oldPath: string) {
    const copyParams = {
      Bucket: bucketName,
      CopySource: `${bucketName}${oldPath}`,
      Key: newPath };
    const deleteParams = {
      Bucket: bucketName,
      Delete: {
        Objects: [
          {
            Key: oldPath
          },
        ],
      },
    };
    // Copy the object to a new location
    s3.copyObject(copyParams)
      .promise()
      .then(() =>
        // Delete the old object
        s3.deleteObjects(deleteParams, (err, data) => {
          if (err) console.log(err, err.stack); // an error occurred
          else     console.log(data);           // successful response
        }));
  }

  public static download(filePath: string) {
    const writePath = './tempStorage/' + filePath;
    const params = { Bucket: bucketName, Key: filePath };
    const file = FS.createWriteStream(writePath);
    s3.getObject(params).
      on('httpData', (chunk) => {
        file.write(chunk);
      }).
      on('httpDone', () => {
        file.end();
      }).
      send();
  }
}
