import template from './template.html';
import api from '../../api';
import createElement from '../../utils/createElement';

class AppStatus extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  private async render() {
    this.innerHTML = template;
    this.classList.add('status');
    this.setStatusNameInput();
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
    const nameInput = this.querySelector('#name-input') as HTMLInputElement;
    nameInput.value = name;
  }

  private getTasks() {

  }
}

customElements.define('app-status', AppStatus);
