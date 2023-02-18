import { IState } from '../types';

const state: IState = {
  user: undefined,
  isAuthorized: false,
  currentPage: 'Main',
  currentTable: 1,
  limitTables: 1,
  sortProperty: 'name',
  sortOrder: 'ASC',
  activeBoardId: '',
  activeBoardUsers: [],
  token: '',
  statuses: [],
};

export default state;
