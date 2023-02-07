import state from '../../store/state';
import createElement from '../../utils/createElement';
import template from './template.html';
import appEvent from '../../events';

class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = template;
    this.classList.add('app-header');
  }

  connectedCallback() {
    const userMenuWrapper = this.querySelector('#user-menu') as HTMLDivElement;
    if (state.isAuthorized) {
      this.createAppMenu(userMenuWrapper);
    } else {
      this.createAuthMenu(userMenuWrapper);
    }
    console.log('app-header added');

    // document.querySelector('.user-menu__login')?.addEventListener('click', () => {
    //   if (!state.isAuthorized) {
    //     createElement('login-form', document.body);
    //     document.body.classList.add('overflow-hidden');
    //   }
    // });
  }

  private createAppMenu(parent: HTMLDivElement) {
    if (state.currentPage === 'Board') {
      this.createShowBoardsBtn(parent);
    }

    createElement('a', parent, {
      class: 'user-menu__profile',
      'data-local-link': 'data-local-link',
      href: '/board',
    }) as HTMLAnchorElement;
  }

  private createShowBoardsBtn(parent: HTMLDivElement) {
    const showBoardsBtn = createElement('button', parent, {
      class: 'app-menu__create-btn btn',
    }, 'My boards') as HTMLButtonElement;

    showBoardsBtn.onclick = () => {
      const event = appEvent.showBoardsMenu;
      window.dispatchEvent(event);
    };
  }

  private createAuthMenu(parent: HTMLDivElement) {
    const logInBtn = createElement('button', parent, {
      class: 'user-menu__login btn',
    }, 'Log in') as HTMLButtonElement;
    const signInBtn = createElement('button', parent, {
      class: 'user-menu__signin btn',
    }, 'Sign in') as HTMLButtonElement;

    logInBtn.onclick = () => {
      createElement('login-form', document.body);
      document.body.classList.add('overflow-hidden'); /// ????????
    };

    signInBtn.onclick = () => {
      console.log('sign-in');
    };
  }
}

customElements.define('app-header', AppHeader);
