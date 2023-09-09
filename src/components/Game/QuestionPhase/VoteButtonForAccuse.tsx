import { Button } from '@mui/material';
import React from 'react';

interface VoteButtonProps {
  isSpy: boolean;
  onClick: (isSpy: boolean) => void;
}

const VoteButtonForAccuse = ({ isSpy, onClick }: VoteButtonProps) => {
  return (
    <Button variant="outlined" color={isSpy ? 'success' : 'error'} onClick={() => onClick(isSpy)}>
      {isSpy ? '네' : '아니오'}
    </Button>
  );
};

export default VoteButtonForAccuse;
