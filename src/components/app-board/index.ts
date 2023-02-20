import state from '../../store/state';
import createElement from '../../utils/createElement';
import template from './template.html';
import api from './../../api';
import createInputButton from '../createInputButton';
import apiService from '../../services/apiHandler';

class AppBoard extends HTMLElement {
  connectedCallback() {
    this.renderBoard();
  }

  private async renderBoard() {
    this.innerHTML = '<h3>No tasks found</h3>';
    if (state.user) {
      this.innerHTML = `${template}`;
      const statuses = await api.statuses.getByBoard(state.activeBoardId);
      state.statuses = statuses.data!;
      console.log('class AppBoard renderBoard() => state.statuses =', state.statuses);
      if (!statuses.data) return;
      // const statuses = await api.statuses.getByBoard(state.activeBoardId);
      // if (!statuses.data) return;

      const boardWrapper = this.querySelector('#board') as HTMLInputElement;
      statuses.data.forEach((status) => {
        createElement('app-status', boardWrapper, {
          class: 'status__wrapper',
          statusId: `${status.id}`,
          statusName: `${status.name}`,
          order: `${status.order}`,
        }) as HTMLDivElement;
      });
      this.setStatusesDragNDrop();
    }
  }

  setStatusesDragNDrop() {
    const board = document.getElementById('board')! as HTMLElement;
    let task: HTMLElement | null = null;
    let shiftX: number = 0;
    let shiftY: number = 0;
    let currentDroppable: HTMLElement | null = null;

    const moveTaskAt = (pageX: number, pageY: number) => {
      if (task) {
        task.style.left = `${pageX - shiftX}px`;
        task.style.top = `${pageY - shiftY}px`;
      }
    };

    document.addEventListener('mousedown', (event: MouseEvent) => {
      const eventTarget = event.target as HTMLElement;
      task = eventTarget.closest('.task') as HTMLElement;

      if (task) {
        shiftX = event.clientX - task!.getBoundingClientRect().left;
        shiftY = event.clientY - task!.getBoundingClientRect().top;

        task.style.position = 'absolute';
        task.style.zIndex = '999999';
        const oldTaskHTML = '<div class="new-task" id="old-task"></div>';
        task.insertAdjacentHTML('beforebegin', oldTaskHTML);
        document.body.append(task);

        currentDroppable = task;
        moveTaskAt(event.pageX, event.pageY);
      }

      document.onmouseup = () => {
        const newTask = board.querySelector('#new-task');
        const oldTask = board.querySelector('#old-task');
        if (newTask) {
          task!.style.position = 'static';
          newTask.replaceWith(task!);
          this.saveResults(task!);
          task!.style.zIndex = '';
          document.onmouseup = null;
          task = null;
        }
        if (oldTask) {
          task!.style.position = 'static';
          oldTask.replaceWith(task!);
          this.saveResults(task!);
          task!.style.zIndex = '';
          document.onmouseup = null;
          task = null;
        }
      };
    });

    const onMouseMove = (event: MouseEvent) => {
      if (!task) return;
      const taskCoord = task!.getBoundingClientRect();
      const taskCenterY = taskCoord.y + taskCoord.height / 2;

      moveTaskAt(event.pageX, event.pageY);

      if (task) {
        task.style.display = 'none';
        const elemBelow = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;
        task.style.display = 'block';
        if (!elemBelow) return;

        const droppableBelow = elemBelow.closest('.task')! as HTMLElement;
        if (droppableBelow) {
          const newTask = board.querySelector('#new-task');
          const oldTask = board.querySelector('#old-task');
          newTask?.remove();
          if (oldTask) oldTask?.remove();
          const newTaskHTML = '<div class="new-task" id="new-task"></div>';
          const belowTaskCoord = currentDroppable!.getBoundingClientRect();
          const centerY = belowTaskCoord.y + belowTaskCoord.height / 2;
          if (centerY < taskCenterY) droppableBelow?.insertAdjacentHTML('beforebegin', newTaskHTML);
          if (centerY > taskCenterY) droppableBelow?.insertAdjacentHTML('afterend', newTaskHTML);
        } else {
          const emptyStatus = elemBelow.closest('.status')! as HTMLElement;
          if (!emptyStatus) return;
          const isStatusNotEmpty = !!emptyStatus.querySelector('.task');
          if (isStatusNotEmpty) return;
          if (!isStatusNotEmpty) {
            const newTask = board.querySelector('#new-task');
            if (newTask) newTask?.remove();
            const newTaskHTML = '<div class="new-task" id="new-task"></div>';
            if (emptyStatus) {
              emptyStatus!.querySelector('.status__task-list')!.innerHTML = newTaskHTML;
              const oldTask = board.querySelector('#old-task');
              if (oldTask) oldTask?.remove();
            }
          }
        }
      }
    };
    document.addEventListener('mousemove', onMouseMove);
  }

  private async saveResults(movedTask: HTMLElement) {
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
      console.log('newTasksPromises[i].data?.order', updatedTasks[i].data?.order);
    }
  }
}

customElements.define('app-board', AppBoard);
