import state from '../../store/state';
import createElement from '../../utils/createElement';
import template from './template.html';
import api from '../../api';
import { IStatus } from '../../types';

class AppBoard extends HTMLElement {
  connectedCallback() {
    this.renderBoard();
    this.board = document.getElementById('board')! as HTMLElement;
  }

  private currentDropZone: HTMLElement | null = null;

  private dragged: HTMLElement | null = null;

  private shiftX: number = 0;

  private shiftY: number = 0;

  private board: HTMLElement = document.getElementById('board')! as HTMLElement;

  private async renderBoard() {
    this.innerHTML = '<h3>No tasks found</h3>';

    if (state.user) {
      this.innerHTML = `${template}`;

      const statuses = await api.statuses.getByBoard(state.activeBoardId);
      state.statuses = statuses.data!;
      if (!statuses.data) return;

      this.board.innerHTML = '';
      statuses.data.forEach((status) => {
        createElement('app-status', this.board, {
          class: 'status__wrapper',
          statusId: `${status.id}`,
          statusName: `${status.name}`,
          order: `${status.order}`,
          style: `order: ${status.order};`,
        }) as HTMLDivElement;
      });

      this.setTasksDragNDrop();
    }
  }

  private setTasksDragNDrop() {
    this.board.addEventListener('mousedown', (event: MouseEvent) => {
      const eventTarget = event.target as HTMLElement;
      if (eventTarget.classList.contains('menu-btn')) return;

      const dragged = eventTarget.closest('.status') as HTMLElement;
      if (dragged) {
        this.dragged = dragged as HTMLElement;

        this.shiftX = event.clientX - dragged.getBoundingClientRect().left;
        this.shiftY = event.clientY - dragged.getBoundingClientRect().top;

        dragged.style.position = 'fixed';
        dragged.style.zIndex = '999999';
        dragged.classList.add('selected');
        const draggedFlexOrder = dragged.style.order;
        this.dragged.style.order = '-1';
        const draggedRectCoord = this.dragged!.getBoundingClientRect();
        const emptySpaceForDropZone = `
          <div class="drop-zone-status"
            id="drop-zone"
            style="order: ${draggedFlexOrder}; height: ${Math.round(draggedRectCoord.height)}px;">
          </div>`;
        dragged.insertAdjacentHTML('afterend', emptySpaceForDropZone);

        this.moveDroppableAt(event.clientX, event.clientY);
        this.setMouseMove();
        this.setMouseUp();
      }
    });
  }

  private moveDroppableAt(pageX: number, pageY: number) {
    if (this.dragged) {
      this.dragged.style.left = `${Math.round(pageX - this.shiftX)}px`;
      this.dragged.style.top = `${Math.round(pageY - this.shiftY)}px`;
    }
  }

  private setMouseMove() {
    document.addEventListener('mousemove', (event: MouseEvent) => {
      if (!this.dragged) return;

      this.dragged.style.display = 'none';
      const deepestElement = document.elementFromPoint(event.clientX, 120) as HTMLElement;
      this.dragged.style.display = 'block';
      if (!deepestElement) return;
      const closestStatus = deepestElement.closest('.status')! as HTMLElement;

      if (closestStatus) {
        this.currentDropZone = closestStatus;
        const closestStatusRectCoord = closestStatus.getBoundingClientRect();
        const draggedRectCoord = this.dragged!.getBoundingClientRect();

        const draggedCenterX = Math.ceil(draggedRectCoord.x)
          + Math.ceil(draggedRectCoord.width / 2);
        const dropZoneCenterX = Math.ceil(closestStatusRectCoord.x)
          + Math.ceil(closestStatusRectCoord.width / 2);

        const previousDropZone = this.board.querySelector('#drop-zone');
        previousDropZone?.remove();

        const closestStatusFlexOrder = closestStatus.style.order;
        const emptySpaceForDropZone = `
        <div class="drop-zone-status"
          id="drop-zone"
          style="order: ${closestStatusFlexOrder};
          height: ${Math.round(draggedRectCoord.height)}px;">
        </div>`;

        if (draggedCenterX > dropZoneCenterX) {
          this.currentDropZone.insertAdjacentHTML('afterend', emptySpaceForDropZone);
        }
        if (draggedCenterX <= dropZoneCenterX) {
          this.currentDropZone.insertAdjacentHTML('beforebegin', emptySpaceForDropZone);
        }

        const boardStatuses = Array.from(document.getElementById('board')!.children) as HTMLElement[];
        const draggedIndex = boardStatuses.indexOf(this.dragged);
        boardStatuses.splice(draggedIndex, 1);
        boardStatuses.sort((a, b) => Number(a.style.order) - Number(b.style.order));
        for (let index = 0; index < boardStatuses.length; index += 1) {
          if (boardStatuses[index].style.order === '-1') break;
          boardStatuses[index].style.order = String(index + 1);
        }
      }
      this.moveDroppableAt(event.clientX, event.clientY);
    });
  }

  private setMouseUp() {
    document.onmouseup = () => {
      const dropZoneForRemove = this.board.querySelector('#drop-zone')! as HTMLElement;
      const dropZoneFlexOrder = dropZoneForRemove.style.order;
      this.dragged!.style.order = dropZoneFlexOrder;
      dropZoneForRemove.remove();
      this.saveMovedStatuses();
      this.dragged!.style.position = '';
      this.dragged!.style.zIndex = '';
      this.dragged!.style.left = '';
      this.dragged!.style.top = '';
      this.dragged!.style.display = '';
      this.dragged!.classList.remove('selected');
      this.currentDropZone = null;
      this.dragged = null;
      this.shiftX = 0;
      this.shiftY = 0;
      document.onmouseup = null;
    };
  }

  private async saveMovedStatuses() {
    const boardStatuses = [...this.board.querySelectorAll('.status')] as HTMLElement[];
    boardStatuses.map((status) => {
      status.setAttribute('order', status.style.order);
      const updatingStatus: IStatus = {
        id: status.getAttribute('statusid')!,
        name: status.getAttribute('statusname')!,
        boardId: state.activeBoardId,
        order: Number(status.getAttribute('order')),
      };
      return api.statuses.update(updatingStatus);
    });
  }
}

customElements.define('app-board', AppBoard);
