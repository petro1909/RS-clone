import template from './template.html';

class Task extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = template;
    this.classList.add('task');
  }

  connectedCallback() {
    console.log('task added');
  }
}

customElements.define('task', Task);
