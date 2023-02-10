import settings from '../store/settings';
import { IBoard } from '../types';
import baseFetch from './baseFetch';

const ENDPOINT = `${settings.SERVER}/boards`;

const getUserBoards = async (id: number) => baseFetch<IBoard[]>(`${ENDPOINT}/?userId=${id}`, 'GET');

const createUserBoard = async (userId: number, boardName: string) => {
  const newBoard = { name: boardName, userId };
  return baseFetch<IBoard>(`${ENDPOINT}`, 'POST', JSON.stringify(newBoard));
};

const updateBoard = async (board: IBoard) => {
  const { id, name } = board;
  return baseFetch<IBoard>(`${ENDPOINT}/${id}`, 'PUT', JSON.stringify({ name }));
};

const deleteBoard = async (id: number) => baseFetch<IBoard>(`${ENDPOINT}/${id}`, 'DELETE');

const boards = {
  getUserBoards,
  createUserBoard,
  update: updateBoard,
  delete: deleteBoard,
};

export default boards;
