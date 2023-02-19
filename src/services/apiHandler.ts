import api from '../api';
import state from '../store/state';
// import state from '../store/state';
import {
  IBoardUser, IStatus, ITask, IUser,
} from '../types';

const getUserWithAvatarURL = async (userIncorrectAvatar: IUser) => {
  const user = { ...userIncorrectAvatar };
  if (user.profilePicture) {
    const avatarRes = await api.users.getAvatar(user.id);
    if (avatarRes.data) {
      user.profilePicture = avatarRes.data.profilePicture;
    }
  } else {
    user.profilePicture = '';
  }
  return user;
};

const getUsersWithAvatars = async (users: IUser[]) => {
  const usersWithAvatars = users.map((user) => getUserWithAvatarURL(user));
  const data = await Promise.all(usersWithAvatars);
  return data;
};

const getBoardUsers = async (boardId: string) => {
  const boardUsersData = await api.boardUsers.getBoardUsers(boardId);
  const boardUsers = boardUsersData.data as IBoardUser[];
  const users = boardUsers.map((boardUser) => api.users.getById(boardUser.userId));
  const usersData = (await Promise.all(users)).map((user) => user.data) as IUser[];
  const usersWithAvatars = await getUsersWithAvatars(usersData);

  return usersWithAvatars;
};

const getBoardStatuses = async (boardId: string) => {
  const statuses = await api.statuses.getByBoard(boardId);
  if (!statuses.data) return undefined;
  state.statuses = statuses.data;
  console.log('STATE', state);
  return statuses.data;
};

const addStatus = async (boardId: string, statusName: string) => {
  const order = state.statuses.length
    ? Math.max(...state.statuses.map((status) => +status.order)) + 1 : 1;
  console.log('ORDER', state.statuses.length, state, order);
  const result = await api.statuses.create(boardId, statusName, order);
  return result;
};

const deleteStatus = async (id: string) => {
  const result = await api.statuses.delete(id);
  if (result.success) {
    state.statuses = state.statuses.filter((status) => status.id !== id);
  }
  return result;
};

const addTask = async (newTask: ITask) => {
  const tasks = (await api.tasks.getByStatus(newTask.statusId)).data as ITask[];
  console.log('NEWTASK', newTask);
  const order = tasks.length
    ? Math.max(...tasks.map((task) => +task.order)) + 1 : 1;
  const result = await api.tasks.create(Object.assign(newTask, { order }));
  return result;
};

const getTasksByDeadline = async () => {
  const statuses = (await api.statuses.getByBoard(state.activeBoardId)).data as IStatus[];
  const tasksResps = statuses.map((status) => api.tasks.getByStatus(status.id));
  const tasks = (await Promise.all(tasksResps))
    .map((task) => task.data)
    .flat()
    .filter((task) => task?.endDate);

  return tasks;
};

// const getUserBoards = async () => {
//   if (state.user) {
//     const userBoards = await api.userBoards.getByUser(state.user?.id);
//     console.log('userBoards', userBoards, state.user?.id);
//     const userBoardsData = userBoards.data as IUserBoard[];
//     const boards = userBoardsData.map((userBoard) => api.boards.getBoard(userBoard.boardId));
//     const data = (await Promise.all(boards)).map((board) => board.data);

//     return { success: true, data };
//   }
//   return { success: false };
// };

// const createBoard = async (boardName: string) => {
//   const newBoard = await api.boards.create(boardName);

//   if (newBoard.data?.id && state.user?.id) {
//     const boardUser = await api.userBoards.addUser(state.user?.id, newBoard.data?.id);
//     return boardUser;
//   }
//   return newBoard;
// };

// const deleteUserBoardsByBoard = async (boardId: number) => {
//   const userBoards = await api.userBoards.getByBoard(boardId);
//   const userBoardsData = userBoards.data as IUserBoard[];
//   const deletedBoard = userBoardsData.map((userBoard) => api.userBoards.delete(userBoard.id));
//   const results = (await Promise.all(deletedBoard)).map((board) => board.success);

//   if (results.every((result) => result)) return { success: true };
//   return { success: false };
// };

// const deleteStatusesByBoard = async (boardId: number) => {

// }

// const deleteBoard = async (boardId: number) => {
//   const resultDelBoard = await api.boards.delete(boardId);
//   const resultDelUserboards = await deleteUserBoardsByBoard(boardId);
//   // const resultDelStatuses = await api.statuses.deleteByBoard(boardId);
//   // console.log('RESULTSSS', resultDelStatuses);
//   if (resultDelBoard.success && resultDelUserboards) return { success: true };
//   return { success: false };
// };

const apiService = {
  getUserWithAvatarURL,
  getBoardUsers,
  getBoardStatuses,
  addStatus,
  deleteStatus,
  addTask,
  getTasksByDeadline,
};

export default apiService;
