import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectPlayers } from '@/redux/slices/gameSlice';
import { selectFinalVotes } from '@/redux/slices/votePhaseSlice';
import { selectId } from '@/redux/slices/userSlice';
import { UserId } from '@/types/UserId';
import { UserState } from '@/redux/slices/userSlice'; 

export const useVotePhase = () => {
  const [votedTo, setVotedTo] = useState<UserId | null>(null);
  const myUserId = useSelector(selectId);
  const opponents = Object.values(useSelector(selectPlayers)).filter((player: UserState) => player.id !== myUserId);
  const finalVotes = useSelector(selectFinalVotes);
  const unvotedOpponents = opponents.filter((player: UserState) => !finalVotes[player.id as UserId]).map((player: UserState) => player.nickname)
  .join(', ');

  return {
    votedTo,
    setVotedTo,
    myUserId,
    unvotedOpponents
  };
};
