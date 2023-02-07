import template from './template.html';

class BoardPage {
  render(): void {
    document.title = 'Board Page';
    document.body.classList.remove('body-scrollbar--invisible');
    document.body.innerHTML = `
    <app-header></app-header>
    ${template}`;
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
    const status = board!.querySelector('.status');
    status!.innerHTML += '<status-menu></status-menu>';
    const task = board!.querySelector('.task');
    task!.innerHTML += '<task-menu></task-menu>';
  }
}

export default BoardPage;
