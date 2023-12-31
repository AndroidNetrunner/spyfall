import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Alert, AlertTitle, Box } from '@mui/material';

import useHandler from '@/app/hooks/useHandler';

import { selectInvitationCode, selectPlayers, selectSpy } from '@/redux/slices/gameSlice';
import { selectNominator, selectNominee, selectVotes } from '@/redux/slices/questionPhaseSlice';
import { UserState, selectId } from '@/redux/slices/userSlice';

import { UserId } from '@/types/UserId';
import PlayersWhoDidNotVote from '@/app/components/PlayersWhoDidNotVote';
import { NO_VOTE_YET, Vote } from '@/types/Vote';
import Players from '@/types/Players';
import VotingSection from './VotingSection';
import { LOCAL_STORAGE_END_TIME, LOCAL_STORAGE_PAUSE_START_TIME } from '@/constants/localStorage';

export default function VoteForAccuse() {
  const nomineeId = useSelector(selectNominee);
  const nominatorId = useSelector(selectNominator);
  const invitationCode = useSelector(selectInvitationCode);
  const players = useSelector(selectPlayers);
  const votes = useSelector(selectVotes);
  const spy = useSelector(selectSpy);
  const myUserId = useSelector(selectId);

  if (!votes) throw new Error('투표 데이터가 존재하지 않음');
  if (!invitationCode) throw new Error('초대 코드가 존재하지 않음');
  if (!myUserId) throw new Error('유저 데이터가 존재하지 않음');

  const nominee = players[nomineeId as UserId];
  const nominator = players[nominatorId as UserId];
  const unvotedOpponents = getUnvotedPlayerNicknames(players, votes);

  const { handleAccusationVote } = useHandler();
  const [hasVote, setHasVote] = useState(nomineeId !== myUserId);

  const handleVoteClick = useCallback(
    (isSpy: boolean) => {
      setHasVote(false);
      void handleAccusationVote(invitationCode, myUserId, isSpy, spy?.id as UserId);
    },
    [invitationCode, myUserId, spy],
  );

  useEffect(() => {
    startPause();
    return endPause;
  }, []);

  return (
    <Box sx={{ mt: 3 }}>
      <Alert severity="warning">
        <AlertTitle>{nominee?.nickname}님이 고발당하였습니다!</AlertTitle>
        고발자: {nominator?.nickname}
      </Alert>
      {hasVote ? (
        <VotingSection nominee={nominee} handleVoteClick={handleVoteClick} />
      ) : (
        <PlayersWhoDidNotVote unvotedOpponents={unvotedOpponents} />
      )}
    </Box>
  );
}

const getUnvotedPlayerNicknames = (players: Players, votes: Vote): string =>
  Object.values(players)
    .filter((player: UserState) => player.id && votes[player.id] === NO_VOTE_YET)
    .map((player: UserState) => player.nickname)
    .join(', ');

const startPause = () => {
  const startTime = Date.now();
  localStorage.setItem(LOCAL_STORAGE_PAUSE_START_TIME, startTime.toString());
};

const endPause = () => {
  const pauseStartTimeStr = localStorage.getItem(LOCAL_STORAGE_PAUSE_START_TIME);
  if (!pauseStartTimeStr) return;

  const pauseStartTime = parseInt(pauseStartTimeStr, 10);
  const durationPaused = Date.now() - pauseStartTime;
  extendEndTime(durationPaused);
  localStorage.removeItem(LOCAL_STORAGE_PAUSE_START_TIME);
};

const extendEndTime = (duration: number) => {
  const gameEndTimeStr = localStorage.getItem(LOCAL_STORAGE_END_TIME);
  if (!gameEndTimeStr) return;

  const currentEndTime = parseInt(gameEndTimeStr, 10);
  const newEndTime = currentEndTime + duration;
  localStorage.setItem(LOCAL_STORAGE_END_TIME, newEndTime.toString());
};
