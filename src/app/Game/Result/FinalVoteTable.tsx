import { selectPlayers } from '@/redux/slices/gameSlice';
import { UserState } from '@/redux/slices/userSlice';
import { selectFinalVotes } from '@/redux/slices/votePhaseSlice';
import { UserId } from '@/types/UserId';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useSelector } from 'react-redux';

const ARROW_SYMBOL = '->';

export default function FinalVoteTable() {
  const players = useSelector(selectPlayers);
  const finalVotes = useSelector(selectFinalVotes);

  if (Object.keys(finalVotes).length === 0) return <></>;

  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={3} align="center">
              개표 결과
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(players).map((player: UserState) => {
            const targetId: UserId = finalVotes[player.id as UserId] as UserId;
            const targetNickname = players[targetId]?.nickname;
            if (!player.id) throw new Error('참가자 id가 존재하지 않음.');
            return (
              <TableRow key={player.id}>
                <TableCell component="th" scope="row">
                  {player.nickname}
                </TableCell>
                <TableCell align="center">{ARROW_SYMBOL}</TableCell>
                <TableCell align="center">{targetNickname}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
