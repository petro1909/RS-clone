import { IState } from '../types';

const state: IState = {
  user: undefined,
  isAuthorized: false,
  currentPage: 'Main',
  currentTable: 1,
  currentLogTable: 1,
  currentTableView: 'users',
  limitTables: 1,
  limitLogTables: 1,
  sortProperty: 'name',
  sortOrder: 'ASC',
  activeBoardId: '',
  activeBoardUsers: [],
  token: '',
  statuses: [],
};

export default state;
