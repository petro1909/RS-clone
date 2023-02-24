import settings from '../store/settings';
import { IBoardMark } from '../types';
import baseFetch from './baseFetch';

const ENDPOINT = `${settings.SERVER}/boardMarks`;

const getMarksByBoard = async (boardId: string) => baseFetch<IBoardMark[]>(`${ENDPOINT}/?boardId=${boardId}`, 'GET');

const createBoardMark = async (newBoardMark: Omit<IBoardMark, 'id'>) => baseFetch<IBoardMark>(`${ENDPOINT}`, 'POST', JSON.stringify(newBoardMark));

const updateBoardMark = async (boardMark: IBoardMark) => baseFetch<IBoardMark>(`${ENDPOINT}`, 'PUT', JSON.stringify(boardMark));

const deleteBoardMark = async (id: string) => baseFetch<IBoardMark>(`${ENDPOINT}/${id}`, 'DELETE');

const boardMarks = {
  getByBoard: getMarksByBoard,
  create: createBoardMark,
  update: updateBoardMark,
  delete: deleteBoardMark,
};

export default boardMarks;
