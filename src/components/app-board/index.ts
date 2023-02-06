import state from '../../store/state';
import api from '../../api';
import createElement from '../../utils/createElement';

class AppBoard extends HTMLElement {
  connectedCallback() {
    this.renderBoard();
  }

  private async renderBoard() {
    this.innerHTML = '<h3>No tasks faound</h3>';
    if (state.user) {
      this.innerHTML = '';
      const statuses = await api.statuses.getByBoard(state.activeBoardId);
      if (!statuses.data) return;

      statuses.data.forEach((status) => {
        const statusWrapper = createElement('div', this, {
          class: 'status__wrapper',
        }, `<h2>${status.name}</h2`) as HTMLDivElement;

        createElement('div', statusWrapper, {
          class: 'tasks__wrapper',
        }, 'tasks');
      });
    }
  }
}

customElements.define('app-board', AppBoard);
