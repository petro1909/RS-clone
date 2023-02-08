import template from './template.html';

class BoardPage {
  private static activeMenu: HTMLElement | null | undefined = null;

  render(): void {
    document.title = 'Board Page';
    document.body.classList.remove('body-scrollbar--invisible');
    document.body.innerHTML = `
    <app-header></app-header>
    ${template}`;
    const boardPage = document.getElementById('board-page');
    boardPage?.addEventListener('click', (event) => {
      const eventTarget = event.target as HTMLElement;
      if (eventTarget?.classList.contains('status__menu')) {
        console.log('click', 'status\n');
        this.toggleLittleMenu('status', eventTarget);
      } else if (eventTarget?.classList.contains('task__menu')) {
        console.log('click', 'task\n');
        this.toggleLittleMenu('task', eventTarget);
      } else {
        boardPage.querySelectorAll('.status-menu').forEach((elem) => { elem.classList.add('element--invisible'); });
        boardPage.querySelectorAll('.task-menu').forEach((elem) => { elem.classList.add('element--invisible'); });
        // BoardPage.activeMenu = null;
      }
    });
    const boardWrapper = document.getElementById('board-wrapper');
    boardWrapper!.insertAdjacentHTML('afterbegin', '<board-menu></board-menu>');
    const boardMenuBurgerBtn = document.getElementById('board-menu-burger-btn');
    const boardMenuCloseBtn = document.getElementById('board-menu-close-btn');
    const boardMenu = document.querySelector('.board-menu');
    boardMenuBurgerBtn!.addEventListener('click', () => {
      boardMenu?.classList.add('board-menu--visible');
    });
    boardMenuCloseBtn!.addEventListener('click', () => {
      boardMenu?.classList.remove('board-menu--visible');
    });
    const board = document.getElementById('board');
    board!.insertAdjacentHTML('afterbegin', '<app-status></app-status>');
    board!.insertAdjacentHTML('afterbegin', '<app-status></app-status>');
    const list = board!.querySelector('.status__task-list');
    list!.innerHTML = '<app-task></app-task>';
  }

  toggleLittleMenu(className: string, eventTarget: HTMLElement) {
    eventTarget.closest(`.${className}`)
      ?.querySelector(`.${className}-menu`)
      ?.classList.toggle('element--invisible');
    BoardPage.activeMenu = eventTarget.closest(`.${className}`)?.querySelector(`.${className}-menu`);
    console.log('BoardPage.activeMenu', BoardPage.activeMenu, '\n');
    const boardPage = document.getElementById('board-page');
    boardPage?.querySelectorAll('.status-menu').forEach((elem) => {
      if (elem !== BoardPage.activeMenu) elem.classList.add('element--invisible');
    });
    boardPage?.querySelectorAll('.task-menu').forEach((elem) => {
      if (elem !== BoardPage.activeMenu) elem.classList.add('element--invisible');
    });
  }
}

export default BoardPage;
