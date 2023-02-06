import template from './template.html';

class NotFoundPage {
  render(): void {
    document.title = '404 Page';
    document.body.classList.remove('body-scrollbar--invisible');
    document.body.innerHTML = template;
  }
}

export default NotFoundPage;
