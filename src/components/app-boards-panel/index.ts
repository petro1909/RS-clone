import api from '../../api';
import state from '../../store/state';
import { IBoard, IUserBoard } from '../../types';
import createElement from '../../utils/createElement';
import apiHandler from '../../services/apiHandler';

class AppBoardsPanel extends HTMLElement {
  private boardsData: IBoard[];

  constructor() {
    super();
    this.boardsData = [];
  }

  connectedCallback() {
    this.renderBoardsMenu();
  }

  private async renderBoardsMenu(): Promise<void> {
    this.innerHTML = 'No boards found';
    this.boardsData = await this.getBoardsData() as IBoard[];

    if (!this.boardsData) return;
    if (!state.activeBoardId) {
      state.activeBoardId = this.getMinBoardId(this.boardsData);
    }

    if (state.user) {
      this.innerHTML = '';
      const boardsMenu = createElement('div', this, {
        class: 'boards__menu',
      }) as HTMLDivElement;
      const boardWrapper = createElement('div', this, {
        class: 'board',
      }) as HTMLDivElement;

      this.boardsData.forEach((board) => {
        if (!board) return;
        const boardButton = createElement('button', boardsMenu, {
          class: 'boards__button',
        }, board.name) as HTMLButtonElement;
        boardButton.onclick = () => {
          state.activeBoardId = board.id;
          this.renderBoard(boardWrapper, board);
        };
      });

      const currentBoard = this.boardsData.find((board) => board?.id === state.activeBoardId);

      this.renderBoard(boardWrapper, currentBoard);

      const addBoardButton = createElement('button', boardsMenu, {
        class: 'add-board-button',
      }, 'add board') as HTMLButtonElement;
      addBoardButton.onclick = () => {
        this.showAddBoardForm(boardsMenu);
        addBoardButton.remove();
      };
    }
  }

  private getMinBoardId(boardsData: IBoard[]) {
    const boardsIds = boardsData.map((board) => board.id);

    return Math.min(...boardsIds);
  }

  private async getBoardsData(): Promise<(IBoard | undefined)[] | undefined> {
    const boardsData = await apiHandler.getUserBoards();

    return boardsData.data;
  }

  private showAddBoardForm(parentElement: HTMLElement): void {
    const boardNameInput = createElement('input', parentElement, {
      class: 'add-board-input',
      type: 'text',
    }) as HTMLInputElement;
    const boardCreateButton = createElement('button', parentElement, {
      class: 'add-board-button',
      type: 'text',
    }, 'create board') as HTMLButtonElement;

    boardCreateButton.onclick = () => {
      this.addNewBoard(boardNameInput.value);
    };
  }

  private showRenameBoardForm(parentElement: HTMLElement, board: IBoard): void {
    const wrapper = parentElement;
    const boardNameInput = createElement('input', wrapper, {
      class: 'rename-board-input',
      type: 'text',
      value: board.name,
    }) as HTMLInputElement;
    const submitButton = createElement('button', wrapper, {
      class: 'rename-board-button',
      type: 'text',
    }, 'rename board') as HTMLButtonElement;

    submitButton.onclick = () => {
      this.updateBoard({ id: board.id, name: boardNameInput.value });
    };

    const clickHandler = (e: Event) => {
      // const targetList = e.composedPath()[0] as HTMLElement;
      if (!e.composedPath().includes(wrapper)) {
        wrapper.innerHTML = `<h2>${board.name}</h2>`;
      }
    };
    document.addEventListener('click', clickHandler);
  }

  private async updateBoard(board: IBoard): Promise<void> {
    const result = await api.boards.update(board);
    if (result.success) {
      // TODO: replace render only board
      this.renderBoardsMenu();
    }
  }

  private async addNewBoard(boardName: string): Promise<void> {
    const result = await apiHandler.createBoard(boardName);
    if (result.success) {
      const newUserBoard = result.data as IUserBoard;
      state.activeBoardId = newUserBoard.boardId;
      this.renderBoardsMenu();
    }
  }

  private async renderBoard(parent: HTMLDivElement, board: IBoard | undefined): Promise<void> {
    if (!board) return;
    const wrapper = parent;
    wrapper.innerHTML = `
      <div id="board-name" class="board__name-wrapper"><h2>${board.name}</h2></div>
      <button id="remove-board">Remove this board</button>
      <app-board><app-board> 
     `;

    const boardNameWrapper = wrapper.querySelector('#board-name') as HTMLButtonElement;
    const deleteBoardButton = wrapper.querySelector('#remove-board') as HTMLButtonElement;
    (boardNameWrapper.children[0] as HTMLElement).onclick = () => {
      boardNameWrapper.innerHTML = '';
      this.showRenameBoardForm(boardNameWrapper, board);
    };
    deleteBoardButton.onclick = () => {
      this.removeBoard();
    };
  }

  private async removeBoard(): Promise<void> {
    await api.boards.delete(state.activeBoardId);
    state.activeBoardId = 0;
    this.renderBoardsMenu();
  }
}

customElements.define('boards-panel', AppBoardsPanel);
