export interface IUser {
  id: number,
  login: string,
  email: string,
  // password: string,
  role: 'admin' | 'user'
}

export interface IBoard {
  id: number,
  name: string
}

export interface IUserBoard {
  id: number,
  userId: number,
  boardId: number,
}

export interface IStatus {
  id: number,
  name: string,
  boardId: number,
}

export interface ITask {
  id: number,
  name: string,
  statusId: number,
}

export interface IState {
  user?: IUser,
  isAuthorized: boolean,
  currentPage: string,
  activeBoardId: number
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
