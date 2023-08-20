import { InvitationCode } from "@/types/InvitationCode";
import { UserId } from "@/types/UserId";
import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  id: UserId | null;
  invitationCode: InvitationCode | null;
  nickname: string;
}

const initialState: UserState = {
  id: null,
  invitationCode: null,
  nickname: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, { payload }: {payload: UserId | null}) => {
      state.id = payload;
    },
    setNickname: (state, { payload }: {payload: string}) => {
      state.nickname = payload;
    },
    enterRoomByInvitationCode: (state, { payload }: {payload: InvitationCode | null}) => {
      state.invitationCode = payload;
    },
  },
});

export const { setUserId, enterRoomByInvitationCode, setNickname } =
  userSlice.actions;

export const selectId = (state: { user: UserState }) => state.user.id;
export const selectUser = (state: { user: UserState }) => state.user;
export default userSlice.reducer;
