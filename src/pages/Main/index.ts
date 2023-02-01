import createElement from '../../utils/createElement';

class MainPage {
  render(): void {
    document.title = 'Main Page';
    createElement('h1', document.body, {
      class: 'page__header',
    }, 'This is Main Page');
  }
}

export default MainPage;
