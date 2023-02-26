import createElement from '../../utils/createElement';
import template from './template.html';
import menuTemplate from './menu-template.html';
import api from '../../api';
import apiService from '../../services/apiHandler';
import { ITaskUser } from '../../types';
import state from '../../store/state';

class AppTask extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  private render() {
    this.innerHTML = template;
    this.classList.add('task');
    const taskId = this.getAttribute('taskId') as string;
    this.setData();
    this.setMenu(taskId);
  }

  private setData() {
    const taskName = this.getAttribute('taskName') as string;
    const contentWrapper = this.querySelector('#task-content') as HTMLDivElement;
    contentWrapper.innerHTML = `${taskName}`;
    this.renderTaskMarks();
    this.renderTaskUsers();
  }

  private async renderTaskMarks() {
    const marksWrapper = this.querySelector('#task-marks-labels') as HTMLDivElement;
    marksWrapper.innerHTML = '';
    const taskId = this.getAttribute('taskId') as string;
    const marks = await apiService.getTaskMarks(taskId);
    marks.forEach((mark) => {
      const tag = createElement('span', marksWrapper, {
        class: 'task-mark-label',
      }, '  ') as HTMLSpanElement;
      if (mark.color) {
        tag.style.backgroundColor = mark.color;
      }
    });
  }

  private async renderTaskUsers() {
    const usersWrapper = this.querySelector('#task-users-labels') as HTMLDivElement;
    usersWrapper.innerHTML = '';
    const taskId = this.getAttribute('taskId') as string;
    const taskUsersRes = await api.taskUsers.getTaskUsers(taskId);
    const taskUsers = taskUsersRes.data as ITaskUser[];

    if (taskUsers.length === 0) return;
    const users = taskUsers.map((taskUser) => {
      const [currUser] = state.activeBoardUsers
        .filter((boardUser) => boardUser.id === taskUser.boardUserId);
      return currUser;
    });

    users.forEach((user) => {
      usersWrapper.innerHTML += `
      <div id="p-${user.user.id}" class="task-users__user-img board-users__user"></div>
      `;
      if (user.user.profilePicture) {
        const userpic = usersWrapper.querySelector(`#p-${user.user.id}`) as HTMLDivElement;
        userpic.style.backgroundImage = `url(${user.user.profilePicture})`;
      }
    });
  }

  private setMenu(taskId: string) {
    const menuBtn = this.querySelector('#task-menu-btn') as HTMLDivElement;
    const menuWrapper = createElement('task-menu', this, {
      class: 'task-menu element--invisible',
      taskId,
    }, `${menuTemplate}`);
    const editBtn = menuWrapper.querySelector('#edit-task') as HTMLButtonElement;
    const removeBtn = menuWrapper.querySelector('#remove-task') as HTMLButtonElement;
    const boardPage = document.querySelector('#board-page') as HTMLDivElement;
    menuBtn.onclick = () => {
      menuWrapper.classList.remove('element--invisible');

      editBtn.onclick = () => {
        menuWrapper.classList.add('element--invisible');
        createElement('task-form', boardPage, {
          taskId,
        });
        document.body.classList.add('overflow-hidden');
      };

      removeBtn.onclick = () => {
        this.deleteTask(taskId);
      };
    };

    document.body.addEventListener('click', (e) => {
      const ev = e as Event;
      const target = ev.target as HTMLElement;
      if (target !== menuBtn) {
        menuWrapper.classList.add('element--invisible');
      }
    });
  }

  private async deleteTask(taskId: string) {
    const result = await api.tasks.delete(taskId);
    if (result.success) {
      this.remove();
    }
  }
}

customElements.define('app-task', AppTask);
