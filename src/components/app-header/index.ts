import state from '../../store/state';
import createElement from '../../utils/createElement';
import template from './template.html';
import appEvent from '../../events';
import router from '../../router';
import userMenuTemplate from './user-menu-template.html';
import adminMenuTemplate from './admin-menu-template.html';
import authService from '../../services/auth';

class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = template;
    this.classList.add('app-header');
  }

  connectedCallback() {
    console.log('hrader');
    const userMenuWrapper = this.querySelector('#user-menu') as HTMLDivElement;
    if (state.isAuthorized) {
      this.createAppMenu(userMenuWrapper);
    } else {
      this.createAuthMenu(userMenuWrapper);
    }

    // document.querySelector('.user-menu__login')?.addEventListener('click', () => {
    //   if (!state.isAuthorized) {
    //     createElement('login-form', document.body);
    //     document.body.classList.add('overflow-hidden');
    //   }
    // });

    const themeSwitcher = this.querySelector('#theme-switcher') as HTMLDivElement;
    themeSwitcher.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      document.body.classList.toggle('dark-theme');
    });
  }

  private createAppMenu(parent: HTMLDivElement) {
    if (state.currentPage === 'Board') {
      this.createShowBoardsBtn(parent);
    }

    if (state.currentPage === 'User' || state.currentPage === 'Admin') {
      this.createBackToBoardsBtn(parent);
    }

    const userMenuBtn = createElement('button', parent, {
      class: 'user-menu__profile',
    }) as HTMLButtonElement;

    if (state.user?.profilePicture) {
      userMenuBtn.style.backgroundImage = `url(${state.user?.profilePicture})`;
    }

    const userMenuWrapper = createElement('div', this, {
      class: 'task-menu element--invisible',
    }, `${state.user?.role.toLowerCase() === 'admin' ? adminMenuTemplate : userMenuTemplate}`);
    const userName = state.user?.name || 'Noname';
    const userRole = state.user?.role as string;
    const openProfileBtn = userMenuWrapper.querySelector('#open-profile') as HTMLButtonElement;
    const logoutBtn = userMenuWrapper.querySelector('#user-logout') as HTMLButtonElement;
    const userNameMenuTitle = userMenuWrapper.querySelector('#user-profile-name') as HTMLHeadingElement;
    const userRoleMenuTitle = userMenuWrapper.querySelector('#user-profile-role') as HTMLHeadingElement;
    userNameMenuTitle.innerHTML = `Hi, ${userName.toUpperCase()}`;
    userRoleMenuTitle.innerHTML = `${userRole.toLowerCase()}`;

    userMenuBtn.onclick = () => {
      userMenuWrapper.classList.remove('element--invisible');
    };

    if (state.user?.role.toLowerCase() === 'admin') {
      const adminBtn = userMenuWrapper.querySelector('#open-admin') as HTMLButtonElement;
      adminBtn.onclick = () => {
        router.goTo('/admin');
      };
    }

    openProfileBtn.onclick = () => {
      router.goTo('/user');
    };

    logoutBtn.onclick = () => {
      authService.logout();
    };

    // const settingsBtn = createElement('button', null, {
    //   class: 'popup-menu__btn menu-btn',
    // }, `
    // <
    //   <?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19.622 10.395l-1.097-2.65L20 6l-2-2-1.735 1.483-2.707-1.113L12.935 2h-1.954l-.632 2.401-2.645 1.115L6 4 4 6l1.453 1.789-1.08 2.657L2 11v2l2.401.655L5.516 16.3 4 18l2 2 1.791-1.46 2.606 1.072L11 22h2l.604-2.387 2.651-1.098C16.697 18.831 18 20 18 20l2-2-1.484-1.75 1.098-2.652 2.386-.62V11l-2.378-.605z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
    // `
    // )

    window.addEventListener('click', (e) => {
      const ev = e as Event;
      const target = ev.target as HTMLElement;
      if (target !== userMenuBtn) {
        userMenuWrapper.classList.add('element--invisible');
      }
    });
  }

  private createBackToBoardsBtn(parent: HTMLDivElement) {
    const backToBoardsBtn = createElement('button', parent, {
      class: 'user-menu__login  btn',
    }, 'Back to boards') as HTMLButtonElement;

    backToBoardsBtn.onclick = () => {
      router.goTo('/board');
    };
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
      console.log('login-form');
      document.body.classList.add('overflow-hidden'); // Класс добавляется для блокировки скролла под формой.
    };

    signInBtn.onclick = () => {
      createElement('signin-form', document.body);
      document.body.classList.add('overflow-hidden');
    };
  }
}

customElements.define('app-header', AppHeader);
