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

      this.renderAddStatusBtn(boardWrapper);
      // <button class="board__add-btn menu-btn" id="add-status">+ Add status</button>
    }
  }

  private renderAddStatusBtn(parent: HTMLDivElement) {
    const addStatusWrapper = createElement('div', parent, {
      class: 'board__add-btn',
    }) as HTMLDivElement;
    const addStatusBtn = createElement('button', addStatusWrapper, {
      class: 'menu-btn',
    }, '+ Add status') as HTMLButtonElement;
    addStatusBtn.id = 'add-status';
    const addStatusInput = createElement('input', addStatusWrapper, {
      class: 'status__name input-text',
      type: 'text',
    }) as HTMLInputElement;
    addStatusInput.style.display = 'none';
    addStatusBtn.onclick = () => {
      addStatusInput.style.display = 'block';
      addStatusInput.focus();
      addStatusBtn.textContent = 'Save';
      addStatusBtn.onclick = () => {
        if (addStatusInput.value.trim()) {
          const newStatusName = addStatusInput.value.trim();
          addStatusInput.disabled = true;
          addStatusInput.value = 'Saving...';
          this.addStatus(newStatusName);
        }
      };
    };
    addStatusInput.onblur = () => {
      if (addStatusInput.value.trim()) {
        console.log(addStatusInput.value.trim());
      } else {
        addStatusWrapper.remove();
        this.renderAddStatusBtn(parent);
      }
    };
  }

  private async addStatus(newStatusName: string) {
    const result = await api.statuses.create(state.activeBoardId, newStatusName);
    if (result.success) {
      this.renderBoard();
    }
  }
}

customElements.define('app-board', AppBoard);
