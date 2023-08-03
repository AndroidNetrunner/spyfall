import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "./userSlice";

export interface GameState {
    invitationCode: string;
    players: UserState[];
    startTime: Date | null;
    place: string;
    spy: UserState | null;
}

const initialState: GameState = {
    invitationCode: "",
    players: [],
    startTime: null,
    place: "",
    spy: null,
}

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setInvitationCode: (state, {payload}) => {
            state.invitationCode = payload;
        },
        setPlayers: (state, { payload }) => {
            state.players = payload;
        },
        setStartTime: (state, { payload }) => {
            state.startTime = payload;
        },
        setPlace: (state, { payload }) => {
            state.place = payload
        },
        setSpy: (state, { payload }) => {
            state.spy = spy;
        }
    }
})

export const { setInvitationCode, setPlayers, setStartTime, setPlace, setSpy } = gameSlice.actions;

export const selectSpy = (state: {game: GameState}) => state.game.spy;
export const selectInvitationCode = (state: {game: GameState}) => state.game.invitationCode;
export const selectPlace = (state: {game: GameState}) => state.game.place;
export const selectStartTime = (state: {game: GameState}) => state.game.startTime;
export const selectPlayers = (state: {game: GameState}) => state.game.players;

export default gameSlice.reducer;