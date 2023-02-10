import settings from '../store/settings';
import { IBoard } from '../types';
import baseFetch from './baseFetch';

const ENDPOINT = `${settings.SERVER}/boards`;

const getUserBoards = async (id: string) => baseFetch<IBoard[]>(`${ENDPOINT}/?userId=${id}`, 'GET');

const createUserBoard = async (userId: string, boardName: string) => {
  const newBoard = { name: boardName, userId };
  return baseFetch<IBoard>(`${ENDPOINT}`, 'POST', JSON.stringify(newBoard));
};

const updateBoard = async (board: IBoard) => baseFetch<IBoard>(`${ENDPOINT}`, 'PUT', JSON.stringify(board));

const deleteBoard = async (id: string) => baseFetch<IBoard>(`${ENDPOINT}/${id}`, 'DELETE');

const boards = {
  getUserBoards,
  createUserBoard,
  update: updateBoard,
  delete: deleteBoard,
};

export default boards;
