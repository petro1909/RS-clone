import template from './template.html';

class AppFooter extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = template;
    this.classList.add('app-footer');
  }
}

customElements.define('app-footer', AppFooter);
