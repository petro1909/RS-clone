import template from './template.html';

class BoardPage {
  render(): void {
    document.title = 'Board Page';
    document.body.classList.remove('body-scrollbar--invisible');
    document.body.innerHTML = `
    <app-header></app-header>
    ${template}`;
    const board = document.getElementById('board');
    board!.innerHTML = '<app-status></app-status>';
    board!.innerHTML += '<app-status></app-status>';
    const list = board!.querySelector('.status__task-list');
    list!.innerHTML = '<app-task></app-task>';
    const status = board!.querySelector('.status');
    status!.innerHTML += '<status-menu></status-menu>';
    const task = board!.querySelector('.task');
    task!.innerHTML += '<task-menu></task-menu>';
  }
}

export default BoardPage;
