import { UserState } from "@/redux/slices/userSlice";
import { UserId } from "./UserId";
import { GameState } from "@/redux/slices/gameSlice";
import { Vote } from "./Vote";

export interface RoomData {
    players?: {
        [key: UserId]: UserState;
    };
  }
  
  export interface GameData extends GameState {
    votes?: Vote,
    nominator?: UserId,
    nominee?: UserId,
    finalVotes: {
      [key in UserId]: UserId | null
    },
  }
  