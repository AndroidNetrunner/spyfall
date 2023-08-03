import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "./userSlice";

export interface RoomState {
    players: UserState[];
    invitationCode: string;
}

const initialState: RoomState = {
    players: [],
    invitationCode: ""
}

export const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        setPlayers: (state, { payload }) => {
            state.players = payload
        },
        setInvitationCode: (state, { payload }) => {
            state.invitationCode = payload
        }
    }
})

export const { setPlayers, setInvitationCode } = roomSlice.actions;

export const selectPlayers = (state: { room: RoomState}) => state.room.players;
export const selectInvitationCode = (state: { room: RoomState}) => state.room.invitationCode;

export default roomSlice.reducer;