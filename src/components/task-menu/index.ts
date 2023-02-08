import template from './template.html';

class TaskMenu extends HTMLElement {
  connectedCallback() {
    this.innerHTML = template;
    this.classList.add('task-menu');
    const taskId = this.getAttribute('taskId') as string;
    console.log(taskId);
  }
}

customElements.define('task-menu', TaskMenu);
