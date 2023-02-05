import template from './template.html';

class NotFoundPage {
  render(): void {
    document.title = '404 Page';
    document.body.classList.remove('body');
    document.body.innerHTML = template;
  }
}

export default NotFoundPage;
