import React, { Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import { selectInvitationCode, selectPlayers } from '@/redux/slices/gameSlice';
import { UserState, selectId } from '@/redux/slices/userSlice';
import useHandler from '@/app/hooks/useHandler';

import VoteButton from './VoteButton';
import VoteTable from './VoteTable';
import { UserId } from '@/types/UserId';

interface Props {
  votedTo: UserId | null;
  setVotedTo: Dispatch<SetStateAction<UserId | null>>;
  setHasVote: Dispatch<SetStateAction<boolean>>;
}

const VoteForm = ({ votedTo, setVotedTo, setHasVote }: Props) => {
  const myUserId = useSelector(selectId);
  const invitationCode = useSelector(selectInvitationCode);
  const opponents = Object.values(useSelector(selectPlayers)).filter((player: UserState) => player.id !== myUserId);
  if (!myUserId) throw new Error('UserID가 존재하지 않음');
  if (!invitationCode) throw new Error('초대 코드가 존재하지 않음');
  const { handleFinalVote } = useHandler();
  const handleVoteButtonClick = async () => {
    if (votedTo) {
      try {
        await handleFinalVote(invitationCode, myUserId, votedTo);
        setVotedTo(null);
        setHasVote(false);
      } catch (error) {
        console.error('투표 중 오류 발생:', error);
      }
    }
  };

  return (
    <>
      <VoteButton onVoteClick={() => void handleVoteButtonClick()} isVoted={!!votedTo} />
      <VoteTable opponents={opponents} onVoteChange={setVotedTo} />
    </>
  );
};

export default VoteForm;
