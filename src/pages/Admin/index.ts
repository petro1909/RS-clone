import api from '../../api';
import state from '../../store/state';
import { IUser, UserRole, IServerLogEntity } from '../../types';
import createElement from '../../utils/createElement';
import template from './template.html';
import templateUsersTableHeader from './template-users-table-header.html';
import templateLogsTableHeader from './template-logs-table-header.html';

import defaultUserIcon from '../../assets/img/task/default_user.svg';

class AdminPage {
  render(): void {
    document.title = 'Admin Page';
    document.body.classList.remove('body-scrollbar--invisible');
    document.body.innerHTML = `
    <app-header></app-header>
    ${template}`;
    this.setLastPages();
    this.paginationHandler();
    this.tableEventsHandler();
    this.headerAdminPageEventsHandler();
    this.tableHeaderEventsHandler();
  }

  async setLastPages() {
    const currentPage = document.getElementById('current-page') as HTMLInputElement;
    const allUsers = Array.from((await api.users.getAllUsers()).data!);
    const allLogs = Array.from((await api.statistics.getAllLogs()).data!);
    const maxUsersPage = Math.ceil(allUsers.length / 5);
    const maxLogsPage = Math.ceil(allLogs.length / 5);
    state.currentTable = maxUsersPage;
    state.limitTables = maxUsersPage;
    state.currentLogTable = maxLogsPage;
    state.limitLogTables = maxLogsPage;
    currentPage.value = String(state.limitTables);
    this.renderUsersTable();
    this.renderLogsTable();
  }

  async renderUsersTable() {
    this.renderTableHeader();
    this.renderTableBody();
  }

  async renderTableHeader() {
    console.log('renderTableHeader() =>');
    const tableHeader = document.getElementById('table-header')!;
    tableHeader.innerHTML = `${templateUsersTableHeader}`;
    const activeSortOrder = document.getElementById(`${state.sortProperty}-${state.sortOrder}`)!;
    activeSortOrder.classList.toggle('sort-btn--active');
  }

  async renderTableBody() {
    const endpoint = 'http://localhost:3000/users';
    const tableBody = document.getElementById('table-body')!;
    const viewState = tableBody.getAttribute('data-view');
    let groupUsers: IUser[] = [];
    if (viewState === 'default') {
      groupUsers = Array
        .from((await api.users
          .sort(state.sortProperty, state.sortOrder, state.currentTable!, 5))
          .data!);
    }
    if (viewState === 'search') {
      const search = document.getElementById('search') as HTMLInputElement;
      groupUsers = Array
        .from((await api.users
          .searchGroup(search.value, state.currentTable!, 5, state.sortProperty, state.sortOrder))
          .data!);
    }

    tableBody.innerHTML = '';
    if (groupUsers.length !== 0) {
      groupUsers.forEach((user: IUser, index: number) => {
        let imageUrl;
        if (user.profilePicture) {
          imageUrl = `${endpoint}/${user.id}/${user.profilePicture}`;
        } else {
          imageUrl = defaultUserIcon;// `${endpoint}/default/default_user.svg`;
        }
        tableBody.innerHTML += `
        <tr class="table__row user" id="${user.id}">
          <td class="user__number cell">${(state.currentTable! - 1) * 5 + index + 1}</td>
          <td class="user__userpic cell">
            <img class="user-profile-image" src="${imageUrl}" alt="userpic">
          </td>
          <td class="user__name cell">${user.name}</td>
          <td class="user__email cell">${user.email}</td>
          <td class="user__role cell">
            <input class="input-text role" value="${user.role}" type="text">
          </td>
          <td class="user__btns cell">
            <button class="btn btn-update" data-action="update">UPDATE</button>
            <button class="btn btn-delete" data-action="delete">✖</button>
          </td>
        </tr>`;
      });
    } else {
      tableBody.innerHTML += '<td colspan="6"><h2 class="not-found">Not found ...</h2></td>';
    }
  }

  async renderLogsTable() {
    this.renderLogsTableHeader();
    this.renderLogsTableBody();
  }

  async renderLogsTableHeader() {
    const tableLogsHeader = document.getElementById('table-logs-header')!;
    tableLogsHeader.innerHTML = (templateLogsTableHeader);
  }

  async renderLogsTableBody() {
    const serverLogs = (await api.statistics
      .getLogsPage(state.currentLogTable, 5)).data! as IServerLogEntity[];
    const tableLogsBody = document.getElementById('table-logs-body')!;
    tableLogsBody.innerHTML = '';
    if (serverLogs.length !== 0) {
      serverLogs.forEach((log: IServerLogEntity, index: number) => {
        tableLogsBody.innerHTML += `
        <tr class="table-header__row log" id="${log.id}">
          <td class="log__number cell">${(state.currentLogTable - 1) * 5 + index + 1}</td>
          <td class="log__id cell">${log.id}</td>
          <td class="log__date cell">${log.logDate}</td>
          <td class="log__url cell">${log.url}</td>
          <td class="log__method cell">${log.method}</td>
          <td class="log__os cell">${log.os}</td>
          <td class="log__browser cell">${log.browser}</td>
        </tr>`;
      });
    }
  }

