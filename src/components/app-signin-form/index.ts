import template from './template.html';
import { Ilogin, ISignin } from '../../types';
// import { Ilogin, IUser, ISignin } from '../../types';
import validate from '../../utils/validate';
// import getUser from '../../api';
// import api from '../../api';
// import state from '../../store/state';
// import router from '../../router';

class AppSigninForm extends HTMLElement {
  connectedCallback() {
    console.log('AppSigninForm added');
    this.innerHTML = template;
    const form = this.querySelector('.signin-form') as HTMLFormElement;
    const passEyeBtn = this.querySelector('.password-eye') as HTMLButtonElement;
    passEyeBtn.onclick = () => {
      console.log('passEyeBtn');
      const input = passEyeBtn.nextElementSibling as HTMLInputElement;
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          passEyeBtn.classList.add('password-eye_is-visible');
        } else {
          input.type = 'password';
          passEyeBtn.classList.remove('password-eye_is-visible');
        }
      }
    };

    const popupPage = this.querySelector('.popup-page') as HTMLFormElement;

    popupPage.onclick = (event) => {
      console.log('click');
      const eventTarget = event.target as HTMLDivElement;
      if (eventTarget?.classList.contains('popup-page')) {
        this.remove();
      }
    };

    form.onsubmit = (e) => {
      e.preventDefault();
      this.submitHandler(form);
    };
    this.setInputFieldState();
  }

  private async submitHandler(form: HTMLFormElement): Promise<void> {
    const inputs = [...form.elements];
    const signinData = {} as ISignin;
    console.log(inputs);
    inputs.forEach((input) => {
      const currInput = input as HTMLInputElement;
      const { name, value } = currInput;
      if (name) {
        if (currInput.hasAttribute('data-success')) {
          signinData[name] = value;
        }
      }
    });
    if (Object.values(signinData).length === 3) this.signIn(signinData);
    this.signIn(signinData);
  }

  private async signIn(signinData: Ilogin) {
    console.log('signIn() =>', signinData);
    // const res = await api.auth.login('email1@gmail.com');
    // if (res.success) {
    //   const [user] = res.data as IUser[];
    //   // Object.assign(state.user, user);
    //   state.user = user;
    //   state.isAuthorized = true;
    //   router.goTo('/board');
    // }
    // router.goTo('/board');
  }

  private showMessage(input: HTMLInputElement, str = '') {
    const messageWrapper = input.nextElementSibling;
    if (messageWrapper) messageWrapper.textContent = str;
  }

  private setInputFieldState() {
    const inputs = this.querySelectorAll('.input-auth');
    inputs.forEach((input) => {
      const currInput = input as HTMLInputElement;
      currInput.onblur = () => {
        const { name, value } = currInput;
        this.showMessage(currInput);
        currInput.classList.remove('input-auth_filled');
        currInput.classList.remove('input-auth_error');
        if (currInput.value.trim() === '') {
          this.showMessage(currInput, 'Field empty');
          currInput.classList.add('input-auth_error');
        } else {
          currInput.classList.add('input-auth_filled');
          console.log(name, value, validate[name](value));
          if (validate[name](value)) {
            currInput.classList.remove('input-auth_error');
            currInput.setAttribute('data-success', 'data-success');
          } else {
            currInput.classList.add('input-auth_error');
            this.showMessage(currInput, 'Error value');
          }
        }
      };
    });
  }
}

customElements.define('signin-form', AppSigninForm);
