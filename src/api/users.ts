import settings from '../store/settings';
import { IRegisterUser, IUser } from '../types';
import baseFetch from './baseFetch';

const ENDPOINT = `${settings.SERVER}/users`;

const getById = async (id: string) => baseFetch<IUser>(`${ENDPOINT}/${id}`, 'GET');

const create = async (registerUser: IRegisterUser) => baseFetch<IRegisterUser>(`${ENDPOINT}/register`, 'POST', JSON.stringify(registerUser));

const updateUser = async (user: IUser) => baseFetch<IUser>(`${ENDPOINT}`, 'PUT', JSON.stringify(user));

const getAvatar = async (id: string) => {
  const res = await baseFetch<{ url: string }>(`${ENDPOINT}/${id}/profilePicture`, 'GET');
  console.log('RES', res);
  if (res.success && res.data) {
    res.data.url = `${settings.SERVER}${res.data.url}`;
  }
  return res;
};

const uploadAvatar = async (id: string, file: FormData) => baseFetch<string>(`${ENDPOINT}/${id}/profilePicture`, 'POST', file);

const deleteAvatar = async (id: string) => baseFetch<string>(`${ENDPOINT}/${id}/profilePicture`, 'DELETE');
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
  update: updateUser,
  getAvatar,
  uploadAvatar,
  deleteAvatar,
};

export default users;
