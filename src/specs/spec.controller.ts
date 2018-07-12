import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as mongoose from 'mongoose';
import { config } from '../config';
import { EntityTypes } from '../helpers/enums';
import { EntityConfig, user_entity } from './entity_config';
import { UserController } from '../user/user.controller';
import { ServerError, ClientError } from '../errors/application';
import { Controller } from '../helpers/generic.controller';

const expect: Chai.ExpectStatic = chai.expect;
const TOTAL_ITEMS = 4;

export function runTests(controller: Controller<any>) {
  let testItems;
  describe(`Test type ${controller.controllerType}`, () => {

    before(() => {
      testItems = controller.createItems(TOTAL_ITEMS);
    });

    beforeEach(async () => {
      await controller.model.remove({}, (err: Error) => { });
      await Promise.all(testItems.map(item => controller.add(item)));
    });

    describe('#getById', () => {
      it('should return a user by its id', async () => {
        const item = await controller.getById(testItems[0]._id);
        expect(testItems[0].equals(item)).to.be.true;
      });
    });

    describe('#getAll', () => {
      it(`should return a collection with ${TOTAL_ITEMS} items`, async () => {
        const itemsReturned = await controller.getAll();
        expect(itemsReturned).to.not.be.empty;
        expect(itemsReturned).to.have.lengthOf(testItems.length);
      });
    });

    describe('#add', () => {
      it('should add a new item to the collection', async () => {
        const user = controller.createItems(1)[0];
        await controller.add(user);
        const usersReturned = await controller.getAll();
        expect(usersReturned).to.not.be.empty;
        expect(usersReturned).to.have.lengthOf(testItems.length + 1);
      });
      it('should throw exception when trying to add new item with existed id', async () => {
        try {
          await controller.add(testItems[0]);
          expect(false).to.be.true;
        } catch (err) {
          expect(err).to.be.instanceof(ServerError);
        }
      });
    });

    describe('#deleteById', () => {
      it('should delete a single user', async () => {
        await controller.deleteById(testItems[0]._id);
        const usersReturned = await controller.getAll();
        expect(usersReturned).to.have.lengthOf(TOTAL_ITEMS - 1);
      });
      it('should throw UserNotFoundError for trying to delete non-existent user', async () => {
        try {
          await controller.deleteById('non-existent user');
          expect(false).to.be.true;
        } catch (err) {
          expect(err).to.be.instanceof(ClientError);
          expect(err.status).to.be.equal(404);
        }
      });
    });

    describe('#update', () => {
      it('should update the name of the item', async () => {
        await controller.update(testItems[0]._id, { _id: testItems[0]._id, name: 'newName' });
        const updatedUser = await controller.getById(testItems[0]._id);
        expect(updatedUser.name).to.be.equal('newName');
      });
      it('should throw exception when trying to update a non-existent item', async () => {
        try {
          await controller.update('non_existent_id', { name: 'ErrorName' });
          expect(false).to.be.true;
        } catch (err) {
          expect(err).to.be.instanceof(ClientError);
          expect(err.status).to.be.equal(404);
        }
      });
      it('should throw exception when trying to update a wrong item', async () => {
        try {
          await controller.update('non_existent_id', { _id: 'badId', name: 'ErrorName' });
          expect(false).to.be.true;
        } catch (err) {
          expect(err).to.be.instanceof(ClientError);
          expect(err.status).to.be.equal(422);
        }

      });
    });

  });
}
