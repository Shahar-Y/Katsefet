import { Controller } from '../helpers/generic.controller';
import { IFolder } from './folder.interface';
import { EntityTypes } from '../helpers/enums';
import { Model } from 'mongoose';
import { folderModel } from './folder.model';
import { createFolders } from '../helpers/functions';
import { FolderError, FolderNotFoundError, BadIdError } from '../errors/folder';
import { FolderService } from './folder.service';
import { ServerError } from '../errors/application';
import { FolderValidator } from './folder.validator';

export class FolderController extends Controller<IFolder>{
  public controllerType: EntityTypes;
  public model: Model<IFolder>;

  constructor() {
    super();
    this.controllerType = EntityTypes.FOLDER;
    this.model = folderModel;
  }

  public createItems(num: number): IFolder[] {
    return createFolders(num);
  }

  public async getById(id: string): Promise<IFolder> {
    if (!FolderValidator.isValidMongoId(id)) {
      throw new BadIdError();
    }
    const folder = await FolderService.getById(id);
    if (folder) {
      return <IFolder>folder;
    }
    throw new FolderNotFoundError();
  }

  public async getAll(): Promise<IFolder[]> {
    return FolderService.getAll();
  }

  public async getByName(name: string): Promise<IFolder[]> {
    return FolderService.getByName(name);
  }

  public async update(id: string, partial: Partial<IFolder>): Promise<IFolder> {
    if (!FolderValidator.isValidUpdate(id, partial)) {
      throw new BadIdError();
    }
    const updatedUser: IFolder = await FolderService.update(id, partial);
    if (updatedUser) {
      return updatedUser;
    }
    throw new FolderNotFoundError();
  }

  public async add(folder: IFolder): Promise<IFolder> {
    const newFolder: IFolder = new folderModel(folder);
    return FolderService.add(newFolder);
  }

  public async deleteById(id: string): Promise<any> {
    if (!FolderValidator.isValidMongoId(id)) {
      throw new FolderNotFoundError();
    }
    const res = await FolderService.deleteById(id);
    if (!res.ok) {
      throw new ServerError();
    } else if (res.n < 1) {
      throw new FolderNotFoundError();
    }
    return res;
  }

}
