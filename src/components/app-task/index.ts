import createElement from '../../utils/createElement';
import template from './template.html';
import api from '../../api';

class AppTask extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  private render() {
    this.innerHTML = template;
    this.classList.add('task');
    const taskId = this.getAttribute('taskId') as string;
    console.log(taskId);
    this.setData();
    this.setMenu(taskId);
  }

  private setData() {
    const taskName = this.getAttribute('taskName') as string;
    const contentWrapper = this.querySelector('#task-content') as HTMLDivElement;
    contentWrapper.innerHTML = `${taskName}`;
  }

  private setMenu(taskId: string) {
    const menuBtn = this.querySelector('#task-menu-btn') as HTMLDivElement;
    menuBtn.onclick = () => {
      createElement('task-menu', this, {
        class: 'task-menu',
        taskId,
      });
      api.tasks.delete(+taskId);
      this.remove();
    };
  }
}

customElements.define('app-task', AppTask);
