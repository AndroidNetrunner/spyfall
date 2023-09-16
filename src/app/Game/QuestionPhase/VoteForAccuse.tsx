import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Alert, AlertTitle, Box } from '@mui/material';

import useHandler from '@/hooks/useHandler';

import { selectInvitationCode, selectPlayers, selectSpy } from '@/redux/slices/gameSlice';
import { selectNominator, selectNominee } from '@/redux/slices/questionPhaseSlice';
import { selectId } from '@/redux/slices/userSlice';

import { UserId } from '@/types/UserId';
import VoteButtonForAccuse from './VoteButtonForAccuse';

export default function VoteForAccuse() {
  const nomineeId = useSelector(selectNominee);
  const nominatorId = useSelector(selectNominator);
  const invitationCode = useSelector(selectInvitationCode);
  const players = useSelector(selectPlayers);
  const spy = useSelector(selectSpy);
  if (!invitationCode) throw new Error('초대 코드가 존재하지 않음');
  const myUserId = useSelector(selectId);
  if (!myUserId) throw new Error('유저 id가 존재하지 않음');
  const nominee = players[nomineeId as UserId];
  const nominator = players[nominatorId as UserId];
  const { handleAccusationVote } = useHandler();
  const [hasVote, setHasVote] = useState(nomineeId !== myUserId);
  const handleVoteClick = useCallback(
    (isSpy: boolean) => {
      setHasVote(false);
      void handleAccusationVote(invitationCode, myUserId, isSpy, spy?.id as UserId);
    },
    [invitationCode, myUserId, spy],
  );

  return (
    <Box sx={{ mt: 3 }}>
      <Alert severity="warning">
        <AlertTitle>{nominee?.nickname}님이 고발당하였습니다!</AlertTitle>
        고발자: {nominator?.nickname}
      </Alert>
      {hasVote ? (
        <>
          <Box display="flex" justifyContent="center">
            {nominee?.nickname}님은 스파이인가요?
          </Box>
          <Box display="flex" justifyContent="center">
            <VoteButtonForAccuse isSpy={true} onClick={handleVoteClick} />
            <VoteButtonForAccuse isSpy={false} onClick={handleVoteClick} />
          </Box>
        </>
      ) : (
        <></>
      )}
    </Box>
  );
}
