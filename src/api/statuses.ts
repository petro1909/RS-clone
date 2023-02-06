import settings from '../store/settings';
import { IStatus } from '../types';
import baseFetch from './baseFetch';

const ENDPOINT = `${settings.SERVER}/statuses`;

const getBoardStatuses = async (boardId: number) => baseFetch<IStatus[]>(`${ENDPOINT}/?boardId=${boardId}`, 'GET');

const deleteStatusesByBoard = async (boardId: number) => baseFetch<IStatus[]>(`${ENDPOINT}/?boardId=${boardId}`, 'DELETE');

const statuses = {
  getByBoard: getBoardStatuses,
  deleteByBoard: deleteStatusesByBoard,
};

export default statuses;
