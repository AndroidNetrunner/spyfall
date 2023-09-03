import { createSlice } from '@reduxjs/toolkit';
import { UserId } from '@/types/UserId';
import { Vote } from '@/types/Vote';

interface QuestionPhase {
  nominator?: UserId;
  nominee?: UserId;
  votes?: Vote;
  timer: number;
}

const initialState: QuestionPhase = {
  timer: 8 * 60,
};

const QuestionPhaseSlice = createSlice({
  name: 'questionPhase',
  initialState,
  reducers: {
    resetVote: state => {
      state.nominator = undefined;
      state.nominee = undefined;
      state.votes = undefined;
    },
    resetQuestionPhase: () => initialState,
    setVotes: (state, { payload }: { payload: Vote | undefined }) => {
      state.votes = payload;
    },
    setNominee: (state, { payload }: { payload: UserId | undefined }) => {
      state.nominee = payload;
    },
    setNominator: (state, { payload }: { payload: UserId | undefined }) => {
      state.nominator = payload;
    },
    setQuestionPhase: (state, { payload }: { payload: QuestionPhase }) => {
      return payload;
    },
    setTimer: (state, { payload }: { payload: number }) => {
      state.timer = payload;
    },
  },
});

export const { resetVote, setVotes, setQuestionPhase, resetQuestionPhase, setTimer, setNominator, setNominee } =
  QuestionPhaseSlice.actions;

export const selectNominator = (state: { questionPhase: QuestionPhase }) => state.questionPhase.nominator;
export const selectNominee = (state: { questionPhase: QuestionPhase }) => state.questionPhase.nominee;
export const selectVotes = (state: { questionPhase: QuestionPhase }) => state.questionPhase.votes;
export const selectTimer = (state: { questionPhase: QuestionPhase }) => state.questionPhase.timer;

export default QuestionPhaseSlice.reducer;
