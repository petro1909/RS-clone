import api from '../../api';
import state from '../../store/state';
import { IUser } from '../../types';
import createElement from '../../utils/createElement';
import template from './template.html';

class AdminPage {
  render(): void {
    document.title = 'Admin Page';
    document.body.classList.remove('body-scrollbar--invisible');
    document.body.innerHTML = `
    <app-header></app-header>
    ${template}`;
    this.renderUsersDatalist();
    this.saveUser();
    this.deleteUser();
  }

  async renderUsersDatalist() {
    console.log('renderUsersDatalist()');
    const allUsers = Array.from((await api.users.getAllUsers()).data!);
    const allUsersList = document.getElementById('all-users-list')!;
    allUsersList.innerHTML = '';
    allUsers.forEach((user: IUser) => {
      createElement('option', allUsersList, {
          class: 'user-option',
          value: `${user.name}`,
          id: `${user.id}`,
        }) as HTMLOptionElement;
      // allUsersList.
      // user.
    })
    console.log(allUsers);
    this.dataListHandler();
  }

  async dataListHandler() {
    const allUsersInput = document.getElementById('all-users-input') as HTMLInputElement;
    const userOptionElements = Array.from(document.querySelectorAll('.user-option')) as HTMLOptionElement[];
    allUsersInput?.addEventListener('change', () => {
      const editingUserName= allUsersInput.value;
      userOptionElements.find((option) => {
        if (option.value === editingUserName) {
          api.users.getById(option.id)
            .then((res) => {
              console.log('dataListHandler() user =>', res.data);
              this.fillUserForm(res.data!);
            });
        }
      })
    })
  }

  async saveUser() {
    const userProfileForm = document.getElementById('profile');
    const editedUser: IUser = {
      id: '',
      name: '',
      email: '',
      role: ''
    }
    userProfileForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      const profileForm = document.querySelector('#profile') as HTMLFormElement;
      const formElems = [...profileForm.elements] as HTMLInputElement[];
      formElems.forEach((formElem) => {
        const input = formElem;
        if (formElem.name !=='') {
          editedUser[formElem.name as keyof IUser] = input.value;
        }
      });
      console.log(editedUser);
      this.updateUser(editedUser);
    });
  };

  async deleteUser() {
    const deleteBtn = document.getElementById('save');
    deleteBtn!.addEventListener('click', () => {
      const userId = document.getElementById('input-id') as HTMLInputElement;
      console.log(userId.value);
    } )
  };

  private async updateUser(user: IUser) {
    const apiRes = await api.users.update(user);
    console.log(apiRes);
    if (apiRes.success) {
      console.log(apiRes.success);
      this.renderUsersDatalist();
    }
  }

  fillUserForm(user: IUser) {
    const inputRole = document.getElementById('input-role') as HTMLInputElement;
    const inputFullname = document.getElementById('input-fullname') as HTMLInputElement;
    const inputEmail = document.getElementById('input-email') as HTMLInputElement;
    const inputId = document.getElementById('input-id') as HTMLInputElement;
    inputFullname.value = user.name;
    inputRole.value = user.role;
    inputEmail.value = user.email;
    inputId.value = user.id;
    inputRole.focus();
  }
}

export default AdminPage;
