import api from '../api';
// import state from '../store/state';
import { IBoardUser, IUser } from '../types';

const getUserWithAvatarURL = async (userIncorrectAvatar: IUser) => {
  const user = { ...userIncorrectAvatar };
  if (user.profilePicture) {
    const avatarRes = await api.users.getAvatar(user.id);
    if (avatarRes.data) {
      user.profilePicture = avatarRes.data.url;
    }
  } else {
    user.profilePicture = '';
  }
  return user;
};

const getUsersWithAvatars = async (users: IUser[]) => {
  const usersWithAvatars = users.map((user) => getUserWithAvatarURL(user));
  const data = await Promise.all(usersWithAvatars);
  return data;
};

const getBoardUsers = async (boardId: string) => {
  const boardUsersData = await api.boardUsers.getBoardUsers(boardId);
  const boardUsers = boardUsersData.data as IBoardUser[];
  const users = boardUsers.map((boardUser) => api.users.getById(boardUser.userId));
  const usersData = (await Promise.all(users)).map((user) => user.data) as IUser[];
  const usersWithAvatars = await getUsersWithAvatars(usersData);

  return usersWithAvatars;
};

// const getUserBoards = async () => {
//   if (state.user) {
//     const userBoards = await api.userBoards.getByUser(state.user?.id);
//     console.log('userBoards', userBoards, state.user?.id);
//     const userBoardsData = userBoards.data as IUserBoard[];
//     const boards = userBoardsData.map((userBoard) => api.boards.getBoard(userBoard.boardId));
//     const data = (await Promise.all(boards)).map((board) => board.data);

//     return { success: true, data };
//   }
//   return { success: false };
// };

// const createBoard = async (boardName: string) => {
//   const newBoard = await api.boards.create(boardName);

//   if (newBoard.data?.id && state.user?.id) {
//     const boardUser = await api.userBoards.addUser(state.user?.id, newBoard.data?.id);
//     return boardUser;
//   }
//   return newBoard;
// };

// const deleteUserBoardsByBoard = async (boardId: number) => {
//   const userBoards = await api.userBoards.getByBoard(boardId);
//   const userBoardsData = userBoards.data as IUserBoard[];
//   const deletedBoard = userBoardsData.map((userBoard) => api.userBoards.delete(userBoard.id));
//   const results = (await Promise.all(deletedBoard)).map((board) => board.success);

//   if (results.every((result) => result)) return { success: true };
//   return { success: false };
// };

// const deleteStatusesByBoard = async (boardId: number) => {

// }

// const deleteBoard = async (boardId: number) => {
//   const resultDelBoard = await api.boards.delete(boardId);
//   const resultDelUserboards = await deleteUserBoardsByBoard(boardId);
//   // const resultDelStatuses = await api.statuses.deleteByBoard(boardId);
//   // console.log('RESULTSSS', resultDelStatuses);
//   if (resultDelBoard.success && resultDelUserboards) return { success: true };
//   return { success: false };
// };

const apiService = {
  getUserWithAvatarURL,
  getBoardUsers,
};

export default apiService;
