import createElement from '../../utils/createElement';

class NotFoundPage {
  render(): void {
    document.title = '404 Page';
    createElement('h1', document.body, {
      class: 'page__header',
    }, '404 no pages found');
  }
}

export default NotFoundPage;
