import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetUsersParams } from '@/types/requestParams';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  organizations?: { name: string; active: boolean }[];
};

export interface UserState {
  loading: boolean;
  error: null | string;
  userCreated: boolean;
  users?: User[];
}

const initialState: UserState = {
  loading: false,
  error: null,
  users: [],
  userCreated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUsers(state, action: PayloadAction<GetUsersParams>) {
      state.loading = true;
    },
    getUsersSuccess(state, action: PayloadAction<User[]>) {
      state.loading = false;
      state.error = null;
      state.users = action.payload;
    },
    getUsersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createUserSuccess(state) {
      state.userCreated = true;
      state.error = null;
    },
    createUserFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    resetState() {
      return initialState;
    },
  },
});

// createUser action used in userSaga.ts
export const createUser = (payload: User) => ({
  type: 'user/createUser',
  payload,
});
export default userSlice.reducer;
export const {
  getUsers,
  getUsersSuccess,
  getUsersFailure,
  createUserSuccess,
  createUserFailure,
  resetState,
} = userSlice.actions;
