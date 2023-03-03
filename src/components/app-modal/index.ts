import createElement from '../../utils/createElement';

class AppModal extends HTMLElement {
  private globalClickHandler: (e: Event) => void;

  constructor() {
    super();
    this.globalClickHandler = this.checkGlobalClick.bind(this);
  }

  connectedCallback() {
    this.classList.add('modal');
    setTimeout(() => {
      this.render();
      this.classList.add('modal_visible');
    }, 10);
  }

  render() {
    const closeBtn = createElement('button', null, {
      class: 'modal__close-modal-btn',
    }, '✖') as HTMLButtonElement;
    closeBtn.onclick = (e) => {
      e.preventDefault();
      this.close();
    };

    this.prepend(closeBtn);
    window.addEventListener('click', this.globalClickHandler);
  }

  disconnectedCallback() {
    window.removeEventListener('click', this.globalClickHandler);
  }

  checkGlobalClick(e: Event) {
    const elems = e.composedPath() as HTMLElement[];
    if (!elems.includes(this)) {
      this.close();
    }
  }

  close() {
    this.classList.remove('modal_visible');
    this.addEventListener('transitionend', () => {
      this.innerHTML = '';
      this.remove();
    });
  }
}

customElements.define('app-modal', AppModal);
