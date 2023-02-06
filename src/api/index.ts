import auth from './auth';
import boards from './boards';
import userBoards from './userboard';
import statuses from './statuses';

const api = {
  auth,
  boards,
  userBoards,
  statuses,
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
