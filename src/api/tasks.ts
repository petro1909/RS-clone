import settings from '../store/settings';
import baseFetch from './baseFetch';
import { ITask } from '../types';

const ENDPOINT = `${settings.SERVER}/tasks`;

const getStatusTasks = async (statusId: number) => baseFetch<ITask[]>(`${ENDPOINT}/?statusId=${statusId}`, 'GET');

const createTask = async (statusId: number, content: string) => {
  const taskData = { name: content, statusId };
  return baseFetch<ITask>(`${ENDPOINT}`, 'POST', JSON.stringify(taskData));
};

const updateTask = async (status: ITask) => {
  const { id, name, statusId } = status;
  return baseFetch<ITask>(`${ENDPOINT}/${id}`, 'PATCH', JSON.stringify({ name, statusId }));
};

const deleteTask = async (id: number) => baseFetch<ITask>(`${ENDPOINT}/${id}`, 'DELETE');

const tasks = {
  getByStatus: getStatusTasks,
  create: createTask,
  update: updateTask,
  delete: deleteTask,
};

export default tasks;

// export interface ITask {
//   id: number,
//   name: string,
//   statusId: number,
// }

// const updateBoard = async (board: IBoard) => {
//   const { id, name } = board;
//   return baseFetch<IBoard>(`${ENDPOINT}/${id}`, 'PUT', JSON.stringify({ name }));
// };

// const updateStatus = async (status: IStatus) => {
//   const { id, name, boardId } = status;
//   return baseFetch<IStatus>(`${ENDPOINT}/${id}`, 'PATCH', JSON.stringify({ name, boardId }));
// };
