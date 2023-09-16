import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useSelector } from 'react-redux';

import { selectPlayers, selectRoles } from '@/redux/slices/gameSlice';
import { UserState } from '@/redux/slices/userSlice';

const ARROW_SYMBOL = '->';

export default function RoleTable() {
  const players = useSelector(selectPlayers);
  const roles = useSelector(selectRoles);

  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={3} align="center">
              직업 목록
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(players).map((player: UserState) => {
            if (!player.id) throw new Error('참가자 id가 존재하지 않음.');
            const playerRole = roles[player.id];
            const displayedRole = playerRole || '스파이';

            return (
              <TableRow key={player.id}>
                <TableCell component="th" scope="row">
                  {player.nickname}
                </TableCell>
                <TableCell align="center">{ARROW_SYMBOL}</TableCell>
                <TableCell align="center">{displayedRole}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
