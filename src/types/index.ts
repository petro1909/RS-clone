export interface IUser {
  id: number,
  login: string,
  email: string,
  password: string,
  role: 'admin' | 'user'
}

export interface IState {
  user: IUser | {},
  isAuthorized: boolean
}

export interface Ilogin {
  [key: string]: string;
  email: string,
  password: string
}

export interface ITask {
  [key: string]: string;
  taskname: string;
  description: string,
  deadline: string,
  assignee: string
}
