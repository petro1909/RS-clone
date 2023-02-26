import api from '../../api';
import state from '../../store/state';
import { IActiveBoardUser, IBoard } from '../../types';
import createElement from '../../utils/createElement';
import apiService from '../../services/apiHandler';
import boardsMenutemplate from './boards-menu-template.html';
import boardMenuTemplate from './board-menu-template.html';
import createInputButton from '../createInputButton';

class AppBoardsPanel extends HTMLElement {
  private boardsData: IBoard[];

  private isMenuOpen: boolean;

  private boardsMenu: HTMLDivElement;

  private boardWrapper: HTMLDivElement;

  constructor() {
    super();
    this.boardsData = [];
    this.isMenuOpen = false;
    this.boardsMenu = createElement('div', this, {
      class: 'board-menu board-menu_boards',
    }) as HTMLDivElement;
    this.boardWrapper = createElement('div', this, {
      class: 'board-wrapper',
    }) as HTMLDivElement;
  }

  connectedCallback() {
    this.renderBoardsMenu();
  }

  private async renderBoardsMenu(): Promise<void> {
    this.boardsData = await this.getBoardsData() as IBoard[];

    if (!this.boardsData) return;
    if (!state.activeBoardId) {
      state.activeBoardId = this.getMinBoardId(this.boardsData);
    }

    if (state.user) {
      this.boardsMenu.innerHTML = boardsMenutemplate;
      if (this.isMenuOpen) this.boardsMenu.classList.add('board-menu--visible');
      const boardCloseBtn = this.boardsMenu.querySelector('#board-menu-close-btn') as HTMLButtonElement;
      const boardElemsWrapper = this.boardsMenu.querySelector('#board-menu-list-btns') as HTMLUListElement;

      boardCloseBtn.onclick = () => {
        this.boardsMenu.classList.remove('board-menu--visible');
        this.isMenuOpen = false;
      };

      this.boardsData.forEach((board) => {
        if (!board) return;
        const boardItem = createElement('li', boardElemsWrapper, {
          class: 'board-menu-list__item',
        }) as HTMLLIElement;
        const boardButton = createElement('button', boardItem, {
          class: 'board-menu__btn menu-btn',
        }, board.name) as HTMLButtonElement;

        boardButton.onclick = () => {
          state.activeBoardId = board.id;
          this.renderBoard(this.boardWrapper, board);
        };
      });
      // console.log('LOADED!!!!!!!!!!!!!', this.boardsData, state.activeBoardId);
      const currentBoard = this.boardsData.find((board) => board?.id === state.activeBoardId);

      this.renderBoard(this.boardWrapper, currentBoard);
      this.renderAddBoardButton();

      window.addEventListener('show-boards-menu', () => {
        this.boardsMenu.classList.add('board-menu--visible');
        this.isMenuOpen = true;
      });
    }
  }

  private renderAddBoardButton() {
    createInputButton(this.boardsMenu, this.addNewBoard.bind(this), {
      buttonName: 'Add board <span>✚</span>',
      buttonClassName: 'board-menu__btn menu-btn',
      inputClassName: 'board-menu__btn menu-btn input-text',
    });
  }

  private getMinBoardId(boardsData: IBoard[]) {
    const boardsIds = boardsData.map((board) => board.id);

    return boardsIds[0];
  }

  private async getBoardsData(): Promise<IBoard[] | undefined> {
    if (!state.user?.id) return undefined;
    const id = state.user?.id;
    const boardsData = await api.boards.getUserBoards(id);
    if (!boardsData.data) return undefined;
    return boardsData.data;
  }

  private async updateBoard(board: IBoard): Promise<void> {
    const result = await api.boards.update(board);

    if (result.success) {
      this.renderBoardsMenu();
    }
  }

  private async addNewBoard(boardName: string): Promise<void> {
    if (!state.user?.id) return;
    const id = state.user?.id;
    const result = await api.boards.createUserBoard(id, boardName);
    if (result.success) {
      const newUserBoard = result.data as IBoard;
      state.activeBoardId = newUserBoard.id;
      this.renderBoardsMenu();
    }
  }

