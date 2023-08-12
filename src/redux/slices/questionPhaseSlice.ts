import { createSlice } from "@reduxjs/toolkit"
import { UserId } from "@/types/isValidUserId";
import { Vote } from "@/types/Vote";

interface QuestionPhase {
    nominator: UserId | null,
    nominee: UserId | null,
    votes: Vote,
    timer: number;
}

const initialState: QuestionPhase = {
    nominator: null,
    nominee: null,
    votes: {
    },
    timer: 8 * 60
}

const QuestionPhaseSlice = createSlice({
    name: "questionPhase",
    initialState,
    reducers: {
        resetVote: (state) => {
            state.nominator = null;
            state.nominee = null;
            state.votes = {}
        },
        resetQuestionPhase: () => initialState,
        setvotes: (state, {payload} : {payload: Vote} ) => {
            state.votes = payload;
        }, 
        setNominee: (state, {payload}: {payload: UserId | null}) => {
            state.nominee = payload;
        },
        setNominator: (state, {payload}: {payload: UserId | null}) => {
            state.nominator = payload;
        },
        setQuestionPhase: (state, {payload} : { payload : QuestionPhase}) => {
            return payload
        },
        setTimer: (state, {payload} : {payload: number}) => {
            state.timer = payload;
        }
    }
})

export const { resetVote, setvotes, setQuestionPhase, resetQuestionPhase, setTimer, setNominator, setNominee } = QuestionPhaseSlice.actions;

export const selectNominator = (state: { questionPhase: QuestionPhase }) => state.questionPhase.nominator;
export const selectNominee = (state: { questionPhase: QuestionPhase }) => state.questionPhase.nominee;
export const selectVotes = (state: { questionPhase: QuestionPhase }) => state.questionPhase.votes;
export const selectTimer = (state: { questionPhase: QuestionPhase }) => state.questionPhase.timer;

export default QuestionPhaseSlice.reducer;