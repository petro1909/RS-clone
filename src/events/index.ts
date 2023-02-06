import { ISnackMessage } from '../types';

const showMessageEvent = (messageData: ISnackMessage) => new CustomEvent('show-message', { bubbles: true, composed: true, detail: messageData });

const appEvent = {
  showMessage: showMessageEvent,
};

export default appEvent;
