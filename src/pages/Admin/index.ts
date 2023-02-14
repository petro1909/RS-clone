import api from '../../api';
import state from '../../store/state';
import { IUser } from '../../types';
import template from './template.html';

class AdminPage {
  render(): void {
    document.title = 'Admin Page';
    document.body.classList.remove('body-scrollbar--invisible');
    document.body.innerHTML = `
    <app-header></app-header>
    ${template}`;
  }
}

export default AdminPage;
