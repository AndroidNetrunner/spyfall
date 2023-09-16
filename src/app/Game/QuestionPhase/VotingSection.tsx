import React from 'react';
import { Box } from '@mui/material';
import VoteButtonForAccuse from './VoteButtonForAccuse';
import { UserState } from '@/redux/slices/userSlice';

interface VotingSectionProps {
  nominee: UserState | undefined;
  handleVoteClick: (isSpy: boolean) => void;
}

const VotingSection = ({ nominee, handleVoteClick }: VotingSectionProps) => (
  <>
    <Box display="flex" justifyContent="center">
      {nominee?.nickname}님은 스파이인가요?
    </Box>
    <Box display="flex" justifyContent="center">
      <VoteButtonForAccuse isSpy={true} onClick={handleVoteClick} />
      <VoteButtonForAccuse isSpy={false} onClick={handleVoteClick} />
    </Box>
  </>
);

export default VotingSection;
