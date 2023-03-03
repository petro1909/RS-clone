import createElement from '../../utils/createElement';
import { isLight } from '../../utils/colorHelpers';
import state from '../../store/state';
import api from '../../api';

class InputMark extends HTMLElement {
  private color: string;

  private name: string;

  private prevMode: string;

  constructor() {
    super();
    this.color = '';
    this.name = '';
    this.prevMode = '';
  }

  connectedCallback() {
    this.classList.add('input-mark');
    if (this.getAttribute('mode') === 'show') {
      this.setValues();
      this.renderShowMode();
    } else if (this.getAttribute('mode') === 'add') {
      this.renderAddMode();
    }
  }

  setShowMode() {
    const mainButton = this.querySelector('.input-mark__main-btn') as HTMLButtonElement;
    const nameInput = this.querySelector('.input-mark__name-input') as HTMLInputElement;
    const colorInput = this.querySelector('.input-mark__color-input') as HTMLInputElement;
    const inputsWrapper = this.querySelector('.input-mark__inputs-wrapper') as HTMLInputElement;
    mainButton.style.display = 'none';
    inputsWrapper.style.display = 'flex';
    nameInput.value = this.getAttribute('name') || '';
    nameInput.disabled = true;
    colorInput.value = this.getAttribute('color') || '';
  }

  setValues() {
    this.name = this.getAttribute('name') || '';
    this.color = this.getAttribute('color') || '';
  }

  renderAddMode() {
    this.innerHTML = '';
    const mainButton = createElement('button', this, {
      class: 'input-mark__main-btn',
    }, 'Add mark ✚') as HTMLButtonElement;
    mainButton.onclick = () => {
      this.prevMode = 'add';
      this.renderEditMode();
    };
  }

  renderShowMode() {
    this.innerHTML = '';
    const nameInput = createElement('input', this, {
      class: 'input-mark__name-input',
      type: 'text',
      disabled: 'true',
      value: this.name,
    }) as HTMLInputElement;
    const editButton = createElement('button', this, {
      class: 'input-mark__edit_btn',
    }, '🖋') as HTMLButtonElement;
    const removeButton = createElement('button', this, {
      class: 'input-mark__delete_btn',
    }, '❌') as HTMLButtonElement;

    if (this.color) {
      nameInput.style.backgroundColor = this.color;
      nameInput.style.color = isLight(this.color) ? '#000' : '#fff';
    }
    editButton.onclick = (e) => {
      e.preventDefault();
      this.renderEditMode();
    };
    removeButton.onclick = (e) => {
      e.preventDefault();
      this.removeMark();
    };
  }

  renderEditMode() {
    this.innerHTML = '';
    const nameInput = createElement('input', this, {
      class: 'input-mark__name-input',
      type: 'text',
      value: this.name,
    }) as HTMLInputElement;
    const colorInput = createElement('input', this, {
      class: 'input-mark__color-input',
      type: 'color',
    }) as HTMLInputElement;
    const submitButton = createElement('button', this, {
      class: 'input-mark__submit_btn',
    }, '☑') as HTMLButtonElement;
    const removeButton = createElement('button', this, {
      class: 'input-mark__delete_btn',
    }, '❌') as HTMLButtonElement;

    if (this.color) {
      colorInput.value = this.color;
      nameInput.style.backgroundColor = this.color;
      nameInput.style.color = isLight(this.color) ? '#000' : '#fff';
    }

    colorInput.oninput = () => {
      nameInput.style.backgroundColor = colorInput.value;
      nameInput.style.color = isLight(colorInput.value) ? '#000' : '#fff';
    };

    submitButton.onclick = (e) => {
      e.preventDefault();
      this.sendMark(nameInput.value, colorInput.value);
      nameInput.value = 'Uploading';
    };

    removeButton.onclick = (e) => {
      e.preventDefault();
      if (this.prevMode === 'add') {
        this.renderAddMode();
      } else {
        this.renderShowMode();
      }
    };
  }

  private async sendMark(name: string, color: string) {
    if (this.getAttribute('id')) {
      const id = this.getAttribute('id') as string;
      const result = await api.boardMarks.update({
        id,
        name,
        color,
        boardId: state.activeBoardId,
      });
      if (result.success) {
        this.dispatchEvent(new Event('send'));
      }
    } else {
      const result = await api.boardMarks.create({
        name,
        color,
        boardId: state.activeBoardId,
      });
      if (result.success) {
        this.dispatchEvent(new Event('send'));
      }
    }
  }

  private async removeMark() {
    const id = this.getAttribute('id') as string;
    const result = await api.boardMarks.delete(id);
    if (result.success) {
      this.dispatchEvent(new Event('send'));
    }
  }
}

customElements.define('input-mark', InputMark);
