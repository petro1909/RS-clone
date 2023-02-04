import template from './template.html';

class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = template;
    this.classList.add('app-header');
  }

  connectedCallback() {
    console.log('app-header added');
  }
}

customElements.define('app-header', AppHeader);
