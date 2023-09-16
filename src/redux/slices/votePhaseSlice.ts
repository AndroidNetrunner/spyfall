import { UserId } from '@/types/UserId';
import { createSlice } from '@reduxjs/toolkit';
import { UserState } from './userSlice';

interface VotePhaseState {
  finalVotes: {
    [key in UserId]: UserId | null;
  };
}

const initialState: VotePhaseState = {
  finalVotes: {},
};

const votePhaseSlice = createSlice({
  name: 'votePhase',
  initialState,
  reducers: {
    initFinalVotes: (state, { payload }: { payload: UserState[] }) => {
      payload.forEach(player => {
        if (player.id) {
          state.finalVotes[player.id] = null;
        }
      });
    },
    vote: (state, { payload }: { payload: { from: UserId; to: UserId } }) => {
      state.finalVotes[payload.from] = payload.to;
    },
    setFinalVotes: (
      state,
      {
        payload,
      }: {
        payload: {
          [key in UserId]: UserId | null;
        };
      },
    ) => {
      state.finalVotes = payload;
    },
  },
});

export const { initFinalVotes, vote, setFinalVotes } = votePhaseSlice.actions;

export const selectFinalVotes = (state: { votePhase: VotePhaseState }) => state.votePhase.finalVotes;

export default votePhaseSlice.reducer;
