import { Place } from "@/constants/places";
import { Vote } from "./Vote";
import { UserId } from "./UserId";
import { InvitationCode } from "./InvitationCode";
import { UserState } from "@/redux/slices/userSlice";
import { GameState } from "@/redux/slices/gameSlice";

interface GameData extends GameState {
    votes?: Vote;
    finalVotes?: { [key in UserId]: UserId | null };
    availablePlaces: Place[];
    invitationCode: InvitationCode;
    nominator?: UserId;
    nominee?: UserId;
    spy: UserState;
}

export default GameData;