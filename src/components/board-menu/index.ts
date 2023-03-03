import template from './template.html';

class BoardMenu extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = template;
    this.classList.add('board-menu');
  }
}

customElements.define('board-menu', BoardMenu);
