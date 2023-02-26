// import api from '../../api';
import api from '../../api';
import state from '../../store/state';
import { ITaskUser } from '../../types';

class UserTasksSelect extends HTMLElement {
  connectedCallback() {
    this.classList.add('usertask-select');
    this.innerHTML = `
      <h3 class="usertask-select__title">Users of this board</h3>
      <div class="usertask-select__users" id="usertask-select-users"></div>
      
    `;
    this.render();
  }

  disconnectedCallback() {
    this.dispatchEvent(new Event('change'));
  }

  private async render(searchValue = '') {
    const usersWrapper = this.querySelector('#usertask-select-users') as HTMLDivElement;
    const taskUsers = (await api.taskUsers.getTaskUsers(this.id)).data as ITaskUser[];
    console.log('TASKUSERS', state.activeBoardUsers, taskUsers, searchValue);
    usersWrapper.innerHTML = '';
    state.activeBoardUsers.forEach((user) => {
      usersWrapper.innerHTML += `
      <div class="usertask-select__user-wrapper">
      <input class="usertask-select__user-checkbox" type="checkbox" id="c-${user.id}" value="${user.id}"></input>
      <label class="usertask-select__user-label" for="c-${user.id}">
        <div id="p-${user.user.id}" class="board-users__user"></div>
        <span class="usertask-select__user-email">${user.user.email}</span>
      </label>
      </div>
      `;
      if (user.user.profilePicture) {
        const userpic = usersWrapper.querySelector(`#p-${user.user.id}`) as HTMLDivElement;
        userpic.style.backgroundImage = `url(${user.user.profilePicture})`;
      }
    });

    const checkBoxs = usersWrapper.querySelectorAll('input[type=checkbox]') as NodeListOf<HTMLInputElement>;
    checkBoxs.forEach((checkBx) => {
      const [currTaskUser] = taskUsers
        .filter((taskUser) => taskUser.boardUserId === checkBx.value);
      if (currTaskUser) {
        checkBx.setAttribute('checked', 'true');
        checkBx.setAttribute('taskUserId', `${currTaskUser.id}`);
      }
      checkBx.addEventListener('input', () => {
        if (!checkBx.checked) {
          this.deleteTaskUser(checkBx.getAttribute('taskuserid')!);
        } else {
          this.createTaskUser(this.id, checkBx.value);
        }
      });
    });
  }

  private async createTaskUser(taskId: string, userBoardId: string) {
    const result = await api.taskUsers.create(taskId, userBoardId);
    if (result.success) {
      this.render();
    }
  }

  private async deleteTaskUser(id: string) {
    const result = await api.taskUsers.delete(id);
    if (result.success) {
      this.render();
    }
  }
}

customElements.define('usertask-select', UserTasksSelect);
