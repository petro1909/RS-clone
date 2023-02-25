import settings from '../store/settings';
import baseFetch from './baseFetch';
import { IServerLogEntity } from '../types';

const ENDPOINT = `${settings.SERVER}/administration/statistics`;

const getAllServerLogs = async () => baseFetch<IServerLogEntity[]>(`${ENDPOINT}`, 'GET');
const getServerLogs = async (page: string, limit: string) => baseFetch<IServerLogEntity[]>(`${ENDPOINT}/?page=${page}&limit=${limit}`, 'GET');
const deleteLogById = async (id: string) => baseFetch<IServerLogEntity[]>(`${ENDPOINT}/${id}`, 'GET');

const statistics = {
  getAllLogs: getAllServerLogs,
  getLogsPage: getServerLogs,
  delete: deleteLogById,
};

export default statistics;
