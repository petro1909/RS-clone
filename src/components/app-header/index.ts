import template from './template.html';
import './index.scss';

class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = template;
  }

  connectedCallback() {
    this.innerHTML += ' Dude!';
  }
}

customElements.define('app-header', AppHeader);
