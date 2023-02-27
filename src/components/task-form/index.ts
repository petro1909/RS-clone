import template from './template.html';
import { ITask, ITaskUser } from '../../types';
import router from '../../router';
import api from '../../api';
import apiService from '../../services/apiHandler';
import convertTimeForDateInput from '../../utils/convertTimeForDateInput';
import appEvent from '../../events';
import createElement from '../../utils/createElement';
import { isLight } from '../../utils/colorHelpers';
import state from '../../store/state';
import settings from '../../store/settings';

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
      this.renderTaskUsers();
      this.renderTaskAttachs();
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
  }

  private async sendTask(taskData: ITask) {
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
        this.showMessage(currInput);
        currInput.classList.remove('input-task_filled');
        currInput.classList.remove('input-task_error');
        if (currInput.value.trim() === '') {
          this.showMessage(currInput, 'Field empty');
          currInput.classList.add('input-task_error');
        } else {
          currInput.classList.add('input-task_filled');
          currInput.classList.remove('input-task_error');
          currInput.setAttribute('data-success', 'data-success');
        }
      };
    });
  }

  private async renderTaskMarks() {
    const boardMarksWrapper = this.querySelector('#board-marks-modal') as HTMLDivElement;
    const taskEditBtn = this.querySelector('#show-marks-edit') as HTMLButtonElement;
    const taskId = this.getAttribute('taskId') as string;

    taskEditBtn.onclick = (e) => {
      e.preventDefault();
      boardMarksWrapper.innerHTML = `
        <app-modal>
        <mark-list id="${taskId}"></mark-list>
        </app-modal>
    `;
      const markList = boardMarksWrapper.querySelector('mark-list');
      markList?.addEventListener('change', () => {
        this.renderTaskMarksTags();
      });
    };
    this.renderTaskMarksTags();
  }

  private async renderTaskMarksTags() {
    const taskMarksWrapper = this.querySelector('.task-marks-wrapper') as HTMLDivElement;
    taskMarksWrapper.innerHTML = '';
    const taskId = this.getAttribute('taskId') as string;
    const marks = await apiService.getTaskMarks(taskId);
    marks.forEach((mark) => {
      const tag = createElement('span', taskMarksWrapper, {
        class: 'task-mark-tag',
      }, `${mark.name}`) as HTMLSpanElement;
      if (mark.color) {
        tag.style.backgroundColor = mark.color;
        tag.style.color = isLight(mark.color) ? '#000' : '#fff';
      }
    });
  }

  private async renderTaskUsers() {
    const taskUsersWrapper = this.querySelector('#board-users-modal') as HTMLDivElement;
    const usersEditBtn = this.querySelector('#show-users-edit') as HTMLButtonElement;
    const taskId = this.getAttribute('taskId') as string;
    usersEditBtn.onclick = (e) => {
      e.preventDefault();
      taskUsersWrapper.innerHTML = `
        <app-modal>
          <usertask-select id="${taskId}"></usertask-select>
        </app-modal>
        `;
      const userList = taskUsersWrapper.querySelector('usertask-select');
      userList?.addEventListener('change', () => {
        this.renderTaskUsersTags();
      });
    };
    this.renderTaskUsersTags();
  }

  private async renderTaskUsersTags() {
    const taskUsersWrapper = this.querySelector('.task-users-wrapper') as HTMLDivElement;
    taskUsersWrapper.innerHTML = '';
    const taskId = this.getAttribute('taskId') as string;
    const taskUsers = (await api.taskUsers.getTaskUsers(taskId)).data as ITaskUser[];
    const users = taskUsers.map((taskUser) => {
      const [currUser] = state.activeBoardUsers
        .filter((boardUser) => boardUser.id === taskUser.boardUserId);
      return currUser;
    });
    users.forEach((user) => {
      taskUsersWrapper.innerHTML += `
      <div class="task-users__user-wrapper">
        <div id="p-${user.user.id}" class="task-users__user-img board-users__user"></div>
        <span class="task-users__user-email">${user.user.email}</span>
      </div>
      `;
      if (user.user.profilePicture) {
        const userpic = taskUsersWrapper.querySelector(`#p-${user.user.id}`) as HTMLDivElement;
        userpic.style.backgroundImage = `url(${user.user.profilePicture})`;
      }
    });
  }

  private async renderTaskAttachs() {
    const taskAttachWrapper = this.querySelector('#task-attach-modal') as HTMLDivElement;
    const addAttachBtn = this.querySelector('#show-attach-edit') as HTMLButtonElement;
    const taskId = this.getAttribute('taskId') as string;
    addAttachBtn.onclick = (e) => {
      e.preventDefault();
      taskAttachWrapper.innerHTML = `
        <app-modal>
          <task-attach id="${taskId}"></task-attach>
        </app-modal>
      `;
      const attachModal = taskAttachWrapper.querySelector('task-attach') as HTMLInputElement;
      attachModal?.addEventListener('update', () => {
        this.renderFilesLinks();
        taskAttachWrapper.innerHTML = '';
      });
    };
    this.renderFilesLinks();
  }

  private async renderFilesLinks() {
    const taskAttachWrapper = this.querySelector('.task-attach-wrapper') as HTMLDivElement;
    taskAttachWrapper.innerHTML = '';
    const taskId = this.getAttribute('taskId') as string;
    const links = await api.files.getFiles(taskId);
    if (!links.success) return;
    links.data!.forEach((link) => {
      if (link.type === 'LINK') {
        taskAttachWrapper.innerHTML += `
          <div class="task-attach__link-wrapper">
            <a class="task-attach__link" href="${link.name}" target="_blank">
              <div class="task-attach__link-icon task-attach__link-icon_link">
              <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M14 11.998C14 9.506 11.683 7 8.857 7H7.143C4.303 7 2 9.238 2 11.998c0 2.378 1.71 4.368 4 4.873a5.3 5.3 0 001.143.124" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 11.998c0 2.491 2.317 4.997 5.143 4.997h1.714c2.84 0 5.143-2.237 5.143-4.997 0-2.379-1.71-4.37-4-4.874A5.304 5.304 0 0016.857 7" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              </div>
              <p class="task-attach__link-name">${link.name}</p>
            </a>
            <button class="task-attach__link-del-btn" id="${link.id}">❌</button>
          </div>
        `;
      } else if (link.type === 'FILE') {
        taskAttachWrapper.innerHTML += `
          <div class="task-attach__link-wrapper">
            <a class="task-attach__link" href="${settings.SERVER}/${link.path}" target="_blank">
              <div class="task-attach__link-icon task-attach__link-icon_file">
              <svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M4 21.4V2.6a.6.6 0 01.6-.6h11.652a.6.6 0 01.424.176l3.148 3.148A.6.6 0 0120 5.75V21.4a.6.6 0 01-.6.6H4.6a.6.6 0 01-.6-.6zM8 10h8M8 18h8M8 14h4" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16 2v3.4a.6.6 0 00.6.6H20" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              </div>
              <p class="task-attach__link-name">${link.name}</p>
            </a>
            <button class="task-attach__link-del-btn" id="${link.id}">❌</button>
          </div>
        `;
      }
    });

    const delBtns = taskAttachWrapper.querySelectorAll('.task-attach__link-del-btn') as NodeListOf<HTMLButtonElement>;
    delBtns.forEach((delBtn) => {
      const btn = delBtn;
      btn.onclick = (e) => {
        e.preventDefault();
        const linkId = btn.id as string;
        this.deleteFile(linkId);
      };
    });
  }

  private async deleteFile(id: string) {
    const res = await api.files.delete(id);
    if (res.success) {
      this.renderFilesLinks();
    }
  }
}

customElements.define('task-form', TaskForm);
