import state from '../../store/state';
import createElement from '../../utils/createElement';

class MainPage {
  render(): void {
    document.title = 'Main Page';
    document.body.innerHTML = `
      <app-header></app-header>
      <h1>Hello! Main Page</h1>
      <app-footer></app-footer>
    `;
    // <login-form></login-form>
    // try {
    //   const main = createElement('div', document.body) as HTMLElement;
    //   // createElement('login-form', main);
    //   const form = document.createElement('login-form');
    //   main.appendChild(form);
    // } catch (error) {
    //   console.log(error);
    // }
    if (!state.isAuthorized) {
      const main = createElement('div', document.body) as HTMLElement;
      createElement('login-form', main);
    }
  }
}

export default MainPage;
