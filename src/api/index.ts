import auth from './auth';
import users from './users';
import boards from './boards';
// import userBoards from './userboard';
import statuses from './statuses';
import tasks from './tasks';
import boardUsers from './boardUsers';
import admin from './admin';

const api = {
  auth,
  users,
  boards,
  boardUsers,
  statuses,
  tasks,
  admin,
};

export default api;
// import { IUser } from '../types';
// import errorHandler from '../services/errorHandler';

// const SERVER = 'http://localhost:3000';
// const ENDPOINT = `${SERVER}/users`;

// const getUser = async (email: string) => {
//   try {
//     const req = await fetch(`${ENDPOINT}/?email=${email}`);
//     console.log('REQ', req);
//     // if (req.status !== 200) throw new Error();
//     const winner: IUser[] = await req.json();
//     // if (!winner.length) throw new Error();
//     console.log(winner);
//     return { success: true, data: winner };
//   } catch (error) {
//     const err = error as Error;
//     errorHandler(err);
//     return { success: false };
//   }
// };

// export default getUser;
