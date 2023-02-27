import createElement from '../../utils/createElement';
import { ISnackMessage } from '../../types';
import './index.scss';

class AppSnackbar extends HTMLElement {
  connectedCallback() {
    this.setAttribute('class', 'snack-bar');
    this.addListeners();
  }

  private createMessage(messageData: ISnackMessage) {
    const {
      type, statusCode, text, details,
    } = messageData;

    const wrapper = createElement('div', this, {
      class: `message message_${type}`,
    }, this.getMessageTemplate(text, statusCode.toString(), details));
    wrapper.classList.add('message_active');
    setTimeout(() => {
      wrapper.classList.remove('message_active');
      wrapper.addEventListener('transitionend', () => {
        wrapper.remove();
      });
    }, 5000);
  }

  private getMessageTemplate(text: string, statusCode: string, details: string): string {
    return `
    <p class="message__text">${text}</p>
    <p class="message__details"><span class="message__code">Error code: ${statusCode}.</span> ${details}</p>
    `;
  }

  addListeners() {
    window.addEventListener('show-message', (e) => {
      const ev = e as CustomEvent;
      const messageData: ISnackMessage = ev.detail;
      this.createMessage(messageData);
    });
  }
}

customElements.define('snack-bar', AppSnackbar);
