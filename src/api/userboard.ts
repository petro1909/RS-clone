import settings from '../store/settings';
import { IUserBoard } from '../types';
import baseFetch from './baseFetch';

const ENDPOINT = `${settings.SERVER}/userBoards`;

const getByUser = async (userId: number) => baseFetch<IUserBoard[]>(`${ENDPOINT}/?userId=${userId}`, 'GET');

const getByBoard = async (boardId: number) => baseFetch<IUserBoard[]>(`${ENDPOINT}?boardId=${boardId}`, 'GET');

const addUserToBoard = async (userId: number, boardId: number) => {
  const newUserOnBoard = { userId, boardId };
  return baseFetch(`${ENDPOINT}`, 'POST', JSON.stringify(newUserOnBoard));
};

const deleteUserBoard = async (id: number) => baseFetch<IUserBoard>(`${ENDPOINT}/${id}`, 'DELETE');

const userBoards = {
  getByUser,
  getByBoard,
  addUser: addUserToBoard,
  delete: deleteUserBoard,
};

export default userBoards;
