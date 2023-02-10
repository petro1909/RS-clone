import settings from '../store/settings';
import { IRegisterUser, IUser } from '../types';
import baseFetch from './baseFetch';

const ENDPOINT = `${settings.SERVER}/users`;

const getById = async (id: string) => baseFetch<IUser>(`${ENDPOINT}/${id}`, 'GET');

const create = async (registerUser: IRegisterUser) => baseFetch<IRegisterUser>(`${ENDPOINT}/register`, 'POST', JSON.stringify(registerUser));

// const createUserBoard = async (userId: string, boardName: string) => {
//   const newBoard = { name: boardName, userId };
//   return baseFetch<IUser>(`${ENDPOINT}`, 'POST', JSON.stringify(newBoard));
// };

// const updateBoard = async (board: IUser) =>
// baseFetch<IUser>(`${ENDPOINT}`, 'PUT', JSON.stringify(board));

// const deleteBoard = async (id: string) => baseFetch<IUser>(`${ENDPOINT}/${id}`, 'DELETE');

const users = {
  getById,
  create,
};

export default users;
