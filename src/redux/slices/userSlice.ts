import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  id: string;
  invitationCode: string;
  nickname: string;
}

const initialState: UserState = {
  id: "",
  invitationCode: "",
  nickname: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, { payload }) => {
      state.id = payload;
    },
    setNickname: (state, { payload }) => {
      state.nickname = payload;
    },
    enterRoomByInvitationCode: (state, { payload }) => {
      state.invitationCode = payload;
    },
  },
});

export const { setUserId, enterRoomByInvitationCode, setNickname } =
  userSlice.actions;

export const selectId = (state: { user: UserState }) => state.user.id;
export const selectUser = (state: { user: UserState }) => state.user;
export default userSlice.reducer;
