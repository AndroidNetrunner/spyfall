import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import NicknameInput from './NicknameInput';
import CreateRoomButton from './CreateRoomButton';
import InvitationCodeInput from './InvitationCodeInput';
import JoinRoomButton from './JoinRoomButton';
import useCreateHandler from '../../hooks/useCreateHandler';
import { InvitationCode } from '@/types/InvitationCode';
import useInvitationCodeValidation from '@/hooks/useInvitationCodeValidation';
import { isInvitationCode } from '@/validators/isInvitationCode';

function Entrance() {
  const [nickname, setNickname] = useState('');
  const { handleCreate, handleJoin } = useCreateHandler();
  const { invitationCode, isValid, handleInputChange } = useInvitationCodeValidation();

  const isInvitationCodeValid = isInvitationCode(invitationCode);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Avatar src="/spy.svg" alt="스파이 아이콘" sx={{ m: 1, background: 'white' }} />
        <Typography sx={{ mt: 3 }} component="h1" variant="h5">
          스파이폴에 오신 것을 환영합니다!
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <div>
            <NicknameInput onChange={setNickname} />
            <CreateRoomButton onClick={() => void handleCreate(nickname)} disabled={!nickname || !!invitationCode} />
          </div>
          <div>
            <InvitationCodeInput
              onChange={handleInputChange}
              error={!!invitationCode && !isInvitationCodeValid}
              helperText={!isValid ? '유효한 초대 코드가 아닙니다.' : ''}
            />
            <JoinRoomButton
              onClick={() => void handleJoin(nickname, invitationCode as InvitationCode)}
              disabled={!(nickname && isInvitationCodeValid)}
            />
          </div>
        </Box>
      </Box>
    </Container>
  );
}

export default Entrance;
