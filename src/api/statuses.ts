import settings from '../store/settings';
import { IStatus } from '../types';
import baseFetch from './baseFetch';

const ENDPOINT = `${settings.SERVER}/statuses`;

const getBoardStatuses = async (boardId: string) => baseFetch<IStatus[]>(`${ENDPOINT}/?boardId=${boardId}`, 'GET');

const createStatus = async (boardId: string, name: string, order: number) => {
  const statusData = { name, boardId, order };
  return baseFetch<IStatus>(`${ENDPOINT}`, 'POST', JSON.stringify(statusData));
};

const getStatusById = async (statusId: string) => baseFetch<IStatus>(`${ENDPOINT}/${statusId}`, 'GET');

const updateStatus = async (status: IStatus) => baseFetch<IStatus>(`${ENDPOINT}`, 'PUT', JSON.stringify(status));

const deleteStatusesByBoard = async (boardId: string) => baseFetch<IStatus[]>(`${ENDPOINT}/?boardId=${boardId}`, 'DELETE');

const deleteStatus = async (id: string) => baseFetch<IStatus>(`${ENDPOINT}/${id}`, 'DELETE');

const statuses = {
  getByBoard: getBoardStatuses,
  create: createStatus,
  update: updateStatus,
  deleteByBoard: deleteStatusesByBoard,
  delete: deleteStatus,
  getStatus: getStatusById,
};

export default statuses;
