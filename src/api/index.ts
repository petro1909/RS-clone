import auth from './auth';
import users from './users';
import boards from './boards';
import statuses from './statuses';
import tasks from './tasks';
import boardUsers from './boardUsers';
import admin from './admin';
import boardMarks from './boardMarks';
import taskMarks from './taskMarks';
import statistics from './statistics';

const api = {
  auth,
  users,
  boards,
  boardUsers,
  statuses,
  tasks,
  admin,
  boardMarks,
  taskMarks,
  statistics,
};

export default api;
