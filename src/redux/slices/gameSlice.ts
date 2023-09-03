import { createSlice } from '@reduxjs/toolkit';
import { UserState } from './userSlice';
import { UserId } from '@/types/UserId';
import { Place } from '@/constants/places';
import { InvitationCode } from '@/types/InvitationCode';
import Players from '@/types/Players';
import GameData from '@/types/GameData';

export interface GameState {
  invitationCode: InvitationCode | null;
  players: Players;
  place: string;
  roles: { [key in UserId]: string };
  availablePlaces: Place[] | null;
  spy: UserState | null;
  resultDescription: string;
}

const initialState: GameState = {
  invitationCode: null,
  players: {},
  place: '',
  roles: {},
  availablePlaces: null,
  spy: null,
  resultDescription: '',
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setInvitationCode: (state, { payload }: { payload: InvitationCode }) => {
      state.invitationCode = payload;
    },
    setPlayers: (state, { payload }: { payload: Players }) => {
      state.players = payload;
    },
    setPlace: (state, { payload }: { payload: string }) => {
      state.place = payload;
    },
    setSpy: (state, { payload }: { payload: UserState }) => {
      state.spy = payload;
    },
    setRoles: (state, { payload }: { payload: { [key: UserId]: string } }) => {
      state.roles = payload;
    },
    setAvailablePlaces: (state, { payload }: { payload: { [key: string]: Place } }) => {
      const placesArray: Place[] = [];
      for (const key in payload) placesArray.push(payload[key]);
      state.availablePlaces = placesArray;
    },
    setGame: (state, { payload }: { payload: GameData }) => {
      const { invitationCode, players, place, spy, roles, availablePlaces } = payload;
      const placesArray: Place[] = [];
      for (const key in availablePlaces) placesArray.push(availablePlaces[key]);
      state.invitationCode = invitationCode;
      state.players = players;
      state.place = place;
      state.availablePlaces = placesArray;
      state.spy = spy;
      state.roles = roles;
    },
    setResultDescription: (state, { payload }: { payload: string }) => {
      state.resultDescription = payload;
    },
    resetGame: () => initialState,
  },
});

export const { setInvitationCode, setPlayers, setPlace, setSpy, setGame, setResultDescription, resetGame } =
  gameSlice.actions;

export const selectSpy = (state: { game: GameState }) => state.game.spy;
export const selectInvitationCode = (state: { game: GameState }): InvitationCode | null => state.game.invitationCode;
export const selectPlace = (state: { game: GameState }) => state.game.place;
export const selectRoles = (state: { game: GameState }) => state.game.roles;
export const selectPlayers = (state: { game: GameState }) => state.game.players;
export const selectAvailablePlaces = (state: { game: GameState }) => state.game.availablePlaces;
export const selectResultDescription = (state: { game: GameState }) => state.game.resultDescription;

export default gameSlice.reducer;
