import * as express from 'express';
import { IFile } from './file.interface';
import { fileModel } from './file.model';
import { fileService } from './file.service';

export class fileController {

  public static create(files: IFile[]) {
    const services: Promise<IFile>[] = files.map((val) => {
      return fileService.create(val);
    });
    return Promise.all(services);
  }

  public static getFiles(fieldType?: String, fieldName?: String) {
    return fileService.findFiles(fieldType, fieldName);
  }

  public static findById(fileId: String) {
    return fileService.findById(fileId);
  }

  public static delete(fileId: String) {
    return fileService.delete(fileId);
  }

  public static update(fileId: String, file: Partial<IFile>) {
    return fileService.update(fileId, file);
  }
}
