export interface IUser {
  id: string,
  name: string,
  email: string,
  // password: string,
  role: 'admin' | 'user'
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
}

export interface ITask {
  id: string,
  text: string,
  statusId: string,
}

export interface IState {
  user?: IUser,
  isAuthorized: boolean,
  currentPage: string,
  activeBoardId: string
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

export interface IRegisterUser {
  name: string,
  email: string,
  password: string,
}
