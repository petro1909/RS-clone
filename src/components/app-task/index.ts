import template from './template.html';

class AppTask extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = template;
    this.classList.add('task');
  }

  connectedCallback() {
    console.log('task added');
  }
}

customElements.define('app-task', AppTask);
