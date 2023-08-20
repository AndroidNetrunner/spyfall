import { Place } from "@/constants/places";
import { Vote } from "./Vote";
import { UserId } from "./UserId";
import { InvitationCode } from "./InvitationCode";
import { UserState } from "@/redux/slices/userSlice";

interface GameData {
    votes?: Vote;
    finalVotes?: { [key in UserId]: UserId | null };
    resultDescription: string;
    availablePlaces: Place[];
    invitationCode: InvitationCode;
    nominator?: UserId;
    nominee?: UserId;
    players: UserState[];
    roles: {[key in UserId] : string};
    spy: UserState;
}

export default GameData;