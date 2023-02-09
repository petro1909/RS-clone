import { ISnackMessage } from '../types';

const showMessageEvent = (messageData: ISnackMessage) => new CustomEvent('show-message', { bubbles: true, composed: true, detail: messageData });

const showBoardsMenu = new Event('show-boards-menu');

const appEvent = {
  showMessage: showMessageEvent,
  showBoardsMenu,
};

export default appEvent;