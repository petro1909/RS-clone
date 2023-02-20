import createElement from '../../utils/createElement';
import template from './template.html';
import menuTemplate from './menu-template.html';
import api from '../../api';

class AppTask extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  private render() {
    this.innerHTML = template;
    this.classList.add('task');
    const taskId = this.getAttribute('taskId') as string;
    this.setData();
    this.setMenu(taskId);
  }

  private setData() {
    const taskName = this.getAttribute('taskName') as string;
    const contentWrapper = this.querySelector('#task-content') as HTMLDivElement;
    contentWrapper.innerHTML = `${taskName}`;
  }

  private setMenu(taskId: string) {
    const menuBtn = this.querySelector('#task-menu-btn') as HTMLDivElement;
    const menuWrapper = createElement('task-menu', this, {
      class: 'task-menu element--invisible',
      taskId,
    }, `${menuTemplate}`);
    const editBtn = menuWrapper.querySelector('#edit-task') as HTMLButtonElement;
    const removeBtn = menuWrapper.querySelector('#remove-task') as HTMLButtonElement;
    menuBtn.onclick = () => {
      menuWrapper.classList.remove('element--invisible');

      editBtn.onclick = () => {
        menuWrapper.classList.add('element--invisible');
        createElement('task-form', document.body, {
          taskId,
        });
        document.body.classList.add('overflow-hidden');
        // nameInput.focus();
      };

      removeBtn.onclick = () => {
        this.deleteTask(taskId);
      };
    };

    document.body.addEventListener('click', (e) => {
      const ev = e as Event;
      const target = ev.target as HTMLElement;
      if (target !== menuBtn) {
        menuWrapper.classList.add('element--invisible');
      }
    });
    // this.deleteTask(taskId);
  }

  private async deleteTask(taskId: string) {
    console.log('TASKID', taskId);
    const result = await api.tasks.delete(taskId);
    if (result.success) {
      this.remove();
    }
  }
}

customElements.define('app-task', AppTask);
