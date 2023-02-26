import settings from '../store/settings';
import { ITaskUser } from '../types';
import baseFetch from './baseFetch';

const ENDPOINT = `${settings.SERVER}/taskUsers`;

const getTaskUsers = async (id: string) => baseFetch<ITaskUser[]>(`${ENDPOINT}/?taskId=${id}`, 'GET');

const createTaskUser = async (taskId: string, boardUserId: string) => baseFetch<ITaskUser>(`${ENDPOINT}`, 'POST', JSON.stringify({ taskId, boardUserId }));

const deleteTaskUser = async (id: string) => baseFetch<ITaskUser>(`${ENDPOINT}/${id}`, 'DELETE');

const taskUsers = {
  getTaskUsers,
  create: createTaskUser,
  delete: deleteTaskUser,
};

export default taskUsers;
