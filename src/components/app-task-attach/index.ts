import api from '../../api';

class TaskAttach extends HTMLElement {
  connectedCallback() {
    this.classList.add('attach');
    this.innerHTML = `
      <div class="attach__header">
        <button class="attach__header-button" id="show-add-file">Add File</button>
        <button class="attach__header-button" id="show-add-link">Add Link</button>
      </div>
      <div class="attach__body"></div>
    `;
    const showFileSectionBtn = this.querySelector('#show-add-file') as HTMLButtonElement;
    const showLinkSectionBtn = this.querySelector('#show-add-link') as HTMLButtonElement;

    showFileSectionBtn.onclick = (e) => {
      e.preventDefault();
      this.renderAddFileSection();
    };

    showLinkSectionBtn.onclick = (e) => {
      e.preventDefault();
      this.renderAddLinkSection();
    };
    this.renderAddFileSection();
  }

  disconnectedCallback() {
    this.dispatchEvent(new Event('update'));
  }

  private renderAddFileSection() {
    const body = this.querySelector('.attach__body') as HTMLButtonElement;
    body.innerHTML = `
      <div class="image-loader__drop-area attach__drop-area" id="drop-area">
        <form class="image-loader__form" id="file-form">
          <p class="image-loader__text">Drop or select your file</p>
          <input class="image-loader__input-file" type="file" id="fileElem" multiple">
          <div class="image-loader__gallery" id="gallery"></div>
          <label class="image-loader__button attach__submit-button" for="fileElem">Select</label>
        </form>
      </div>
    `;
    const dropArea = this.querySelector('#drop-area') as HTMLDivElement;
    const fileInput = this.querySelector('#fileElem') as HTMLInputElement;

    function preventDefaults(e: Event) {
      e.preventDefault();
      e.stopPropagation();
    }

    function highlight() {
      dropArea.classList.add('image-loader__drop-area_active');
    }

    function unhighlight() {
      dropArea.classList.remove('image-loader__drop-area_active');
    }

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach((eventName) => {
      dropArea.addEventListener(eventName, highlight, false);
    });
    ['dragleave', 'drop'].forEach((eventName) => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });

    dropArea.addEventListener('drop', (e) => {
      const ev = e as DragEvent;
      fileInput.files = ev.dataTransfer?.files as FileList;
      this.fileInputHandler();
    });

    fileInput.oninput = () => {
      this.fileInputHandler();
    };
  }

  private renderAddLinkSection() {
    const body = this.querySelector('.attach__body') as HTMLButtonElement;
    body.innerHTML = `
      <div class="attach__link-area">
        <input class="attach__input-link" id="file-link"></input>
        <button class="image-loader__button attach__submit-button" id="send-file-link">send</button>
      </div>
    `;

    const linkInput = this.querySelector('#file-link') as HTMLInputElement;
    const sendLinkButton = this.querySelector('#send-file-link') as HTMLButtonElement;

    linkInput.onblur = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    sendLinkButton.onclick = (e) => {
      e.preventDefault();
      this.sendLink(linkInput.value);
    };
  }

  private renderLoader() {
    this.innerHTML = `
      <p class="image-loader__text">Upload...</p>
    `;
  }

  private renderSuccess() {
    this.innerHTML = `
      <p class="image-loader__text">Your file uploaded!</p>
    `;
    setTimeout(() => {
      this.remove();
    }, 2000);
  }

  private renderFail() {
    this.innerHTML = `
      <p class="image-loader__text">Fail! Try later</p>
    `;
    setTimeout(() => {
      this.remove();
    }, 2000);
  }

  private async fileInputHandler() {
    const fileInput = this.querySelector('#fileElem') as HTMLInputElement;
    if (fileInput.files) {
      this.renderLoader();
      const res = await this.sendFile(fileInput.files[0]);
      if (res) {
        this.renderSuccess();
      } else {
        this.renderFail();
      }
    }
  }

  private async sendFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', this.id);
    formData.append('type', 'FILE');
    const apiRes = await api.files.upload(formData);
    return apiRes.success;
  }

  private async sendLink(link: string) {
    const formData = new FormData();
    formData.append('name', link);
    formData.append('taskId', this.id);
    formData.append('type', 'LINK');
    const apiRes = await api.files.upload(formData);
    if (apiRes.success) {
      this.renderSuccess();
    } else {
      this.renderFail();
    }
  }
}

customElements.define('task-attach', TaskAttach);
