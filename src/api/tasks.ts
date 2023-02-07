import settings from '../store/settings';
import baseFetch from './baseFetch';
import { ITask } from '../types';

const ENDPOINT = `${settings.SERVER}/tasks`;

const getStatusTasks = async (statusId: number) => baseFetch<ITask[]>(`${ENDPOINT}/?statusId=${statusId}`, 'GET');

const createTask = async (statusId: number, content: string) => {
  const taskData = { name: content, statusId };
  return baseFetch<ITask>(`${ENDPOINT}`, 'POST', JSON.stringify(taskData));
};

const deleteTask = async (id: number) => baseFetch<ITask>(`${ENDPOINT}/${id}`, 'DELETE');

const tasks = {
  getByStatus: getStatusTasks,
  create: createTask,
  delete: deleteTask,
};

export default tasks;
