import template from './template.html';

class BoardPage {
  private static activeMenu: HTMLElement | null | undefined = null;

  render(): void {
    document.title = 'Board Page';
    document.body.classList.remove('body-scrollbar--invisible');
    document.body.innerHTML = `
    <app-header></app-header>
    ${template}
    <snack-bar></snack-bar>`;
  }
}

export default BoardPage;
