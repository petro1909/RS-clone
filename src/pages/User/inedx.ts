import api from '../../api';
import state from '../../store/state';
import { IUser } from '../../types';
import template from './template.html';

class UserPage {
  render(): void {
    document.title = 'Users Page';
    document.body.classList.remove('body-scrollbar--invisible');
    document.body.innerHTML = `
    <app-header></app-header>
    ${template}`;
    this.setUserValues();
  }

  private setUserValues() {
    const user = state.user as IUser;
    const profileForm = document.querySelector('#profile') as HTMLFormElement;
    const formElems = [...profileForm.elements] as HTMLInputElement[];
    formElems.forEach((formElem) => {
      const input = formElem;
      if (formElem.name in user) {
        input.value = user[formElem.name as keyof IUser];
      } else {
        input.value = '';
      }

      input.onblur = () => {
        if ((input.name in user) && input.value.trim()) {
          user[input.name as keyof IUser] = input.value;
          this.updateUser(user);
        }
      };
    });
    console.log('user', user);
  }

  private async updateUser(user: IUser) {
    const apiRes = await api.users.update(user);
    if (apiRes.success) {
      this.render();
    }
  }
}

export default UserPage;
