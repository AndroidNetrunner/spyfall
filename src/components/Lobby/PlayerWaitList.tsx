import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { UserState } from '../../redux/slices/userSlice';
import Players from '@/types/Players';

export default function PlayerWaitList({ players }: { players: Players }) {
  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">참가자 목록</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(players).map((player: UserState) => (
            <TableRow key={player.id}>
              <TableCell component="th" scope="row">
                {player.nickname}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
