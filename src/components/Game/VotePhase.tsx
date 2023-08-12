import useCreateHandler from '@/hooks/useCreateHandler';
import { selectInvitationCode, selectPlayers } from '@/redux/slices/gameSlice';
import { UserState, selectId } from '@/redux/slices/userSlice';
import { selectFinalVotes } from '@/redux/slices/votePhaseSlice';
import { UserId } from '@/types/isValidUserId';
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Result from './Result/Result';

export default function VotePhase() {
  const myUserId = useSelector(selectId);
  if (!myUserId) throw new Error('유저 ID가 존재하지 않음.');
  const [votedTo, setVotedTo] = useState<UserId | null>(null);
  const [hasVote, setHasVote] = useState(true);
  const opponents = useSelector(selectPlayers).filter(player => player.id !== myUserId);
  const { handleFinalVote } = useCreateHandler();
  const invitationCode = useSelector(selectInvitationCode);
  const finalVotes = useSelector(selectFinalVotes);
  const hasVoteOpponents = opponents
    .filter(player => !finalVotes[player.id as UserId])
    .map(player => player.nickname)
    .join(', ');
  if (!invitationCode) throw new Error('초대 코드가 존재하지 않음.');
  return (
    <>
      {hasVote ? (
        <>
          <Button
            variant="outlined"
            sx={{ mt: 3 }}
            disabled={!votedTo}
            onClick={() => {
              void handleFinalVote(invitationCode, myUserId, votedTo as UserId);
              setHasVote(false);
            }}>
            투표하기
          </Button>
          <RadioGroup name="vote-radio-button" onChange={e => setVotedTo(e.target.value as UserId)}>
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <strong>스파이는 누구인가요?</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {opponents.map((opponent: UserState) => (
                    <TableRow key={opponent.id}>
                      <TableCell component="th" scope="row">
                        {opponent.nickname}
                      </TableCell>
                      <TableCell align="right">
                        <Radio value={opponent.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </RadioGroup>
        </>
      ) : hasVoteOpponents ? (
        <Box sx={{ mt: 3 }}>미투표 플레이어: {hasVoteOpponents}</Box>
      ) : (
        <Result />
      )}
    </>
  );
}
