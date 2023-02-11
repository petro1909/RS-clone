import state from '../../store/state';
import api from '../../api';
import createElement from '../../utils/createElement';
import template from './template.html';
// import { ITask, IAPIResponse } from '../../types';

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

      // console.table(statuses.data);
      statuses.data.forEach((status) => {
        createElement('app-status', boardWrapper, {
          class: 'status__wrapper',
          statusId: `${status.id}`,
          statusName: `${status.name}`,
        }) as HTMLDivElement;
      });

      this.setStatusesDragNDrop();
    }
  }

  private setStatusesDragNDrop() {
    const currentBoard = document.querySelector('.board') as HTMLElement;
    currentBoard.draggable = true;
    currentBoard.ondragstart = (event) => {
      const eventTarget = event.target! as HTMLElement;
      const dragStartStatus = eventTarget.closest('.status') as HTMLElement;
      event.dataTransfer?.setData('id', dragStartStatus.getAttribute('statusid')!);
      dragStartStatus.classList.add('dragging');
    };

    currentBoard.ondragover = (event) => {
      const underDragZone = document.querySelector('.under-drag');
      const eventDragTarget = event.target as HTMLElement;
      const closestStatusElem = eventDragTarget.closest('.status') as HTMLElement;
      underDragZone?.classList.remove('under-drag');
      closestStatusElem?.classList.add('under-drag');
      event.preventDefault();
    };

    currentBoard.ondrop = (event) => {
      const draggingElement = document.querySelector('.dragging');
      draggingElement?.classList.remove('dragging');
      const dropZone = document.querySelector('.under-drag');
      dropZone?.classList.remove('under-drag');

      const eventDropTarget = event.target! as HTMLElement;
      const dropZoneStatus = eventDropTarget.closest('.status') as HTMLElement;
      if (dropZoneStatus) {
        const dropZoneClone = dropZoneStatus.cloneNode(true);
        const draggedStatus = document
          .querySelector(`app-status[statusid="${Number(event.dataTransfer?.getData('id')!)}"]`)!;
        dropZoneStatus.replaceWith(draggedStatus?.cloneNode(true));
        draggedStatus.replaceWith(dropZoneClone);
        this.updateStatusesOrder();
      }
    };
  }

  private async updateStatusesOrder() {
    const movedStatusesOrder = Array.from(document.querySelectorAll('app-status')) as Array<Element>;
    const statusesTasksRequests = movedStatusesOrder.map((status) => {
      const statusId = status.getAttribute('statusid')!;
      return api.tasks.getByStatus(+statusId);
    });
    const statusesTasksResponses = await Promise.all(statusesTasksRequests);
    const statusesTasksOldValues = statusesTasksResponses.map((response) => response.data);
    // console.log('done!', statusesTasksOldValues);
    const updatingStatusTasks = statusesTasksOldValues.map((tasksArray, index) => {
      console.log();
      return tasksArray?.map((task) => {
        console.log();
        return api.tasks.update({
          id: task.id,
          name: task.name,
          statusId: index + 1, // (+ 1) - Корректировка нулевого индекса статуса
        });
      });
    });
    const currentStatusesTasks = await Promise.all(updatingStatusTasks.flat());
    console.log('currentStatusTasks', currentStatusesTasks);
    const updatingOrderOfStatuses = movedStatusesOrder.map((status, index) => {
      const statusName = status.getAttribute('statusname')!;
      status.setAttribute('statusid', `${index + 1}`);
      return api.statuses.update({
        id: index + 1,
        name: statusName,
        boardId: state.activeBoardId,
      });
    });
    const currentStatusesOrder = await Promise.all(updatingOrderOfStatuses);
    console.log('currentStatusesOrder', currentStatusesOrder);
  }
}

customElements.define('app-board', AppBoard);
