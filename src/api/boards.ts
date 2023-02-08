import settings from '../store/settings';
import { IBoard } from '../types';
import baseFetch from './baseFetch';

const ENDPOINT = `${settings.SERVER}/boards`;

const getBoard = async (id: number) => baseFetch<IBoard>(`${ENDPOINT}/${id}`, 'GET');

const createBoard = async (boardName: string) => {
  const newBoard = { name: boardName };
  return baseFetch<IBoard>(`${ENDPOINT}`, 'POST', JSON.stringify(newBoard));
};

const updateBoard = async (board: IBoard) => {
  const { id, name } = board;
  return baseFetch<IBoard>(`${ENDPOINT}/${id}`, 'PUT', JSON.stringify({ name }));
};

const deleteBoard = async (id: number) => baseFetch<IBoard>(`${ENDPOINT}/${id}`, 'DELETE');

const boards = {
  getBoard,
  create: createBoard,
  update: updateBoard,
  delete: deleteBoard,
};

export default boards;
