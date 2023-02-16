import api from '../../api';
import appEvent from '../../events';
import template from './template.html';

class ImageLoader extends HTMLElement {
  private uploadedUrl: string;

  constructor() {
    super();
    this.uploadedUrl = '';
    this.setAttribute('class', 'image-loader');
  }

  connectedCallback() {
    this.renderForm();
  }

  disconnectedCallback() {
    const ev = appEvent.fileUploadedEvent(this.uploadedUrl);
    window.dispatchEvent(ev);
  }

  private renderForm() {
    this.innerHTML += template;

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
      console.log(fileInput.files);
      this.fileInputHandler();
    });

    fileInput.oninput = () => {
      this.fileInputHandler();
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
      this.renderForm();
    }, 2000);
  }

  private async fileInputHandler() {
    const fileInput = this.querySelector('#fileElem') as HTMLInputElement;
    if (fileInput.files) {
      this.renderLoader();
      const url = await this.sendFile(fileInput.files[0]);
      if (url) {
        // this.setImage(url);
        this.uploadedUrl = url;
        this.renderSuccess();
      } else {
        this.renderFail();
      }
    }
  }

  // private setImage(url: string) {
  //   const imageWrapper = this.querySelector('#gallery') as HTMLDivElement;
  //   const image = new Image();
  //   image.src = url;
  //   image.onload = () => {
  //     console.log('IMAGE', image);
  //     imageWrapper.style.backgroundImage = `url(${image.src})`;
  //   };
  //   image.onerror = (error) => {
  //     console.log(error);
  //   };
  // }

  private async sendFile(file: File) {
    const formData = new FormData();
    formData.append('profile', file);
    const apiRes = await api.users.uploadAvatar('7d5a5159-6622-4b77-9f2d-3859e880e8a5', formData);
    if (apiRes.success) {
      const avatarRes = await api.users.getAvatar('7d5a5159-6622-4b77-9f2d-3859e880e8a5');
      if (avatarRes.data) {
        return avatarRes.data.url;
      }
    }
    return undefined;
  }
}

customElements.define('image-loader', ImageLoader);