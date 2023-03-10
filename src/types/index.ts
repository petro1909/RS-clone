export interface IUser {
  id: string,
  name: string,
  email: string,
  profilePicture: string,
  // password: string,
  role: string
}

export interface IBoard {
  id: string,
  name: string
}

export interface IUserBoard {
  id: string,
  userId: string,
  boardId: string,
}

export interface IStatus {
  id: string,
  name: string,
  boardId: string,
  order: number,
}

export interface ITask {
  id: string,
  name: string,
  description?: string,
  order: number,
  done?: boolean,
  startDate?: Date,
  endDate?: Date,
  statusId: string,
}

export interface IState {
  user?: IUser,
  isAuthorized: boolean,
  currentPage: string,
  currentTable: number,
  currentLogTable: number,
  currentTableView: string,
  limitTables: number,
  limitLogTables: number,
  sortProperty: string,
  sortOrder: string,
  activeBoardId: string,
  activeBoardUsers: IActiveBoardUser[],
  token: string,
  statuses: IStatus[],
}

export interface Ilogin {
  [key: string]: string,
  email: string,
  password: string
}

export interface ISignin {
  [key: string]: string,
  login: string,
  email: string,
  password: string
}

export interface ISnackMessage {
  type: 'error' | 'success' | 'warning',
  statusCode: number,
  text: string,
  details: string
}

export interface IFormTask {
  [key: string]: string,
  taskname: string,
  description: string,
  deadline: string,
  assignee: string
}

export interface IBoardUser {
  id: string,
  boardId: string,
  userId: string,
  role: string,
}

export interface IActiveBoardUser {
  id: string,
  boardId: string,
  userId: string,
  role: string,
  user: IUser,
}

export interface ITaskUser {
  id: string,
  taskId: string,
  boardUserId: string,
}

export interface IRegisterUser {
  name: string,
  email: string,
  password: string,
}

export enum UserRole {
  user = 'USER',
  admin = 'ADMIN',
}

export interface IBoardMark {
  id: string,
  name: string,
  color: string,
  boardId: string
}

export interface ITaskMark {
  id: string,
  taskId: string,
  boardMarkId: string
}

export interface ITaskAttach {
  id: string,
  name: string,
  path: string,
  taskId: string,
  type: string,
}

export interface IServerLogEntity {
  id: string,
  logDate: Date,
  url: string,
  method: string,
  os: string,
  browser: string,
}
