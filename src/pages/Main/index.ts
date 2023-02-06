import state from '../../store/state';
import createElement from '../../utils/createElement';

class MainPage {
  render(): void {
    document.title = 'Main Page';
    document.body.innerHTML = `
      <app-header></app-header>
      <h1>Hello! Main Page</h1>
      <snack-bar></snack-bar>
    `;
    if (!state.isAuthorized) {
      const main = createElement('div', document.body) as HTMLElement;
      createElement('login-form', main);
    }
  }
}

export default MainPage;
