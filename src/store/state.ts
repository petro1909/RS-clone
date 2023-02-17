import { IState } from '../types';

const state: IState = {
  user: undefined,
  isAuthorized: false,
  currentPage: 'Main',
  activeBoardId: '',
  activeBoardUsers: [],
  token: '',
  statuses: [],
};

export default state;
