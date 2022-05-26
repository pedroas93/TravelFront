import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit';
import * as apiClient from '../services/apiClient';
import CryptoJS from "react-native-crypto-js";

export type User = {
  first_name: string,
  last_name: string,
  avatar: string,
  email: string,
  password: string,
  id: number
};

export type UserDataPersistState = {
  users: User[];
  token: string;
  loading: boolean;
  error: boolean;
  email: string;
  nextPage: number;
  first_name: String;
  last_name: string;
};

const initialState: UserDataPersistState = {
  users: [],
  loading: false,
  error: false,
  token: '',
  email: '',
  nextPage: 1,
  first_name: '',
  last_name: '',
};

export const logOut = createAction('logOut')


export const fetchUsersList = createAsyncThunk<{ users: User[] }, { page: number }>(
  'fetchUsersList',
  async ({ page }) => {
    const response = await apiClient.fetchUsersList(page);
    if (response.kind === 'success') {
      return {
        users: response.body ?? [],
      };
    } else {
      throw 'Error fetching users';
    }
  },
);

export const fetchUserLogin = createAsyncThunk<{ token: string, emailCrypto: string }, { email: string, password: string }>(
  'fetchUsersLogin',
  async ({ email, password }) => {
    const response = await apiClient.fetchUserLogin(email, password);
    if (response.kind === 'success') {
      const newEmail = email;
      const ciphertext = CryptoJS.AES.encrypt(newEmail, response.token).toString();
      return {
        token: response.token ?? "",
        emailCrypto: ciphertext ?? ""
      };
    } else {
      throw 'Error fetching users';
    }
  },
);

export const fetchUserSingup = createAsyncThunk<{ token: string, emailCrypto: string },
  { email: string, password: string }>(
    'fetchUsersRegister',
    async ({ email, password }) => {
      const response = await apiClient.fetchUserSingup(email, password);
      if (response.kind === 'success') {
        const newEmail = email;
        const ciphertext = CryptoJS.AES.encrypt(newEmail, response.token).toString();
        return {
          token: response.token ?? "",
          emailCrypto: ciphertext ?? ""
        };
      } else {
        throw 'Error fetching users';
      }
    },
  );

const userSlice = createSlice({
  name: 'userDataPersist',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserLogin.fulfilled, (state, action) => {
        state.email = action.payload.emailCrypto;
        state.token = action.payload.token;
        state.loading = false;
        state.error = false;
      })
      .addCase(fetchUserLogin.rejected, (state) => {
        state.error = true;
        state.loading = false;
      })
      .addCase(fetchUserSingup.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserSingup.fulfilled, (state, action) => {
        state.email = action.payload.emailCrypto;
        state.token = action.payload.token;
        state.loading = false;
        state.error = false;
      })
      .addCase(fetchUserSingup.rejected, (state) => {
        state.error = true;
        state.loading = false;
      })
      .addCase(fetchUsersList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsersList.fulfilled, (state, action) => {
        state.nextPage += 1;
        state.users = state.users.concat(action.payload.users);
        state.loading = false;
      })
      .addCase(logOut, (state, action) => {
        state.users= [];
        state.loading= false;
        state.error= false;
        state.token= '';
        state.email= '';
        state.nextPage= 1;
        state.first_name= '';
        state.last_name= '';
      })
      .addCase(fetchUsersList.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });

  },
});

export default userSlice.reducer;