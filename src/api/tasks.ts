import settings from '../store/settings';
import baseFetch from './baseFetch';
import { ITask } from '../types';

const ENDPOINT = `${settings.SERVER}/tasks`;

const getStatusTasks = async (statusId: string) => baseFetch<ITask[]>(`${ENDPOINT}/?statusId=${statusId}&sort=order&order=ASC`, 'GET');

const getTaskById = async (taskId: string) => baseFetch<ITask>(`${ENDPOINT}/${taskId}`, 'GET');

// eslint-disable-next-line max-len
const getTasksByDate = async (statusId: string) => baseFetch<ITask[]>(`${ENDPOINT}/?statusId=${statusId}&sort=endDate&order=ASC`, 'GET');

const createTask = async (task: ITask) => baseFetch<ITask>(`${ENDPOINT}`, 'POST', JSON.stringify(task));

const updateTask = async (task: ITask) => baseFetch<ITask>(`${ENDPOINT}`, 'PUT', JSON.stringify(task));

const deleteTask = async (id: string) => baseFetch<ITask>(`${ENDPOINT}/${id}`, 'DELETE');

const tasks = {
  getByStatus: getStatusTasks,
  getTasksByDate,
  getById: getTaskById,
  create: createTask,
  update: updateTask,
  delete: deleteTask,
};

export default tasks;
