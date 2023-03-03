import settings from '../store/settings';
import { IBoardUser } from '../types';
import baseFetch from './baseFetch';

const ENDPOINT = `${settings.SERVER}/boardUsers`;

const getBoardUsers = async (id: string) => baseFetch<IBoardUser[]>(`${ENDPOINT}/?boardId=${id}`, 'GET');

const createBoardUser = async (userId: string, boardId: string) => baseFetch<IBoardUser>(`${ENDPOINT}`, 'POST', JSON.stringify({ userId, boardId }));

const removeBoardUser = async (id: string) => baseFetch<IBoardUser[]>(`${ENDPOINT}/${id}`, 'DELETE');

const boardUsers = {
  getBoardUsers,
  create: createBoardUser,
  remove: removeBoardUser,
};

export default boardUsers;
