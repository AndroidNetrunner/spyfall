import { createSlice } from "@reduxjs/toolkit";
import { InvitationCode } from "@/types/InvitationCode";
import Players from "@/types/Players";

export interface RoomState {
    players: Players
    invitationCode: InvitationCode | null;
}

const initialState: RoomState = {
    players: {},
    invitationCode: null
}

export const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        setPlayers: (state, { payload } : { payload: Players}) => {
            state.players = payload
        },
        setInvitationCode: (state, { payload }: { payload: InvitationCode | null }) => {
            state.invitationCode = payload
        }
    }
})

export const { setPlayers, setInvitationCode } = roomSlice.actions;

export const selectPlayers = (state: { room: RoomState}) => state.room.players;
export const selectInvitationCode = (state: { room: RoomState}) => state.room.invitationCode;

export default roomSlice.reducer;