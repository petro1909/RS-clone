import apiService from '../../services/apiHandler';
import { ITask } from '../../types';
import createElement from '../../utils/createElement';

class AppBoardCalendar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  private render() {
    this.innerHTML = `
      <app-calendar id="calendar-tasks" lang="en" class-prefix="board-calendar"></app-calendar>
    `;
    this.activateCalendar();
  }

  private activateCalendar() {
    const calendar = this.querySelector('#calendar-tasks') as HTMLInputElement;
    this.setDeadLineTasks();
    calendar.addEventListener('change', this.setDeadLineTasks.bind(this));
    window.addEventListener('task-update', this.setDeadLineTasks.bind(this));
  }

  private async setDeadLineTasks() {
    const calendar = this.querySelector('#calendar-tasks') as HTMLInputElement;
    const tasks = await apiService.getTasksByDeadline() as ITask[];
    const currMonth = Number(calendar.getAttribute('month'));
    const currTasks = tasks.filter((task) => (new Date(task?.endDate!)).getMonth() === currMonth);
    const currTasksDates = currTasks.map((task) => (new Date(task?.endDate!)).getDate())
      .filter((date) => date >= (new Date()).getDate());
    const dateBtns = calendar.querySelectorAll('.board-calendar__date-button') as NodeListOf<HTMLButtonElement>;
    dateBtns.forEach((btn) => {
      if (currTasksDates.includes(Number(btn.textContent)) && !btn.disabled) {
        this.setDeadLineBtn(btn, currTasks);
      }
    });
  }

  private setDeadLineBtn(btn: HTMLButtonElement, currTasks: ITask[]) {
    const dateTasks = currTasks
      .filter((task) => (new Date(task?.endDate!)).getDate() === Number(btn.textContent));
    const button = btn;
    const tooltip = createElement('div', null, {
      class: 'board-calendar__date-tooltip tooltip',
    }, `
        <p class="tooltip__header">Deadline of tasks:</p>
        <ul></ul>
    `);
    const tasksList = tooltip.querySelector('ul') as HTMLUListElement;
    dateTasks.forEach((task) => {
      createElement('li', tasksList, {
        class: 'this-date-task',
      }, `
        <p>${task.name}</p>
      `);
    });
    button.classList.add('board-calendar__date-button_marked');
    button.onmouseover = () => {
      button.appendChild(tooltip);
    };
    button.onmouseleave = () => {
      tooltip.remove();
    };
  }
}

customElements.define('board-calendar', AppBoardCalendar);
