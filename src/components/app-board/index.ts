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

  private dragged: HTMLElement | null = null;

  private shiftX: number = 0;

  private shiftY: number = 0;

  // private lastClickX: number = 0;

  // private lastClickY: number = 0;

  private futureDropZone: HTMLElement | null = null;

  // private dropZoneTag: 'task' | 'status' | null = null;

  private board: HTMLElement = document.getElementById('board')! as HTMLElement;

  private moveDroppableAt(pageX: number, pageY: number) {
    if (this.dragged) {
      this.dragged.style.left = `${Math.round(pageX - this.shiftX)}px`;
      this.dragged.style.top = `${Math.round(pageY - this.shiftY)}px`;
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
        const flexOrder = dragged.style.order;
        this.dragged.style.order = '-1';
        const draggedCoord = this.dragged!.getBoundingClientRect();
        const dropZoneHTML = `<div class="drop-zone-status" id="drop-zone" style="order: ${flexOrder}; height: ${Math.round(draggedCoord.height)}px;"></div>`;
        dragged.insertAdjacentHTML('afterend', dropZoneHTML);

        this.moveDroppableAt(event.clientX, event.clientY);
        this.setMouseMove();
        this.setMouseUp();
      }
    });
  }

  private setMouseMove() {
    document.addEventListener('mousemove', (event: MouseEvent) => {
      if (!this.dragged) return;

      this.dragged.style.display = 'none';
      const lowestElement = document.elementFromPoint(event.clientX, 120) as HTMLElement;
      this.dragged.style.display = 'block';
      if (!lowestElement) return;

      const futureDropZone = lowestElement.closest('.status')! as HTMLElement;

      if (futureDropZone) {
        const dropZoneCoord = futureDropZone.getBoundingClientRect();
        // console.log('futureDropZone.style.order', futureDropZone.style.order);
        this.futureDropZone = futureDropZone;

        const draggedCoord = this.dragged!.getBoundingClientRect();
        const draggedCenterX = Math.ceil(draggedCoord.x) + Math.ceil(draggedCoord.width / 2);
        const dropZoneCenterX = Math.ceil(dropZoneCoord.x) + Math.ceil(dropZoneCoord.width / 2);

        // console.log('futureDropZone', this.futureDropZone);
        // console.log('dropZoneCenterX', dropZoneCenterX, 'draggedCenterX', draggedCenterX);

        const dropZone = this.board.querySelector('#drop-zone');
        dropZone?.remove();
        const flexOrder = futureDropZone.style.order;
        // console.log('flexOrder', flexOrder);
        if (draggedCenterX > dropZoneCenterX) {
          const dropZoneHTML = `<div class="drop-zone-status" id="drop-zone" style="order: ${flexOrder}; height: ${Math.round(draggedCoord.height)}px;"></div>`;
          this.futureDropZone.insertAdjacentHTML('afterend', dropZoneHTML);
          const children = Array.from(document.getElementById('board')!.children) as HTMLElement[];
          const draggedIndex = children.indexOf(this.dragged);
          children.splice(draggedIndex, 1);
          children.sort((a, b) => Number(a.style.order) - Number(b.style.order));
          // children.map((child, index) => {
          //   if (child.style.order === '-1') return child;
          //   child.style.order = String(index + 1);
          //   return child;
          // });
          for (let index = 0; index < children.length; index += 1) {
            if (children[index].style.order === '-1') break;
            children[index].style.order = String(index + 1);
          }
        }
        if (draggedCenterX <= dropZoneCenterX) {
          const dropZoneHTML = `<div class="drop-zone-status" id="drop-zone" style="order: ${flexOrder}; height: ${Math.round(draggedCoord.height)}px;"></div>`;
          this.futureDropZone.insertAdjacentHTML('beforebegin', dropZoneHTML);
          const children = Array.from(document.getElementById('board')!.children) as HTMLElement[];
          const draggedIndex = children.indexOf(this.dragged);
          children.splice(draggedIndex, 1);
          children.sort((a, b) => Number(a.style.order) - Number(b.style.order));
          // children.map((child, index) => {
          //   if (child.style.order === '-1') return child;
          //   child.style.order = String(index + 1);
          //   return child;
          // });
          for (let index = 0; index < children.length; index += 1) {
            if (children[index].style.order === '-1') break;
            children[index].style.order = String(index + 1);
          }
        }
      }
      // }
      this.moveDroppableAt(event.clientX, event.clientY);
    });
  }

  private async saveMovedStatuses() {
    const statusHtmlElements = [...this.board.querySelectorAll('.status')] as HTMLElement[];
    statusHtmlElements.map((status) => {
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

  private setMouseUp() {
    document.onmouseup = () => {
      const dropZoneRemove = this.board.querySelector('#drop-zone')! as HTMLElement;
      const dropZoneOrder = dropZoneRemove.style.order;
      this.dragged!.style.order = dropZoneOrder;
      dropZoneRemove.remove();
      this.saveMovedStatuses();
      this.dragged!.style.position = '';
      this.dragged!.style.left = '';
      this.dragged!.style.top = '';
      this.dragged!.classList.remove('selected');
      this.dragged!.style.zIndex = '';
      document.onmouseup = null;
      this.dragged = null;
      this.shiftX = 0;
      this.shiftY = 0;
      this.dragged = null;
    };
  }

  // private async saveMovedTasks(movedTask: HTMLElement) {
  //   const taskId = movedTask.getAttribute('taskid')!;
  //   const closestStatus = movedTask.closest('.status') as HTMLElement;
  //   const statusId = closestStatus?.getAttribute('statusid');
  //   const updatingTask = (await api.tasks.getById(taskId)).data;
  //   if (updatingTask) { updatingTask.statusId! = statusId!; }
  //   await api.tasks.update(updatingTask!);
  //   const oldTasksRequests = Array
  //     .from(closestStatus.querySelectorAll('.task'))
  //       .map((task) => api.tasks.getById(task.getAttribute('taskid')!));
  //   const tasksLoaded = Array.from(await Promise.all(oldTasksRequests));
  //   for (let i = 0; i < tasksLoaded.length; i += 1) { tasksLoaded[i]!.data!.order = i + 1; }
  //   const updatingTasks = tasksLoaded.map((task) => api.tasks.update(task.data!));
  //   const updatedTasks = Array.from(await Promise.all(updatingTasks));
  //   for (let i = 0; i < updatedTasks.length; i += 1) {
  //     // console.log('newTasksPromises[i].data?.order', updatedTasks[i].data?.order);
  //   }
  // }

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
}

customElements.define('app-board', AppBoard);
