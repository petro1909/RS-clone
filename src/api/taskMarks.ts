import settings from '../store/settings';
import { ITaskMark } from '../types';
import baseFetch from './baseFetch';

const ENDPOINT = `${settings.SERVER}/taskMarks`;

const getMarksByTask = async (taskId: string) => baseFetch<ITaskMark[]>(`${ENDPOINT}/?taskId=${taskId}`, 'GET');

const createTaskMark = async (newTaskMark: Omit<ITaskMark, 'id'>) => baseFetch<ITaskMark>(`${ENDPOINT}`, 'POST', JSON.stringify(newTaskMark));

const deleteTaskMark = async (id: string) => baseFetch<ITaskMark>(`${ENDPOINT}/${id}`, 'DELETE');

const taskMarks = {
  getByTask: getMarksByTask,
  create: createTaskMark,
  delete: deleteTaskMark,
};

export default taskMarks;
