import React from 'react';
import { Button } from '@mui/material';

interface VoteButtonProps {
  onVoteClick: () => void;
  isVoted: boolean;
}

const VoteButton: React.FC<VoteButtonProps> = ({ onVoteClick, isVoted }) => {
  return (
    <Button variant="outlined" sx={{ mt: 3 }} disabled={!isVoted} onClick={onVoteClick}>
      투표하기
    </Button>
  );
};

export default VoteButton;
