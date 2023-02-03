import { IUser } from '../types';

const SERVER = 'http://localhost:3000';
const ENDPOINT = `${SERVER}/users`;

const getUser = async (email: string) => {
  try {
    const req = await fetch(`${ENDPOINT}/?email=${email}`);
    console.log('REQ', req);
    if (req.status !== 200) throw new Error();
    const winner: IUser[] = await req.json();
    if (!winner.length) throw new Error();
    console.log(winner);
    return { success: true, data: winner };
  } catch (error) {
    return { success: false };
  }
};

export default getUser;
