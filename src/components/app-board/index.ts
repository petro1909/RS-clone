import state from '../../store/state';
import createElement from '../../utils/createElement';
import template from './template.html';
import api from '../../api';

class AppBoard extends HTMLElement {
  connectedCallback() {
    this.renderBoard();
    this.board = document.getElementById('board')! as HTMLElement;
  }

  private draggingElem: HTMLElement | null = null;

  private shiftX: number = 0;

  private shiftY: number = 0;

  private currentDroppable: HTMLElement | null = null;

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
        }) as HTMLDivElement;
      });

      this.setTasksDragNDrop();
    }
  }

  setTasksDragNDrop() {
    this.board.addEventListener('mousedown', (event: MouseEvent) => {
      const eventTarget = event.target as HTMLElement;
      if (eventTarget.classList.contains('menu-btn')) return;
      this.draggingElem = eventTarget.closest('.task') as HTMLElement;

      if (this.draggingElem) {
        this.shiftX = event.clientX - this.draggingElem!.getBoundingClientRect().left;
        this.shiftY = event.clientY - this.draggingElem!.getBoundingClientRect().top;

        this.draggingElem.style.position = 'absolute';
        this.draggingElem.style.zIndex = '999999';
        this.draggingElem.classList.add('selected');
        const emptyZoneHTML = '<div class="empty-zone" id="empty-zone"></div>';
        this.draggingElem.insertAdjacentHTML('beforebegin', emptyZoneHTML);
        document.body.append(this.draggingElem);

        this.currentDroppable = this.draggingElem;
        this.moveDroppableAt(event.pageX, event.pageY);
      }

      this.setMouseUp();
    });

    this.setMouseMove();
  }

  private setMouseMove() {
    const onMouseMove = (event: MouseEvent) => {
      if (!this.draggingElem) return;
      const draggingElemCoord = this.draggingElem!.getBoundingClientRect();
      const draggingElemCenterY = draggingElemCoord.y + draggingElemCoord.height / 2;

      this.moveDroppableAt(event.pageX, event.pageY);

      if (this.draggingElem) {
        this.draggingElem.style.display = 'none';
        const elemBelow = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;
        this.draggingElem.style.display = 'block';
        if (!elemBelow) return;

        const droppableBelow = elemBelow.closest('.task')! as HTMLElement;
        if (droppableBelow) {
          const emptyZone = this.board.querySelector('#empty-zone');
          if (emptyZone) emptyZone?.remove();
          const dropZone = this.board.querySelector('#drop-zone');
          dropZone?.remove();
          const belowTaskCoord = this.currentDroppable!.getBoundingClientRect();
          const centerY = belowTaskCoord.y + belowTaskCoord.height / 2;
          const dropZoneHTML = '<div class="drop-zone" id="drop-zone"></div>';
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
            const dropZoneHTML = '<div class="drop-zone" id="drop-zone"></div>';
            if (emptyStatus) {
              emptyStatus!.querySelector('.status__task-list')!.innerHTML = dropZoneHTML;
              const emptyZone = this.board.querySelector('#empty-zone');
              if (emptyZone) emptyZone?.remove();
            }
          }
        }
      }
    };
    document.addEventListener('mousemove', onMouseMove);
  }

  private setMouseUp() {
    document.onmouseup = () => {
      // console.log('mouseup =>', task);
      const dropZone = this.board.querySelector('#drop-zone');
      const emptyZone = this.board.querySelector('#empty-zone');
      if (dropZone) {
        this.draggingElem!.style.position = 'static';
        dropZone.replaceWith(this.draggingElem!);
        this.saveMovedTasks(this.draggingElem!);
        this.draggingElem!.style.zIndex = '';
        this.draggingElem!.classList.remove('selected');
        document.onmouseup = null;
        this.currentDroppable = null;
        this.shiftX = 0;
        this.shiftY = 0;
        this.draggingElem = null;
      }
      if (emptyZone) {
        this.draggingElem!.style.position = 'static';
        emptyZone.replaceWith(this.draggingElem!);
        this.saveMovedTasks(this.draggingElem!);
        this.draggingElem!.style.zIndex = '';
        this.draggingElem!.classList.remove('selected');
        document.onmouseup = null;
        this.currentDroppable = null;
        this.shiftX = 0;
        this.shiftY = 0;
        this.draggingElem = null;
      }
    };
  }

  private moveDroppableAt(pageX: number, pageY: number) {
    if (this.draggingElem) {
      this.draggingElem.style.left = `${pageX - this.shiftX}px`;
      this.draggingElem.style.top = `${pageY - this.shiftY}px`;
    }
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
