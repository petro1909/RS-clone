import api from '../../api';
import state from '../../store/state';
import { IUser, UserRole } from '../../types';
import createElement from '../../utils/createElement';
import template from './template.html';

class AdminPage {
  render(): void {
    document.title = 'Admin Page';
    document.body.classList.remove('body-scrollbar--invisible');
    document.body.innerHTML = `
    <app-header></app-header>
    ${template}`;
    this.renderUsersTable();
    this.paginationHandler();
    this.tableEventsHandler();
    this.headerAdminPageEventsHandler();
    this.tableHeaderEventsHandler();
  }

  renderUsersTable() {
    this.renderTableHeader();
    this.renderTableBody();
  }

  async renderTableHeader() {
    console.log('renderTableHeader() =>');
    const tableHeader = document.getElementById('table-header')!;
    tableHeader.innerHTML = `
      <tr class="table-header__row">
        <th class="user__number cell">№</th>
        <th class="user__userpic cell">Ava</th>
        <th class="user__name cell" data-sort="ASC">
          Name
          <div class="sort-btns-wpapper">
            <button class="sort-btn"
                    data-sort-property="name"
                    data-sort-order="ASC"
                    id="name-ASC">▲
            </button>
            <button class="sort-btn"
                    data-sort-property="name"
                    data-sort-order="DESC"
                    id="name-DESC">▼
            </button>
          </div>
        </th>
        <th class="user__email cell" data-sort="">
          E-mail
          <div class="sort-btns-wpapper">
            <button class="sort-btn"
                    data-sort-property="email"
                    data-sort-order="ASC"
                    id="email-ASC">▲
            </button>
            <button class="sort-btn"
                    data-sort-property="email"
                    data-sort-order="DESC"
                    id="email-DESC">▼
            </button>
          </div>
        </th>
        <th class="user__role cell" data-sort="">
          Role
          <div class="sort-btns-wpapper">
            <button class="sort-btn"
                    data-sort-property="role"
                    data-sort-order="ASC"
                    id="role-ASC">▲
            </button>
            <button class="sort-btn"
                    data-sort-property="role"
                    data-sort-order="DESC"
                    id="role-DESC">▼
            </button>
          </div>
        </th>
        <th class="user__btns-header cell">Actions</th>
      </tr>`;
    const activeSortOrder = document.getElementById(`${state.sortProperty}-${state.sortOrder}`)!;
    activeSortOrder.classList.toggle('sort-btn--active');
  }

  async renderTableBody() {
    console.log('renderTableBody() =>');
    const endpoint = 'http://localhost:3000/users';
    const tableBody = document.getElementById('table-body')!;
    const viewState = tableBody.getAttribute('data-view');
    let groupUsers: IUser[] = [];
    if (viewState === 'default') {
      const allUsers = Array.from((await api.users.getAllUsers()).data!);
      groupUsers = Array
        .from((await api.users
          .sort(state.sortProperty, state.sortOrder, state.currentTable!, 5))
          .data!);
      state.limitTables = Math.ceil(allUsers.length / 5);
    }
    if (viewState === 'search') {
      const search = document.getElementById('search') as HTMLInputElement;
      const allUsers = Array.from((await api.users.searchAll(search.value)).data!);
      state.limitTables = Math.ceil(allUsers.length / 5);
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
          imageUrl = `${endpoint}/default/default_user.svg`;
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

  async headerAdminPageEventsHandler() {
    const search = document.getElementById('search') as HTMLInputElement;
    const currentPage = document.getElementById('current-page') as HTMLInputElement;
    const tableBody = document.getElementById('table-body')!;
    const createUserBtn = document.getElementById('create-user')!;
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
    currentPage.value = String(state.currentTable);
    pagination?.addEventListener('click', (event: Event) => {
      console.log('paginationHandler() => click');
      const target = event.target as HTMLButtonElement;
      console.log('target.id', target.id);
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
    });
  }

  async deleteUser(elem: HTMLElement) {
    const tableRow = elem.closest('.table__row')!;
    const apiRes = await api.users.delete(tableRow.id);
    if (apiRes.success) {
      console.log(apiRes.success);
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
