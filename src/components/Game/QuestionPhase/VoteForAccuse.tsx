import useCreateHandler from '@/hooks/useCreateHandler';
import { selectInvitationCode, selectPlayers, selectSpy } from '@/redux/slices/gameSlice';
import { selectNominator, selectNominee } from '@/redux/slices/questionPhaseSlice';
import { selectId } from '@/redux/slices/userSlice';
import { UserId } from '@/types/UserId';
import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

export default function VoteForAccuse() {
  const players = useSelector(selectPlayers);
  const nomineeId = useSelector(selectNominee);
  const nominatorId = useSelector(selectNominator);
  const invitationCode = useSelector(selectInvitationCode);
  const spy = useSelector(selectSpy);
  if (!invitationCode) throw new Error('초대 코드가 존재하지 않음');
  const myUserId = useSelector(selectId);
  if (!myUserId) throw new Error('유저 id가 존재하지 않음');
  const nominee = players.find(player => player.id === nomineeId);
  const nominator = players.find(player => player.id === nominatorId);
  const { handleAccusationVote: handleVote } = useCreateHandler();
  const [hasVote, setHasVote] = useState(nomineeId !== myUserId);
  const handleVoteClick = useCallback(
    (isSpy: boolean) => {
      setHasVote(false);
      void handleVote(invitationCode, myUserId, isSpy, spy?.id as UserId);
    },
    [invitationCode, myUserId, spy],
  );

  return (
    <Box sx={{ mt: 3 }}>
      <Alert severity="warning">
        <AlertTitle>{nominee?.nickname}님이 고발당하였습니다!</AlertTitle>
        고발자: {nominator?.nickname}
      </Alert>
      {hasVote && (
        <>
          <Box display="flex" justifyContent="center">
            {nominee?.nickname}님은 스파이인가요?
          </Box>
          <Box display="flex" justifyContent="center">
            <Button variant="outlined" color="success" onClick={() => handleVoteClick(true)}>
              네
            </Button>
            <Button variant="outlined" color="error" onClick={() => handleVoteClick(false)}>
              아니오
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
