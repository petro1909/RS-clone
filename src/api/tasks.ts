import settings from '../store/settings';
import baseFetch from './baseFetch';
import { ITask } from '../types';

const ENDPOINT = `${settings.SERVER}/tasks`;

const getStatusTasks = async (statusId: string) => baseFetch<ITask[]>(`${ENDPOINT}/?statusId=${statusId}`, 'GET');

const getTaskById = async (taskId: string) => baseFetch<ITask>(`${ENDPOINT}/${taskId}`, 'GET');

const createTask = async (statusId: string, content: string) => {
  const taskData = { text: content, statusId };
  return baseFetch<ITask>(`${ENDPOINT}`, 'POST', JSON.stringify(taskData));
};

const updateTask = async (task: ITask) => baseFetch<ITask>(`${ENDPOINT}`, 'PUT', JSON.stringify(task));

const deleteTask = async (id: string) => baseFetch<ITask>(`${ENDPOINT}/${id}`, 'DELETE');

const tasks = {
  getByStatus: getStatusTasks,
  getById: getTaskById,
  create: createTask,
  update: updateTask,
  delete: deleteTask,
};

export default tasks;
