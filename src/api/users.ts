import settings from '../store/settings';
import { IRegisterUser, IUser } from '../types';
import baseFetch from './baseFetch';

const ENDPOINT = `${settings.SERVER}/users`;

const getById = async (id: string) => baseFetch<IUser>(`${ENDPOINT}/${id}`, 'GET');

const getAllUsers = async () => baseFetch<IUser[]>(`${ENDPOINT}`, 'GET');

const getGroupUsers = async (page: Number, limit: Number) => baseFetch<IUser[]>(`${ENDPOINT}/?page=${page}&limit=${limit}`, 'GET');

const searchGroup = async (
  word: string,
  page: number,
  limit: number,
  field: string,
  order: string,
) => baseFetch<IUser[]>(`${ENDPOINT}/?search=${word}&page=${page}&limit=${limit}&sort=${field}&order=${order}`, 'GET');

const searchAllUsers = async (
  word: string,
) => baseFetch<IUser[]>(`${ENDPOINT}/?search=${word}`, 'GET');

const sortUsers = async (
  field: string,
  order: string,
  page: number,
  limit: number,
) => baseFetch<IUser[]>(`${ENDPOINT}/?sort=${field}&order=${order}&page=${page}&limit=${limit}`, 'GET');

const create = async (registerUser: IRegisterUser) => baseFetch<IRegisterUser>(`${ENDPOINT}/register`, 'POST', JSON.stringify(registerUser));

const updateUser = async (user: IUser) => baseFetch<IUser>(`${ENDPOINT}`, 'PUT', JSON.stringify(user));

const deleteUser = async (id: string) => baseFetch<IUser>(`${ENDPOINT}/${id}`, 'DELETE');

const getAvatar = async (id: string) => {
  const res = await baseFetch<{ profilePicture: string }>(`${ENDPOINT}/${id}/profilePicture`, 'GET');
  if (res.success && res.data) {
    res.data.profilePicture = `${settings.SERVER}${res.data.profilePicture}`;
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
  getAllUsers,
  getGroupUsers,
  getById,
  create,
  update: updateUser,
  delete: deleteUser,
  getAvatar,
  uploadAvatar,
  deleteAvatar,
  searchAll: searchAllUsers,
  searchGroup,
  sort: sortUsers,
};

export default users;
