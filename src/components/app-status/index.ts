import template from './template.html';
import menuTemplate from './menu-template.html';
import api from '../../api';
import createElement from '../../utils/createElement';
import state from '../../store/state';
import { IStatus } from '../../types';

class AppStatus extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  private async render() {
    this.innerHTML = template;
    this.classList.add('status');
    this.setStatusNameInput();
    this.setMenu();
    const statusId = this.getAttribute('statusId') as string;

    const tasks = await api.tasks.getByStatus(+statusId);
    if (!tasks.data) return;
    const tasksWrapper = this.querySelector('#task-list') as HTMLDivElement;

    tasks.data.forEach((task) => {
      createElement('app-task', tasksWrapper, {
        taskId: `${task.id}`,
        taskName: `${task.name}`,
      }) as HTMLDivElement;
    });
  }

  private setStatusNameInput(): void {
    const name = this.getAttribute('statusName') as string;
    const id = this.getAttribute('statusId') as string;
    const nameInput = this.querySelector('#name-input') as HTMLInputElement;
    nameInput.value = name;
    nameInput.onblur = () => {
      const statusName = nameInput.value;
      console.log(statusName);
      if (statusName.trim() && statusName !== name) {
        this.updateStatus({ id: +id, name: statusName.trim(), boardId: state.activeBoardId });
      } else {
        nameInput.value = name;
      }
    };
  }

  private setMenu() {
    const menuBtn = this.querySelector('#status-menu-btn') as HTMLDivElement;
    menuBtn.onclick = () => {
      const menuWrapper = createElement('div', this, {
        class: 'status-menu',
      }, `${menuTemplate}`);

      const removeBtn = menuWrapper.querySelector('#remove-status') as HTMLButtonElement;

      removeBtn.onclick = () => {
        this.removeStatus();
      };
    };
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
    const result = await api.statuses.delete(+id);
    if (result.success) {
      this.remove();
    }
  }

  private getTasks() {

  }
}

customElements.define('app-status', AppStatus);
