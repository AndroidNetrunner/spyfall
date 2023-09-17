import { createSlice } from '@reduxjs/toolkit';
import { InvitationCode } from '@/types/InvitationCode';
import Players from '@/types/Players';

export interface RoomState {
  players: Players;
  invitationCode?: InvitationCode | null;
  isGameMaster: boolean;
}

const initialState: RoomState = {
  players: {},
  invitationCode: null,
  isGameMaster: false,
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setPlayers: (state, { payload }: { payload: Players }) => {
      state.players = payload;
    },
    setInvitationCode: (state, { payload }: { payload: InvitationCode | null }) => {
      state.invitationCode = payload;
    },
    setIsGameMaster: (state, { payload }: { payload: boolean }) => {
      state.isGameMaster = payload;
    },
  },
});

export const { setPlayers, setInvitationCode, setIsGameMaster } = roomSlice.actions;

export const selectPlayers = (state: { room: RoomState }) => state.room.players;
export const selectInvitationCode = (state: { room: RoomState }) => state.room.invitationCode;
export const selectIsGameMaster = (state: { room: RoomState }) => state.room.isGameMaster;
export default roomSlice.reducer;