  async headerAdminPageEventsHandler() {
    const search = document.getElementById('search') as HTMLInputElement;
    const currentPage = document.getElementById('current-page') as HTMLInputElement;
    const tableBody = document.getElementById('table-body')!;
    const createUserBtn = document.getElementById('create-user')!;
    const showLogs = document.getElementById('show-logs')! as HTMLButtonElement;
    search.addEventListener('input', () => {
      const currentValue = search.value;
      state.currentTable! = 1;
      currentPage.value = String(state.currentTable);
      if (currentValue === '') {
        tableBody.setAttribute('data-view', 'default');
        this.renderTableBody();
      } else if (currentValue !== '') {
        tableBody.setAttribute('data-view', 'search');
        this.renderTableBody();
      }
    });
    createUserBtn.addEventListener('click', () => {
      createElement('signin-form', document.body);
      document.getElementById('submit')!.textContent! = 'CREATE';
      document.body.classList.add('overflow-hidden');
      console.log('state.currentPage', state.currentPage);
    });
    showLogs.addEventListener('click', () => {
      const allUsersList = document.getElementById('all-users-list')!;
      const allLogsList = document.getElementById('all-logs-list')!;
      if (state.currentTableView === 'users') {
        allUsersList.style.display = 'none';
        allLogsList.style.display = 'flex';
        showLogs.textContent = 'Users';
        state.currentTableView = 'logs';
        currentPage.value = String(state.currentLogTable);
      } else if (state.currentTableView === 'logs') {
        allUsersList.style.display = 'flex';
        allLogsList.style.display = 'none';
        showLogs.textContent = 'Logs';
        state.currentTableView = 'users';
        currentPage.value = String(state.currentTable);
      }
      console.log('showLogs =>');
    });
    currentPage.addEventListener('change', () => {
      const currentValue = Number(currentPage.value);
      if (state.currentTableView === 'users') {
        if (currentValue > state.limitTables || currentValue < 1 || Number.isNaN(currentValue)) {
          currentPage.value = String(state.limitTables);
        } else {
          state.currentTable = Number(currentPage.value);
          this.renderTableBody();
        }
      } else if (state.currentTableView === 'logs') {
        if (currentValue > state.limitLogTables || currentValue < 1 || Number.isNaN(currentValue)) {
          currentPage.value = String(state.limitLogTables);
        } else {
          state.currentLogTable = Number(currentPage.value);
          this.renderLogsTableBody();
        }
      }
    });
  }

  async tableHeaderEventsHandler() {
    const tableHeader = document.getElementById('table-header')!;
    tableHeader.addEventListener('click', (event) => {
      const sortButton = event.target as HTMLButtonElement;
      const sortParameter = sortButton.getAttribute('data-sort-property');
      const sortOrder = sortButton.getAttribute('data-sort-order');
      tableHeader
        .querySelector('.sort-btn--active')?.classList
        .toggle('sort-btn--active');
      sortButton.classList.toggle('sort-btn--active');
      state.sortProperty = sortParameter!;
      state.sortOrder = sortOrder!;
      this.renderTableBody();
    });
  }

  async paginationHandler() {
    const pagination = document.getElementById('pagination') as HTMLDivElement;
    const currentPage = document.getElementById('current-page') as HTMLInputElement;
    pagination?.addEventListener('click', (event: Event) => {
      console.log('paginationHandler() => click');
      const target = event.target as HTMLButtonElement;
      console.log('target.id', target.id);
      if (state.currentTableView === 'users') {
        currentPage.value = String(state.currentTable);
        if (target.id === 'prev' && state.currentTable !== 1) {
          state.currentTable = state.currentTable! - 1;
          console.log('paginationHandler() => state.currentTable - 1', state.currentTable);
          this.renderTableBody();
        } else if (target.id === 'next' && state.currentTable !== state.limitTables) {
          state.currentTable = state.currentTable! + 1;
          console.log('paginationHandler() => state.currentTable + 1', state.currentTable);
          this.renderTableBody();
        }
        currentPage.value = String(state.currentTable);
      } else if (state.currentTableView === 'logs') {
        currentPage.value = String(state.currentLogTable);
        if (target.id === 'prev' && state.currentLogTable !== 1) {
          state.currentLogTable = state.currentLogTable! - 1;
          console.log('paginationHandler() => state.currentTable - 1', state.currentLogTable);
          this.renderLogsTableBody();
        } else if (target.id === 'next' && state.currentLogTable !== state.limitLogTables) {
          state.currentLogTable = state.currentLogTable! + 1;
          console.log('paginationHandler() => state.currentTable + 1', state.currentLogTable);
          this.renderLogsTableBody();
        }
      }
    });
  }

  async deleteUser(elem: HTMLElement) {
    const tableRow = elem.closest('.table__row')!;
    const apiRes = await api.admin.deleteUser(tableRow.id); //  users.delete(tableRow.id);
    if (apiRes.success) {
      console.log(apiRes.success);
      this.renderTableBody();
    }
  }

  async updateUser(elem: HTMLElement) {
    const tableRow = elem.closest('.table__row')!;
    const user = await api.users.getById(tableRow.id);
    const inputRole = tableRow.querySelector('.input-text')! as HTMLInputElement;
    const role = inputRole.value.toUpperCase();
    if (role === UserRole.user || role === UserRole.admin) {
      user.data!.role = inputRole.value.toUpperCase();
      inputRole.value = inputRole.value.toUpperCase();
      const apiRes = await api.users.update(user.data!);
      if (apiRes.success) {
        console.log(apiRes.success);
      }
    } else if (role !== UserRole.user && role !== UserRole.admin) {
      inputRole.value = user.data!.role;
    }
  }

  async tableEventsHandler() {
    const table = document.getElementById('table-body')! as HTMLTableSectionElement;
    table.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      const action = target.getAttribute('data-action')!;
      if (action === 'delete') this.deleteUser(target);
      if (action === 'update') this.updateUser(target);
    });
  }
}

export default AdminPage;
