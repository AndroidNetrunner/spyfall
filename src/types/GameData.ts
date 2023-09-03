import { Place } from '@/constants/places';
import { Vote } from './Vote';
import { UserId } from './UserId';
import { InvitationCode } from './InvitationCode';
import { UserState } from '@/redux/slices/userSlice';
import Players from './Players';

interface GameData {
  players: Players;
  place: string;
  roles: { [key in UserId]: string };
  resultDescription: string;
  votes?: Vote;
  finalVotes?: { [key: UserId]: UserId | null };
  availablePlaces: { [key: string]: Place };
  invitationCode: InvitationCode;
  nominator?: UserId;
  nominee?: UserId;
  spy: UserState;
}

export default GameData;
