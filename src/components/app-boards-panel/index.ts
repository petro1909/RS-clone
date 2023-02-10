import api from '../../api';
import state from '../../store/state';
import { IBoard } from '../../types';
import createElement from '../../utils/createElement';
// import apiHandler from '../../services/apiHandler';
import boardsMenutemplate from './boards-menu-template.html';
import boardMenuTemplate from './board-menu-template.html';

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
      console.log('LOADED!!!!!!!!!!!!!', this.boardsData);
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
    const addBoardWrapper = createElement('div', this.boardsMenu, {
      class: '',
    }) as HTMLDivElement;
    const addBoardButton = createElement('button', addBoardWrapper, {
      class: 'board-menu__btn menu-btn',
    }, 'Add board +') as HTMLButtonElement;
    const addBoardInput = createElement('input', addBoardWrapper, {
      class: 'board-menu__btn menu-btn',
      type: 'text',
    }) as HTMLInputElement;
    addBoardInput.style.display = 'none';
    addBoardButton.onclick = () => {
      addBoardButton.style.display = 'none';
      addBoardInput.style.display = 'block';
    };

    addBoardInput.onblur = () => {
      if (addBoardInput.value.trim()) {
        const newBoardName = addBoardInput.value.trim();
        addBoardInput.disabled = true;
        addBoardInput.value = 'Saving...';
        this.addNewBoard(newBoardName);
      } else {
        addBoardButton.style.display = 'block';
        addBoardInput.style.display = 'none';
      }
    };
  }

  private getMinBoardId(boardsData: IBoard[]) {
    const boardsIds = boardsData.map((board) => board.id);

    return Math.min(...boardsIds);
  }

  private async getBoardsData(): Promise<IBoard[] | undefined> {
    if (!state.user?.id) return undefined;
    const id = state.user?.id;
    const boardsData = await api.boards.getUserBoards(id);
    if (!boardsData.data) return undefined;
    return boardsData.data;
  }

  private showAddBoardForm(parentElement: HTMLElement): void {
    const boardNameInput = createElement('input', parentElement, {
      class: 'input-text',
      type: 'text',
    }) as HTMLInputElement;
    const boardCreateButton = createElement('button', parentElement, {
      class: 'add-board-button',
    }, 'create board') as HTMLButtonElement;

    boardCreateButton.onclick = () => {
      this.addNewBoard(boardNameInput.value);
    };
  }

  // private showRenameBoardForm(parentElement: HTMLElement, board: IBoard): void {
  //   const wrapper = parentElement;
  //   const boardNameInput = createElement('input', wrapper, {
  //     class: 'rename-board-input',
  //     type: 'text',
  //     value: board.name,
  //   }) as HTMLInputElement;
  //   const submitButton = createElement('button', wrapper, {
  //     class: 'rename-board-button',
  //     type: 'text',
  //   }, 'rename board') as HTMLButtonElement;

  //   submitButton.onclick = () => {
  //     this.updateBoard({ id: board.id, name: boardNameInput.value });
  //   };

  //   const clickHandler = (e: Event) => {
  //     // const targetList = e.composedPath()[0] as HTMLElement;
  //     if (!e.composedPath().includes(wrapper)) {
  //       wrapper.innerHTML = `<h2>${board.name}</h2>`;
  //     }
  //   };
  //   document.addEventListener('click', clickHandler);
  // }

  private async updateBoard(board: IBoard): Promise<void> {
    const result = await api.boards.update(board);
    if (result.success) {
      // TODO: replace render only board ???
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
    if (!board) return;
    const wrapper = parent;
    wrapper.innerHTML = `
        <div class="board-page__header board-header" id="board-page__header">
        <input class="board-header__title input-text" id="board-header__title" type="" value="${board.name}">
        <div class="board-header__menu">
          <ul class="board-users" id="board-users">
            <li class="board-users__user"></li>
            <li class="board-users__user"></li>
            <li class="board-users__user"></li>
          </ul>
          <button class="board-header__menu-btn menu-btn" id="board-menu-button">≡</button>
        </div>
      </div>
      <app-board><app-board> 
     `;
    const menuWrapper = createElement('div', wrapper, {
      class: 'board-menu board-menu_board',
    }) as HTMLDivElement;
    menuWrapper.insertAdjacentHTML('afterbegin', boardMenuTemplate);
    const nameInput = wrapper.querySelector('#board-header__title') as HTMLInputElement;
    const deleteBoardButton = wrapper.querySelector('#board-menu-list__item-delete') as HTMLButtonElement;
    const boardMenuBtn = wrapper.querySelector('#board-menu-button') as HTMLButtonElement;
    const closeMenuBtn = wrapper.querySelector('#board-menu-close-btn') as HTMLButtonElement;
    const addStatusBoardWrapper = wrapper.querySelector('#board-menu-list__item-add-status') as HTMLLIElement;
    this.renderAddStatusButton(addStatusBoardWrapper);

    nameInput.onblur = () => {
      const boardName = nameInput.value;
      if (boardName.trim() && boardName !== board.name) {
        this.updateBoard({ id: board.id, name: boardName.trim() });
      } else {
        nameInput.value = board.name;
      }
    };

    // (boardNameWrapper.children[0] as HTMLElement).onclick = () => {
    //   boardNameWrapper.innerHTML = '';
    //   this.showRenameBoardForm(boardNameWrapper, board);
    // };
    boardMenuBtn.onclick = () => {
      menuWrapper.classList.add('board-menu--visible');
    };
    closeMenuBtn.onclick = () => {
      menuWrapper.classList.remove('board-menu--visible');
    };
    deleteBoardButton.onclick = () => {
      this.removeBoard();
    };
  }

  private renderAddStatusButton(parent: HTMLLIElement) {
    // const addBoardWrapper = createElement('div', this.boardsMenu, {
    //   class: '',
    // }) as HTMLDivElement;
    const addBStatusButton = createElement('button', parent, {
      class: 'board-menu__btn menu-btn',
    }, 'Add status +') as HTMLButtonElement;
    const addStatusInput = createElement('input', parent, {
      class: 'board-menu__btn menu-btn',
      type: 'text',
    }) as HTMLInputElement;
    addStatusInput.style.display = 'none';
    addBStatusButton.onclick = () => {
      addBStatusButton.style.display = 'none';
      addStatusInput.style.display = 'block';
    };

    addStatusInput.onblur = () => {
      if (addStatusInput.value.trim()) {
        const newStatusName = addStatusInput.value.trim();
        addStatusInput.disabled = true;
        addStatusInput.value = 'Saving...';
        this.addStatus(newStatusName);
      } else {
        addBStatusButton.style.display = 'block';
        addStatusInput.style.display = 'none';
      }
    };
  }

  private async addStatus(newStatusName: string) {
    const result = await api.statuses.create(state.activeBoardId, newStatusName);
    if (result.success) {
      this.renderBoardsMenu();
    }
  }

  private async removeBoard(): Promise<void> {
    await api.boards.delete(state.activeBoardId);
    state.activeBoardId = 0;
    this.renderBoardsMenu();
  }
}

customElements.define('boards-panel', AppBoardsPanel);
