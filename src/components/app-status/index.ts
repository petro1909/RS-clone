import template from './template.html';

class AppStatus extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = template;
    this.classList.add('status');
  }

  connectedCallback() {
    console.log('status added');
  }
}

customElements.define('app-status', AppStatus);
