import template from './template.html';

class TaskMenu extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = template;
    this.classList.add('task-menu');
  }

  connectedCallback() {
    console.log('task-menu added');
  }
}

customElements.define('task-menu', TaskMenu);
