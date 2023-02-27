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
    const userMenuWrapper = this.querySelector('#user-menu') as HTMLDivElement;
    if (state.isAuthorized) {
      this.createAppMenu(userMenuWrapper);
    } else {
      this.createAuthMenu(userMenuWrapper);
    }

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

    if (state.currentPage === 'User' || state.currentPage === 'Admin' || state.currentPage === 'Main') {
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
    }, `${state.user?.role.toLowerCase() === 'admin' || state.user?.role.toLowerCase() === 'superadmin' ? adminMenuTemplate : userMenuTemplate}`);
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

    if (state.user?.role.toLowerCase() === 'admin' || state.user?.role.toLowerCase() === 'superadmin') {
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
      createElement('login-form', this);
      document.body.classList.add('overflow-hidden'); // Класс добавляется для блокировки скролла под формой.
    };

    signInBtn.onclick = () => {
      createElement('signin-form', this);
      document.body.classList.add('overflow-hidden');
    };
  }
}

customElements.define('app-header', AppHeader);
