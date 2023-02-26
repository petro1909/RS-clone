import api from '../../api';
import apiService from '../../services/apiHandler';

class UserBoardsSelect extends HTMLElement {
  connectedCallback() {
    this.classList.add('userboard-select');
    this.innerHTML = `
      <input class="userboard-select__search input-text" placeholder="Search User..." type="text" id="userboard-select-search">
      <div class="userboard-select__users" id="userboard-select-users"></div>
      <button class="userboard-select__submit btn">Invite</button>
    `;
    this.render();
    const searchInput = this.querySelector('#userboard-select-search') as HTMLInputElement;
    const submitButton = this.querySelector('.userboard-select__submit') as HTMLButtonElement;
    searchInput.oninput = () => {
      this.render(searchInput.value);
    };
    submitButton.onclick = () => {
      this.submit();
    };
  }

  private async render(searchValue = '') {
    const usersWrapper = this.querySelector('#userboard-select-users') as HTMLDivElement;
    const allUsers = Array.from((await api.users.searchGroup(searchValue, 1, 100, 'email', 'ASC')).data!);
    const boardUsers = Array.from((await api.boardUsers.getBoardUsers(this.id)).data!);
    const users = await apiService.getUsersWithAvatars(allUsers);
    usersWrapper.innerHTML = '';
    users.forEach((user) => {
      if (!boardUsers.map((boardUser) => boardUser.userId).includes(user.id)) {
        usersWrapper.innerHTML += `
      <div class="userboard-select__user-wrapper">
      <input class="userboard-select__user-checkbox" type="checkbox" id="c-${user.id}" value="${user.id}"></input>
      <label class="userboard-select__user-label" for="c-${user.id}">
        <div id="p-${user.id}" class="board-users__user"></div>
        <span class="userboard-select__user-email">${user.email}</span>
      </label>
      </div>
      `;
        if (user.profilePicture) {
          const userpic = usersWrapper.querySelector(`#p-${user.id}`) as HTMLDivElement;
          userpic.style.backgroundImage = `url(${user.profilePicture})`;
        }
      }
    });
    console.log('USERS', users, boardUsers);
  }

  private async submit() {
    const selected = this.querySelectorAll<HTMLInputElement>('input:checked');
    if (selected.length > 0) {
      const sendUsers = [...selected]
        .map((selectedUser) => api.boardUsers.create(selectedUser.value, this.id));
      await Promise.all(sendUsers);
      this.render();
      this.dispatchEvent(new Event('update'));
    }
  }
}

customElements.define('userboard-select', UserBoardsSelect);
