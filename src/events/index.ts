import { ISnackMessage } from '../types';

const showMessageEvent = (messageData: ISnackMessage) => new CustomEvent('show-message', { bubbles: true, composed: true, detail: messageData });

const showBoardsMenu = new Event('show-boards-menu');

const closeItemMenu = new Event('close-menu');

const fileUploadedEvent = (url: string) => new CustomEvent('file-uploaded', { bubbles: true, composed: true, detail: url });

const taskUpdateEvent = new Event('task-update');

const appEvent = {
  showMessage: showMessageEvent,
  showBoardsMenu,
  closeItemMenu,
  fileUploadedEvent,
  taskUpdateEvent,
};

export default appEvent;
