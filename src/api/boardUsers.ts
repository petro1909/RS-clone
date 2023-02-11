import settings from '../store/settings';
import { IBoardUser } from '../types';
import baseFetch from './baseFetch';

const ENDPOINT = `${settings.SERVER}/boardUsers`;

const getBoardUsers = async (id: string) => baseFetch<IBoardUser[]>(`${ENDPOINT}/?boardId=${id}`, 'GET');

// const createUserBoard = async (userId: string, boardName: string) => {
//   const newBoard = { name: boardName, userId };
//   return baseFetch<IUser>(`${ENDPOINT}`, 'POST', JSON.stringify(newBoard));
// };

// const updateBoard = async (board: IUser) =>
// baseFetch<IUser>(`${ENDPOINT}`, 'PUT', JSON.stringify(board));

// const deleteBoard = async (id: string) => baseFetch<IUser>(`${ENDPOINT}/${id}`, 'DELETE');

const boardUsers = {
  getBoardUsers,
};

export default boardUsers;
