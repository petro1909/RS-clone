import api from '../api';
import state from '../store/state';
// import state from '../store/state';
import {
  IBoardMark,
  IBoardUser, IStatus, ITask, ITaskMark, IUser,
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
  const activeBoardUsers = boardUsers.map((boardUser) => {
    const [user] = usersWithAvatars.filter((userWA) => boardUser.userId === userWA.id);
    const activeBoardUser = Object.assign(boardUser, { user });
    return activeBoardUser;
  });
  return activeBoardUsers;
};

const getBoardStatuses = async (boardId: string) => {
  const statuses = await api.statuses.getByBoard(boardId);
  if (!statuses.data) return undefined;
  state.statuses = statuses.data;
  return statuses.data;
};

const addStatus = async (boardId: string, statusName: string) => {
  const order = state.statuses.length
    ? Math.max(...state.statuses.map((status) => +status.order)) + 1 : 1;
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

const getTaskMarks = async (taskId: string) => {
  const taskMarks = (await api.taskMarks.getByTask(taskId)).data as ITaskMark[];
  const boardMarks = taskMarks.map((taskMark) => api.boardMarks.getById(taskMark.boardMarkId));
  const marks = (await Promise.all(boardMarks)).map((boardMark) => boardMark.data) as IBoardMark[];
  return marks;
};

const apiService = {
  getUserWithAvatarURL,
  getUsersWithAvatars,
  getBoardUsers,
  getBoardStatuses,
  addStatus,
  deleteStatus,
  addTask,
  getTasksByDeadline,
  getTaskMarks,
};

export default apiService;
