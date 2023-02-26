import template from './template.html';
import { IRegisterUser } from '../../types';
import validate from '../../utils/validate';
import authService from '../../services/auth';

class AppSigninForm extends HTMLElement {
  connectedCallback() {
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
    const signinData = {} as IRegisterUser;
    inputs.forEach((input) => {
      const currInput = input as HTMLInputElement;
      const { name, value } = currInput;
      if (name) {
        if (currInput.hasAttribute('data-success')) {
          signinData[name as keyof IRegisterUser] = value;
        }
      }
    });
    if (Object.values(signinData).length === 3) this.signIn(signinData);
    this.signIn(signinData);
  }

  private async signIn(signinData: IRegisterUser) {
    authService.register(signinData);
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
          this.showMessage(currInput, 'Field empty⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀');
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
