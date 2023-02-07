import settings from '../store/settings';
import { IStatus } from '../types';
import baseFetch from './baseFetch';

const ENDPOINT = `${settings.SERVER}/statuses`;

const getBoardStatuses = async (boardId: number) => baseFetch<IStatus[]>(`${ENDPOINT}/?boardId=${boardId}`, 'GET');

const createStatus = async (boardId: number, name: string) => {
  const statusData = { name, boardId };
  return baseFetch<IStatus>(`${ENDPOINT}`, 'POST', JSON.stringify(statusData));
};

const deleteStatusesByBoard = async (boardId: number) => baseFetch<IStatus[]>(`${ENDPOINT}/?boardId=${boardId}`, 'DELETE');

const deleteStatus = async (id: number) => baseFetch<IStatus>(`${ENDPOINT}/${id}`, 'DELETE');

const statuses = {
  getByBoard: getBoardStatuses,
  create: createStatus,
  deleteByBoard: deleteStatusesByBoard,
  delete: deleteStatus,
};

export default statuses;
