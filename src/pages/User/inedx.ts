import api from '../../api';
import state from '../../store/state';
import { IUser } from '../../types';
import createElement from '../../utils/createElement';
// import createElement from '../../utils/createElement';
import template from './template.html';

class UserPage {
  render(): void {
    document.title = 'Users Page';
    document.body.classList.remove('body-scrollbar--invisible');
    document.body.innerHTML = `
    <app-header></app-header>
    ${template}`;
    this.setUserValues();
    this.setAvatar();
  }

  private setUserValues(): void {
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

  private setAvatar() {
    console.log('USER', state.user);
    const avatarWrapper = document.querySelector('#avatar-wrapper') as HTMLButtonElement;
    const avatarBtn = avatarWrapper.querySelector('#userpic') as HTMLButtonElement;
    const user = state.user as IUser;
    if (user.profilePicture) {
      avatarBtn.innerHTML = `
        <img class="userpic" src="${user.profilePicture}">
      `;

      const delBtn = createElement('button', avatarWrapper, {
        class: 'userpic__del-ntn',
      }, '✖') as HTMLButtonElement;
      delBtn.onclick = (e) => {
        e.preventDefault();
        this.deleteAvatar(user.id);
      };
    }
    avatarBtn.onclick = (e) => {
      e.preventDefault();
      // createElement('image-loader', document.body);
      document.body.innerHTML += '<image-loader></image-loader>';
    };

    window.addEventListener('file-uploaded', (e) => {
      const ev = e as CustomEvent;
      const userState = state.user as IUser;
      userState.profilePicture = ev.detail as string;
      // updatestate
      this.render();
    });
  }

  private async deleteAvatar(userId: string) {
    const apiRes = await api.users.deleteAvatar(userId);
    console.log('RESPONSE1', apiRes, state);
    if (apiRes.success) {
      const user = state.user as IUser;
      console.log('RESPONSE', apiRes, state);
      user.profilePicture = '';
      this.render();
    }
  }

  private async updateUser(user: IUser) {
    const apiRes = await api.users.update(user);
    if (apiRes.success) {
      this.render();
    }
  }
}

export default UserPage;
