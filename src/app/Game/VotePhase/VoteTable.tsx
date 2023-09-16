import React from 'react';
import { RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Radio } from '@mui/material';
import { UserState } from '@/redux/slices/userSlice';
import { UserId } from '@/types/UserId';

interface VoteTableProps {
  opponents: UserState[];
  onVoteChange: React.Dispatch<React.SetStateAction<UserId | null>>;
}
const TABLE_HEADER = '스파이는 누구인가요?';
const VoteTable: React.FC<VoteTableProps> = ({ opponents, onVoteChange }) => {
  return (
    <RadioGroup name="vote-radio-button" onChange={e => onVoteChange(e.target.value as UserId)}>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={2} align="center">
                <strong>{TABLE_HEADER}</strong>
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
  );
};

export default VoteTable;
