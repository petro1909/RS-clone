import template from './template.html';
import { IFormTask } from '../../types';
import validate from '../../utils/validate';
import router from '../../router';
import api from '../../api';

class TaskForm extends HTMLElement {
  connectedCallback() {
    console.log('TaskForm added');
    this.innerHTML = template;
    const form = this.querySelector('.task-form') as HTMLFormElement;
    const popupPage = this.querySelector('.popup-page') as HTMLFormElement;

    popupPage.onclick = (event) => {
      const eventTarget = event.target as HTMLDivElement;
      if (eventTarget?.classList.contains('popup-page')) {
        this.remove();
      }
    };

    form.onsubmit = (event) => {
      // console.log('preventDefault()');
      event.preventDefault();
      this.submitHandler(form);
    };
    this.setInputFieldState();
  }

  private async submitHandler(form: HTMLFormElement): Promise<void> {
    const inputs = [...form.elements];
    const taskData = {} as IFormTask;
    // console.log('submitHandler', inputs);
    inputs.forEach((input) => {
      const currInput = input as HTMLInputElement;
      const { name, value } = currInput;
      if (name) {
        if (currInput.hasAttribute('data-success')) {
          taskData[name] = value;
        }
      }
    });
    if (Object.values(taskData).length === 1) this.createNewTask(taskData);
  }

  private async createNewTask(taskData: IFormTask) {
    console.log('addTask() valid data =>', taskData.taskname);
    const taskform = document.querySelector('task-form') as HTMLElement;
    const currentStatus = Number(taskform?.getAttribute('statusId'));
    const result = await api.tasks.create(currentStatus, taskData.taskname);
    if (result.success) {
      console.log('TASK ADDED');
    }
    router.goTo('/board');
  }

  private showMessage(input: HTMLInputElement, str = '') {
    // console.log('showMessage()', str);
    const messageWrapper = input.nextElementSibling;
    // console.log('messageWrapper', messageWrapper);
    if (messageWrapper) messageWrapper.textContent = str;
  }

  private setInputFieldState() {
    console.log('setInputFieldState() =>');
    const inputs = this.querySelectorAll('.input-task');
    inputs.forEach((input) => {
      const currInput = input as HTMLInputElement;
      currInput.onblur = () => {
        const { name, value } = currInput;
        this.showMessage(currInput);
        currInput.classList.remove('input-task_filled');
        currInput.classList.remove('input-task_error');
        if (currInput.value.trim() === '') {
          this.showMessage(currInput, 'Field empty');
          currInput.classList.add('input-task_error');
        } else {
          currInput.classList.add('input-task_filled');
          // console.log(name, value, validate[name](value));
          if (validate[name](value)) {
            currInput.classList.remove('input-task_error');
            currInput.setAttribute('data-success', 'data-success');
          } else {
            currInput.classList.add('input-task_error');
            this.showMessage(currInput, 'Error value');
          }
        }
      };
    });
  }
}

customElements.define('task-form', TaskForm);
