import template from './template.html';
import './index.scss';
import { Ilogin } from '../../types';
import validate from '../../utils/validate';

class AppLoginForm extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = template;
  }

  connectedCallback() {
    const form = this.querySelector('.login-form') as HTMLFormElement;
    const passEyeBtn = this.querySelector('.password-eye') as HTMLButtonElement;
    passEyeBtn.onclick = () => {
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

    form.onsubmit = (e) => {
      e.preventDefault();
      this.submitHandler(form);
    };
    this.setInputFieldState();
  }

  private submitHandler(form: HTMLFormElement): void {
    const inputs = [...form.elements];
    const loginData = {} as Ilogin;
    console.log(inputs);
    inputs.forEach((input) => {
      const currInput = input as HTMLInputElement;
      const { name, value } = currInput;
      if (name) {
        if (currInput.hasAttribute('data-success')) {
          loginData[name] = value;
        }
      }
    });
    if (Object.values(loginData).length === 2) console.log(loginData);
  }

  private showMessage(input: HTMLInputElement, str = '') {
    const messageWrapper = input.nextElementSibling;
    if (messageWrapper) messageWrapper.textContent = str;
  }

  private setInputFieldState() {
    const inputs = this.querySelectorAll('.input');
    inputs.forEach((input) => {
      const currInput = input as HTMLInputElement;
      currInput.onblur = () => {
        const { name, value } = currInput;
        this.showMessage(currInput);
        currInput.classList.remove('input_filled');
        currInput.classList.remove('input_error');
        if (currInput.value.trim() === '') {
          this.showMessage(currInput, 'Field empty');
          currInput.classList.add('input_error');
        } else {
          currInput.classList.add('input_filled');
          console.log(name, value, validate[name](value));
          if (validate[name](value)) {
            currInput.classList.remove('input_error');
            currInput.setAttribute('data-success', 'data-success');
          } else {
            currInput.classList.add('input_error');
            this.showMessage(currInput, 'Error value');
          }
        }
      };
    });
  }
}

customElements.define('auth-form', AppLoginForm);
