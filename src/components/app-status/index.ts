import template from './template.html';
import menuTemplate from './menu-template.html';
import api from '../../api';
import createElement from '../../utils/createElement';
import state from '../../store/state';
import { IStatus } from '../../types';
import apiService from '../../services/apiHandler';

class AppStatus extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  private async render() {
    this.innerHTML = template;
    this.classList.add('status');
    this.setStatusNameInput();
    this.setMenu();
    this.renderTaskForm();
    const statusId = this.getAttribute('statusId') as string;

    const tasks = await api.tasks.getByStatus(statusId);
    if (!tasks.data) return;
    const tasksWrapper = this.querySelector('.status__task-list') as HTMLDivElement;

    tasks.data.forEach((task) => {
      createElement('app-task', tasksWrapper, {
        taskId: `${task.id}`,
        taskName: `${task.name}`,
        taskOrder: `${task.order}`,
      }) as HTMLDivElement;
    });
  }

  private setStatusNameInput(): void {
    const name = this.getAttribute('statusName') as string;
    const id = this.getAttribute('statusId') as string;
    const order = this.getAttribute('order') as string;
    const nameInput = this.querySelector('#name-input') as HTMLInputElement;
    nameInput.value = name;
    nameInput.onblur = () => {
      const statusName = nameInput.value;

      if (statusName.trim() && statusName !== name) {
        this.updateStatus({
          id, name: statusName.trim(), boardId: state.activeBoardId, order: +order,
        });
      } else {
        nameInput.value = name;
      }
    };
  }

  private setMenu() {
    const menuBtn = this.querySelector('#status-menu-btn') as HTMLDivElement;
    const menuWrapper = createElement('div', this, {
      class: 'status-menu element--invisible',
    }, `${menuTemplate}`);
    const editBtn = menuWrapper.querySelector('#edit-status') as HTMLButtonElement;
    const removeBtn = menuWrapper.querySelector('#remove-status') as HTMLButtonElement;
    const nameInput = this.querySelector('#name-input') as HTMLInputElement;
    menuBtn.onclick = () => {
      menuWrapper.classList.remove('element--invisible');

      editBtn.onclick = () => {
        menuWrapper.classList.add('element--invisible');
        nameInput.focus();
      };

      removeBtn.onclick = () => {
        this.removeStatus();
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

  private async updateStatus(status: IStatus) {
    const result = await api.statuses.update(status);
    if (result.success) {
      this.setAttribute('statusName', status.name);
      this.render();
    }
  }

  private async removeStatus() {
    const id = this.getAttribute('statusId') as string;
    const result = await apiService.deleteStatus(id);
    if (result.success) {
      this.remove();
    }
  }

  private renderTaskForm() {
    const addTaskBtn = this.querySelector('.status__add-task');
    addTaskBtn?.addEventListener('click', () => {
      createElement('task-form', document.body, { statusId: `${this.getAttribute('statusId')}` });
      document.body.classList.add('overflow-hidden');
    });
  }
}

customElements.define('app-status', AppStatus);
