import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import roomReducer from "./slices/roomSlice";
import gameReducer from "./slices/gameSlice";
import questionPhaseReducer from "./slices/questionPhaseSlice";
import votePhaseSliceReducer from "./slices/votePhaseSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    room: roomReducer,
    game: gameReducer,
    questionPhase: questionPhaseReducer,
    votePhase: votePhaseSliceReducer,
  },
});

export default store;
