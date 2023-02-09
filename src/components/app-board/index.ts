import state from '../../store/state';
import api from '../../api';
import createElement from '../../utils/createElement';
import template from './template.html';

class AppBoard extends HTMLElement {
  connectedCallback() {
    this.renderBoard();
  }

  private async renderBoard() {
    this.innerHTML = '<h3>No tasks found</h3>';
    if (state.user) {
      this.innerHTML = `${template}`;
      const statuses = await api.statuses.getByBoard(state.activeBoardId);
      if (!statuses.data) return;

      const boardWrapper = this.querySelector('#board') as HTMLInputElement;

      statuses.data.forEach((status) => {
        createElement('app-status', boardWrapper, {
          class: 'status__wrapper',
          statusId: `${status.id}`,
          statusName: `${status.name}`,
        }) as HTMLDivElement;
      });

      const addStatusBtn = createElement('button', boardWrapper, {
        class: 'board__add-btn menu-btn',
      }, '+ Add status') as HTMLButtonElement;
      addStatusBtn.id = 'add-status';
      // <button class="board__add-btn menu-btn" id="add-status">+ Add status</button>
    }
  }
}

customElements.define('app-board', AppBoard);
