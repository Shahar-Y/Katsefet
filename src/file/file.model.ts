import * as mongoose from 'mongoose';
import { IFile } from './file.interface';

const fileSchema: mongoose.Schema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  path: {
    type: String,
    required: true,
    unique: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
  },
  modifyDate: {
    type: Date,
  },
  Owner: {
    type: String,
    required: true,
  },
  Parent: {
    type: String,
    required: true,
  },
});

export let fileModel = mongoose.model<IFile>('File', fileSchema);