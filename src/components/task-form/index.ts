import template from './template.html';
import { ITask } from '../../types';
// import validate from '../../utils/validate';
import router from '../../router';
import api from '../../api';
import apiService from '../../services/apiHandler';
import convertTimeForDateInput from '../../utils/convertTimeForDateInput';
import appEvent from '../../events';

class TaskForm extends HTMLElement {
  private task: ITask;

  constructor() {
    super();
    this.task = {} as ITask;
  }

  connectedCallback() {
    this.innerHTML = template;
    const form = this.querySelector('.task-form') as HTMLFormElement;
    const popupPage = this.querySelector('.popup-page') as HTMLFormElement;

    popupPage.onclick = (event) => {
      const eventTarget = event.target as HTMLDivElement;
      if (eventTarget?.classList.contains('popup-page')) {
        this.remove();
      }
    };

    if (this.hasAttribute('taskId')) {
      this.setValues();
      this.renderTaskMarks();
    } else {
      this.connectDatePickers();
    }

    form.onsubmit = (event) => {
      event.preventDefault();
      this.submitHandler(form);
    };
    this.setInputFieldState();
  }

  private connectDatePickers() {
    const startDateInput = this.querySelector('#input-task-start') as HTMLInputElement;
    const endDateInput = this.querySelector('#input-task-end') as HTMLInputElement;
    const startDatePicker = this.querySelector('#picker-task-start') as HTMLInputElement;
    const endDatePicker = this.querySelector('#picker-task-end') as HTMLInputElement;

    if (startDateInput.value) {
      startDatePicker.value = startDateInput.value;
    }

    if (endDateInput.value) {
      endDatePicker.value = endDateInput.value;
    }

    endDatePicker?.addEventListener('input', () => {
      if (endDatePicker.value) {
        endDateInput.value = endDatePicker.value;
      }
    });
    startDatePicker?.addEventListener('input', () => {
      if (startDatePicker.value) {
        startDateInput.value = startDatePicker.value;
      }
    });
  }

  private async setValues() {
    const taskId = this.getAttribute('taskId') as string;
    const result = await api.tasks.getById(taskId);
    const inputs = this.querySelectorAll('.input-task');

    if (!result.success) return;
    this.task = result.data as ITask;

    inputs.forEach((input) => {
      const currInput = input as HTMLInputElement;
      const { name } = currInput;
      if (name) {
        const taskKey = name as keyof ITask;
        if (name in this.task && this.task[taskKey]) {
          if (currInput.type === 'date') {
            // const dateInput = currInput as HTMLDa
            const stringDate = this.task[taskKey] as string;
            const date = new Date(stringDate);
            currInput.setAttribute('value', `${convertTimeForDateInput(date)}`);
          } else {
            currInput.value = this.task[taskKey]?.toString() as string;
          }
        }
      }
    });
    this.connectDatePickers();
  }

  private async submitHandler(form: HTMLFormElement): Promise<void> {
    const inputs = [...form.elements] as HTMLInputElement[];
    const taskform = document.querySelector('task-form') as HTMLElement;
    const currentStatus = taskform?.getAttribute('statusId') as string;
    const name = inputs.find((input) => input.name === 'name')?.value;
    const description = inputs.find((input) => input.name === 'description')?.value;
    const startDate = inputs.find((input) => input.name === 'startDate')?.value;
    const endDate = inputs.find((input) => input.name === 'endDate')?.value;
    const task = {
      statusId: currentStatus,
      name,
    } as ITask;
    if (description) {
      Object.assign(task, { description });
    }
    if (startDate) {
      Object.assign(task, { startDate });
    }
    if (endDate) {
      Object.assign(task, { endDate });
    }
    if (this.hasAttribute('taskId')) {
      Object.assign(task, {
        id: this.getAttribute('taskId'),
        statusId: this.task.statusId,
      });
    }
    this.sendTask(task);

    // const taskData = {
    //   name: inputs['name']
    // }
    // inputs.forEach((input) => {
    //   const currInput = input as HTMLInputElement;
    //   const { name, value } = currInput;
    //   if (name) {
    //     if (currInput.hasAttribute('data-success')) {
    //       taskData[name] = value;
    //       if (this.hasAttribute('taskId') && (name in this.task)) {
    //         this.task[name as keyof ITask] = value;
    //       }
    //     }
    //   }
    // });
    // if (Object.values(taskData).length === 1) this.sendTask(taskData);
    // {
    //   if (this.hasAttribute('taskId')) {
    //     this.updateTask();
    //   } else {
    //     this.createNewTask(taskData);
    //   }
    // }
  }

  private async sendTask(taskData: ITask) {
    // const taskform = document.querySelector('task-form') as HTMLElement;
    // const currentStatus = taskform?.getAttribute('statusId') as string;
    if (this.hasAttribute('taskId')) {
      const result = await api.tasks.update(taskData);
      if (result.success) {
        router.goTo('/board');
      }
    } else {
      const result = await apiService.addTask(taskData);
      if (result.success) {
        router.goTo('/board');
      }
    }
    const ev = appEvent.taskUpdateEvent;
    window.dispatchEvent(ev);
  }

  private showMessage(input: HTMLInputElement, str = '') {
    const messageWrapper = input.nextElementSibling;
    if (messageWrapper) messageWrapper.textContent = str;
  }

  private setInputFieldState() {
    const inputs = this.querySelectorAll('.input-task');
    inputs.forEach((input) => {
      const currInput = input as HTMLInputElement;
      currInput.onblur = () => {
        // const { name, value } = currInput;
        this.showMessage(currInput);
        currInput.classList.remove('input-task_filled');
        currInput.classList.remove('input-task_error');
        if (currInput.value.trim() === '') {
          this.showMessage(currInput, 'Field empty');
          currInput.classList.add('input-task_error');
        } else {
          currInput.classList.add('input-task_filled');
          // //
          currInput.classList.remove('input-task_error');
          currInput.setAttribute('data-success', 'data-success');
          // if (validate[name](value)) {
          //   currInput.classList.remove('input-task_error');
          //   currInput.setAttribute('data-success', 'data-success');
          // } else {
          //   currInput.classList.add('input-task_error');
          //   this.showMessage(currInput, 'Error value');
          // }
        }
      };
    });
  }

  private renderTaskMarks() {
    const taskMarksWrapper = this.querySelector('.task-marks-wrapper') as HTMLDivElement;
    const taskEditBtn = this.querySelector('#show-marks-edit') as HTMLButtonElement;
    const taskId = this.getAttribute('taskId');

    taskEditBtn.onclick = (e) => {
      e.preventDefault();
      taskMarksWrapper.innerHTML = `
        <app-modal>
        <mark-list id="${taskId}"></mark-list>
        </app-modal>
    `;
    };
  }
}

customElements.define('task-form', TaskForm);
