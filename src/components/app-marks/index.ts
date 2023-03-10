import api from '../../api';
import state from '../../store/state';
import { IBoardMark, ITaskMark } from '../../types';

class MarkList extends HTMLElement {
  connectedCallback() {
    this.classList.add('mark-list');
    this.render();
  }

  disconnectedCallback() {
    this.dispatchEvent(new Event('change'));
  }

  private render() {
    this.innerHTML = `
      <ul id="board-mark-list"></ul>
      <input-mark mode="add"></input-mark>
    `;
    this.renderMarks();
  }

  private async renderMarks() {
    const marksWrapper = this.querySelector('#board-mark-list') as HTMLUListElement;
    const resultBoardMarks = await api.boardMarks.getByBoard(state.activeBoardId);
    if (!resultBoardMarks.data) return;
    const marks = resultBoardMarks.data as IBoardMark[];
    const resultTaskMarks = await api.taskMarks.getByTask(this.id);
    if (!resultTaskMarks.data) return;
    const taskMarks = resultTaskMarks.data as ITaskMark[];

    marks.forEach((mark) => {
      marksWrapper.innerHTML += `
      <li class="board-mark__item">
      <div class="custom__checkbox">
        <input class="default__check" type="checkbox" value="${mark.id}" id="ch-${mark.id}">
        <label for="ch-${mark.id}" class="custom__check"></label>
      </div>
        
        <input-mark mode="show" id="${mark.id}" color="${mark.color}" name="${mark.name}"></input-mark>
      </li>
      `;
    });

    const marksCheckBxs = marksWrapper.querySelectorAll('input[type=checkbox]') as NodeListOf<HTMLInputElement>;

    marksCheckBxs.forEach((checkBx) => {
      const [currTaskMark] = taskMarks.filter((taskMark) => taskMark.boardMarkId === checkBx.value);

      if (currTaskMark) checkBx.setAttribute('checked', 'true');
      checkBx.addEventListener('input', () => {
        if (!checkBx.checked) {
          this.deleteTaskMark(currTaskMark.id);
        } else {
          this.createTaskMark(this.id, checkBx.value);
        }
      });
    });

    const markInputs = this.querySelectorAll('input-mark') as NodeListOf<HTMLInputElement>;
    markInputs.forEach((markInput) => {
      markInput.addEventListener('send', () => {
        this.render();
      });
    });
  }

  private async createTaskMark(taskId: string, boardMarkId: string) {
    const result = await api.taskMarks.create({ taskId, boardMarkId });
    if (result.success) {
      this.render();
    }
  }

  private async deleteTaskMark(taskMarkId: string) {
    const result = await api.taskMarks.delete(taskMarkId);
    if (result.success) {
      this.render();
    }
  }
}

customElements.define('mark-list', MarkList);
