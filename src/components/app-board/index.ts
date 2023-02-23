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

  private tag: 'STATUS' | 'TASK' | null = null;

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

      this.setBoardDragNDrop();
    }
  }

  private setBoardDragNDrop() {
    this.board.addEventListener('mousedown', (event: MouseEvent) => {
      const eventTarget = event.target as HTMLElement;
      if (eventTarget.classList.contains('menu-btn')
        || eventTarget.classList.contains('status__name')) return;

      const draggedStatus = eventTarget.closest('.status') as HTMLElement;
      const draggedTask = eventTarget.closest('.task') as HTMLElement;

      if (draggedTask) {
        this.tag = 'TASK';
        this.dragged = draggedTask as HTMLElement;

        this.shiftX = event.clientX - draggedTask.getBoundingClientRect().left;
        this.shiftY = event.clientY - draggedTask.getBoundingClientRect().top;

        draggedTask.style.position = 'fixed';
        draggedTask.style.zIndex = '999999';
        draggedTask.classList.add('selected');
        const emptySpaceForDropZone = '<div class="empty-zone-task" id="empty-zone"></div>';
        draggedTask.insertAdjacentHTML('beforebegin', emptySpaceForDropZone);
        document.body.append(draggedTask);

        this.currentDropZone = this.dragged;
        this.moveDroppableAt(event.pageX, event.pageY);
        this.setMouseMove();
        this.setMouseUp();
      } else if (draggedStatus) {
        this.tag = 'STATUS';
        this.dragged = draggedStatus as HTMLElement;

        this.shiftX = event.clientX - draggedStatus.getBoundingClientRect().left;
        this.shiftY = event.clientY - draggedStatus.getBoundingClientRect().top + 100;

        draggedStatus.style.position = 'fixed';
        draggedStatus.style.zIndex = '999999';
        draggedStatus.classList.add('selected');
        const draggedStatusFlexOrder = draggedStatus.style.order;
        this.dragged.style.order = '-1';
        const draggedStatusRectCoord = this.dragged!.getBoundingClientRect();
        const emptySpaceForDropZone = `
          <div class="drop-zone-status"
            id="drop-zone"
            style="order: ${draggedStatusFlexOrder};
            height: ${Math.round(draggedStatusRectCoord.height)}px;">
          </div>`;
        draggedStatus.insertAdjacentHTML('afterend', emptySpaceForDropZone);

        this.moveDroppableAt(event.clientX, event.clientY);
        this.setMouseMove();
        this.setMouseUp();
      }
    });
  }

  private moveDroppableAt(pageX: number, pageY: number) {
    if (this.dragged) {
      this.dragged!.style.left = `${Math.round(pageX - this.shiftX)}px`;
      this.dragged!.style.top = `${Math.round(pageY - this.shiftY)}px`;
    }
  }

  private setMouseMove() {
    document.onmousemove = (event: MouseEvent) => {
      if (!this.dragged) return;
      this.dragged!.style.display = 'none';
      const deepestElement = document.elementFromPoint(event.clientX, 120) as HTMLElement;
      this.dragged!.style.display = 'block';
      if (!deepestElement) return;

      if (this.tag === 'STATUS') {
        let closestStatus: HTMLElement | null = null;

        if (this.currentDropZone !== deepestElement) {
          closestStatus = deepestElement.closest('.status')!;
        } else {
          closestStatus = this.currentDropZone;
        }

        this.currentDropZone = closestStatus;
        this.renderMoveStatus(closestStatus);
        this.moveDroppableAt(event.clientX, event.clientY);
      }

      if (this.tag === 'TASK') {
        document.onmousemove = (e: MouseEvent) => {
          if (!this.dragged) return;
          const draggingElemCoord = this.dragged!.getBoundingClientRect();
          const draggingElemCenterY = draggingElemCoord.y + draggingElemCoord.height / 2;

          this.moveDroppableAt(e.pageX, e.pageY);

          if (this.dragged) {
            this.dragged.style.display = 'none';
            const elemBelow = document
              .elementFromPoint(e.clientX, e.clientY) as HTMLElement;
            this.dragged.style.display = 'block';
            if (!elemBelow) return;

            const droppableBelow = elemBelow.closest('.task')! as HTMLElement;
            if (droppableBelow) {
              const emptyZone = this.board.querySelector('#empty-zone');
              if (emptyZone) emptyZone?.remove();
              const dropZone = this.board.querySelector('#drop-zone');
              dropZone?.remove();
              const belowTaskCoord = this.currentDropZone!.getBoundingClientRect();
              const centerY = belowTaskCoord.y + belowTaskCoord.height / 2;
              const dropZoneHTML = '<div class="drop-zone-task" id="drop-zone"></div>';
              if (centerY > draggingElemCenterY) droppableBelow?.insertAdjacentHTML('beforebegin', dropZoneHTML);
              if (centerY <= draggingElemCenterY) droppableBelow?.insertAdjacentHTML('afterend', dropZoneHTML);
            } else {
              const emptyStatus = elemBelow.closest('.status')! as HTMLElement;
              if (!emptyStatus) return;
              const isStatusNotEmpty = !!emptyStatus.querySelector('.task');
              if (isStatusNotEmpty) return;
              if (!isStatusNotEmpty) {
                const dropZone = this.board.querySelector('#drop-zone');
                if (dropZone) dropZone?.remove();
                const dropZoneHTML = '<div class="drop-zone-task" id="drop-zone"></div>';
                if (emptyStatus) {
                  emptyStatus!.querySelector('.status__task-list')!.innerHTML = dropZoneHTML;
                  const emptyZone = this.board.querySelector('#empty-zone');
                  if (emptyZone) emptyZone?.remove();
                }
              }
            }
          }
        };
      }
    };
  }

  private renderMoveStatus(closestStatus: HTMLElement) {
    if (!closestStatus) return;
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
      this.currentDropZone!.insertAdjacentHTML('afterend', emptySpaceForDropZone);
    }
    if (draggedCenterX <= dropZoneCenterX) {
      this.currentDropZone!.insertAdjacentHTML('beforebegin', emptySpaceForDropZone);
    }

    const boardStatuses = Array.from(document.getElementById('board')!.children) as HTMLElement[];
    const draggedIndex = boardStatuses.indexOf(this.dragged!);
    boardStatuses.splice(draggedIndex, 1);
    boardStatuses.sort((a, b) => Number(a.style.order) - Number(b.style.order));
    for (let index = 0; index < boardStatuses.length; index += 1) {
      if (boardStatuses[index].style.order === '-1') break;
      boardStatuses[index].style.order = String(index + 1);
    }
  }

  private setMouseUp() {
    if (this.tag === 'STATUS') {
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
        document.onmousemove = null;
      };
    }

    if (this.tag === 'TASK') {
      document.onmouseup = () => {
        // console.log('mouseup =>', task);
        const dropZone = this.board.querySelector('#drop-zone');
        const emptyZone = this.board.querySelector('#empty-zone');
        if (dropZone) {
          this.dragged!.style.position = 'static';
          dropZone.replaceWith(this.dragged!);
          this.saveMovedTasks(this.dragged!);
          this.dragged!.style.zIndex = '';
          this.dragged!.classList.remove('selected');
          document.onmouseup = null;
          this.currentDropZone = null;
          this.shiftX = 0;
          this.shiftY = 0;
          this.dragged = null;
        }
        if (emptyZone) {
          this.dragged!.style.position = 'static';
          emptyZone.replaceWith(this.dragged!);
          this.saveMovedTasks(this.dragged!);
          this.dragged!.style.zIndex = '';
          this.dragged!.classList.remove('selected');
          document.onmouseup = null;
          document.onmousemove = null;
          this.currentDropZone = null;
          this.shiftX = 0;
          this.shiftY = 0;
          this.dragged = null;
        }
      };
    }
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

  private async saveMovedTasks(movedTask: HTMLElement) {
    const taskId = movedTask.getAttribute('taskid')!;
    const closestStatus = movedTask.closest('.status') as HTMLElement;
    const statusId = closestStatus?.getAttribute('statusid');
    const updatingTask = (await api.tasks.getById(taskId)).data;
    if (updatingTask) { updatingTask.statusId! = statusId!; }
    await api.tasks.update(updatingTask!);
    const oldTasksRequests = Array
      .from(closestStatus.querySelectorAll('.task')).map((task) => api.tasks.getById(task.getAttribute('taskid')!));
    const tasksLoaded = Array.from(await Promise.all(oldTasksRequests));
    for (let i = 0; i < tasksLoaded.length; i += 1) { tasksLoaded[i]!.data!.order = i + 1; }
    const updatingTasks = tasksLoaded.map((task) => api.tasks.update(task.data!));
    const updatedTasks = Array.from(await Promise.all(updatingTasks));
    for (let i = 0; i < updatedTasks.length; i += 1) {
      // console.log('newTasksPromises[i].data?.order', updatedTasks[i].data?.order);
    }
  }
}

customElements.define('app-board', AppBoard);
