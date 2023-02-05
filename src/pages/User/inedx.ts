import template from './template.html';

class UserPage {
  render(): void {
    document.title = 'Users Page';
    document.body.classList.remove('body');
    document.body.innerHTML = `
    <app-header></app-header>
    ${template}`;
  }
}

export default UserPage;
