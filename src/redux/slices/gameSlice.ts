import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "./userSlice";
import { UserId } from "@/types/UserId";
import { Place } from "@/constants/places";
import { InvitationCode } from "@/types/InvitationCode";

export interface GameState {
    invitationCode: InvitationCode | null;
    players: UserState[];
    place: string;
    roles: {[key in UserId] : string};
    availablePlaces: Place[] | null;
    spy: UserState | null;
    resultDescription: string;
}

const initialState: GameState = {
    invitationCode: null,
    players: [],
    place: "",
    roles: {},
    availablePlaces: null,
    spy: null,
    resultDescription: "",
}

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setInvitationCode: (state, {payload}: {payload: InvitationCode}) => {
            state.invitationCode = payload;
        },
        setPlayers: (state, { payload }: { payload: UserState[]}) => {
            state.players = payload;
        },
        setPlace: (state, { payload }: { payload: string}) => {
            state.place = payload
        },
        setSpy: (state, { payload } : { payload: UserState}) => {
            state.spy = payload;
        },
        setRoles: (state, { payload } : {payload: {[key in UserId] : string}}) => {
            state.roles = payload;
        },
        setAvailablePlaces: (state, {payload} : { payload: Place[] }) => {
            state.availablePlaces = payload;
        },
        setGame: (state, { payload }: {payload : GameState}) => {
            const {invitationCode, players, place, spy, roles, availablePlaces} = payload;
            state.invitationCode = invitationCode;
            state.players = players;
            state.place = place;
            state.availablePlaces = availablePlaces;
            state.spy = spy;
            state.roles = roles;
        },
        setResultDescription: (state, {payload}: {payload: string}) => {
            state.resultDescription = payload;
        },
        resetGame: () => initialState,
    }
})

export const { setInvitationCode, setPlayers, setPlace, setSpy, setGame, setResultDescription, resetGame } = gameSlice.actions;

export const selectSpy = (state: {game: GameState}) => state.game.spy;
export const selectInvitationCode = (state: {game: GameState}): InvitationCode | null => state.game.invitationCode;
export const selectPlace = (state: {game: GameState}) => state.game.place;
export const selectRoles = (state: {game: GameState}) => state.game.roles;
export const selectPlayers = (state: {game: GameState}) => state.game.players;
export const selectAvailablePlaces = (state: {game: GameState}) => state.game.availablePlaces;
export const selectResultDescription = (state: {game: GameState}) => state.game.resultDescription;

export default gameSlice.reducer;