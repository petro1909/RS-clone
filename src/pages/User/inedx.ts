import createElement from '../../utils/createElement';

class UserPage {
  render(): void {
    document.title = 'Users Page';
    createElement('h1', document.body, {
      class: 'page__header',
    }, 'USERNAME');
  }
}

export default UserPage;
