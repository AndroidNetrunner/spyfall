import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import roomReducer from "./slices/roomSlice";
import gameReducer from "./slices/gameSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    room: roomReducer,
    game: gameReducer,
  },
});

export default store;