  private async renderBoard(parent: HTMLDivElement, board: IBoard | undefined): Promise<void> {
    const wrapper = parent;
    if (!board) {
      wrapper.innerHTML = `
        <div class="board-page__header board-header" id="board-page__header">
          <h3 class="no-projects-message">You don't have any projects yet</h3>
        </div>`;
      return;
    }
    wrapper.innerHTML = `
        <div class="board-page__header board-header" id="board-page__header">
        <input class="board-header__title input-text" id="board-header__title" type="" value="${board.name}">
        <div class="board-header__menu">
          <div id="select-user"></div>
          <button class="btn" id="add-select-user">+User</button>
          <ul class="board-users" id="board-users">
          </ul>
          <button class="board-header__menu-btn menu-btn" id="board-menu-button">≡</button>
        </div>
      </div>
      <app-board><app-board>`;
    const menuWrapper = createElement('div', wrapper, {
      class: 'board-menu board-menu_board',
    }) as HTMLDivElement;
    menuWrapper.insertAdjacentHTML('afterbegin', boardMenuTemplate);
    const nameInput = wrapper.querySelector('#board-header__title') as HTMLInputElement;
    const deleteBoardButton = wrapper.querySelector('#board-menu-list__item-delete') as HTMLButtonElement;
    const leaveBoardButton = wrapper.querySelector('#board-menu-list__item-leave') as HTMLButtonElement;
    const boardMenuBtn = wrapper.querySelector('#board-menu-button') as HTMLButtonElement;
    const closeMenuBtn = wrapper.querySelector('#board-menu-close-btn') as HTMLButtonElement;
    const addStatusBoardWrapper = wrapper.querySelector('#board-menu-list__item-add-status') as HTMLLIElement;
    const boardUsersWrapper = wrapper.querySelector('#board-users') as HTMLUListElement;
    const addSelectUser = wrapper.querySelector('#add-select-user') as HTMLButtonElement;
    const selectUser = wrapper.querySelector('#select-user') as HTMLSelectElement;
    this.renderAddStatusButton(addStatusBoardWrapper);
    await this.renderBoardUsers(boardUsersWrapper);
    nameInput.onblur = () => {
      const boardName = nameInput.value;
      if (boardName.trim() && boardName !== board.name) {
        this.updateBoard({ id: board.id, name: boardName.trim() });
      } else {
        nameInput.value = board.name;
      }
    };

    addSelectUser.onclick = () => {
      selectUser.innerHTML = `
        <app-modal>
          <userboard-select id="${board.id}"></userboard-select>
        </app-modal>
      `;
      const userSelector = selectUser.querySelector('userboard-select') as HTMLInputElement;
      userSelector.addEventListener('update', () => {
        boardUsersWrapper.innerHTML = '';
        this.renderBoardUsers(boardUsersWrapper);
      });
    };
    boardMenuBtn.onclick = () => {
      menuWrapper.classList.add('board-menu--visible');
    };
    closeMenuBtn.onclick = () => {
      menuWrapper.classList.remove('board-menu--visible');
    };
    deleteBoardButton.onclick = () => {
      this.removeBoard();
    };
    leaveBoardButton.onclick = () => {
      this.leaveBoard();
    };
  }

  private async renderBoardUsers(wrapper: HTMLUListElement) {
    const usersData = await apiService.getBoardUsers(state.activeBoardId) as IActiveBoardUser[];
    state.activeBoardUsers = usersData;
    usersData.forEach((user) => {
      const userElement = createElement('li', wrapper, {
        class: 'board-users__user',
        id: `${user?.user.id}`,
      }, `
        <div class="board-users__user-details">
          <p>${user?.user.name || 'NoName'}</>
          <p>${user?.user.email}</>
        </div>
      `) as HTMLLIElement;
      if (user.user.profilePicture) {
        userElement.style.backgroundImage = `url(${user.user.profilePicture})`;
      }
    });
  }

  private renderAddStatusButton(parent: HTMLLIElement) {
    createInputButton(parent, this.addStatus.bind(this), {
      buttonName: 'Add status <span>✚</span>',
      buttonClassName: 'board-menu__btn menu-btn',
      inputClassName: 'board-menu__btn menu-btn input-text',
    });
  }

  private async addStatus(newStatusName: string) {
    const result = await apiService.addStatus(state.activeBoardId, newStatusName);
    if (result.success) {
      this.renderBoardsMenu();
    }
  }

  private async removeBoard(): Promise<void> {
    await api.boards.delete(state.activeBoardId);
    state.activeBoardId = '';
    this.renderBoardsMenu();
  }

  private async leaveBoard() {
    const userId = state.user?.id;
    const [boardUser] = state.activeBoardUsers.filter((user) => user.user.id === userId);
    await api.boardUsers.remove(boardUser.id);
    state.activeBoardId = '';
    this.renderBoardsMenu();
  }
}

customElements.define('boards-panel', AppBoardsPanel);
