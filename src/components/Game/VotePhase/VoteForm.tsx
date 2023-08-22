import useCreateHandler from '@/hooks/useCreateHandler';
import { selectInvitationCode, selectPlayers } from '@/redux/slices/gameSlice';
import { selectId } from '@/redux/slices/userSlice';
import { UserId } from '@/types/UserId';
import {
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
import { Dispatch, SetStateAction } from 'react';
import { useSelector } from 'react-redux';

export default function VoteForm({
  votedTo,
  setVotedTo,
}: {
  votedTo: UserId | null;
  setVotedTo: Dispatch<SetStateAction<UserId | null>>;
}) {
  const myUserId = useSelector(selectId);
  const invitationCode = useSelector(selectInvitationCode);
  if (!invitationCode) throw new Error('초대 코드가 존재하지 않음.');
  if (!myUserId) throw new Error('유저 ID가 존재하지 않음.');
  const opponents = useSelector(selectPlayers).filter(player => player.id !== myUserId);
  const { handleFinalVote } = useCreateHandler();
  const handleVoteButtonClick = () => {
    void handleFinalVote(invitationCode, myUserId, votedTo as UserId);
    setVotedTo(null);
  };
  return (
    <>
      <Button variant="outlined" sx={{ mt: 3 }} disabled={!votedTo} onClick={handleVoteButtonClick}>
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
              {opponents.map(opponent => (
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
  );
}
