import { InvitationCode } from '@/types/InvitationCode';
import { isInvitationCode } from '@/validators/isInvitationCode';
import { Typography } from '@mui/material';
import React from 'react';

export default function InvitationCode({ invitationCode }: { invitationCode: InvitationCode }) {
  if (isInvitationCode(invitationCode))
    return (
      <Typography sx={{ mt: 3 }} component="h1" variant="h5">
        초대 코드: {invitationCode}
      </Typography>
    );
}
