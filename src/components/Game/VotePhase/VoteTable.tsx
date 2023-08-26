import React from 'react';
import {
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio
} from '@mui/material';

interface Player {
  id: string;
  nickname: string;
}

interface VoteTableProps {
  opponents: Player[];
  onVoteChange: (value: string) => void;
}
const TABLE_HEADER = "스파이는 누구인가요?"
const VoteTable: React.FC<VoteTableProps> = ({ opponents, onVoteChange }) => {
  return (
    <RadioGroup name="vote-radio-button" onChange={e => onVoteChange(e.target.value)}>
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
}

export default VoteTable;
