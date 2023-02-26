import auth from './auth';
import users from './users';
import boards from './boards';
import statuses from './statuses';
import tasks from './tasks';
import boardUsers from './boardUsers';
import admin from './admin';
import boardMarks from './boardMarks';
import taskMarks from './taskMarks';
import taskUsers from './taskUsers';
import files from './taskAttachs';

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
  taskUsers,
  files,
};

export default api;
