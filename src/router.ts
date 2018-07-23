import { userRouter } from './user/user.router';
import { folderRouter } from './folder/folder.router';

export function initRouter(app) {
  app.use('/api/user', userRouter);
  app.use('/api/folder', folderRouter);
  app.get('/', (req, res) => {
    res.send('Main page of the application');
  });

}
