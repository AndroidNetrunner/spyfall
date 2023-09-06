import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import NicknameInput from './NicknameInput';
import CreateRoomButton from './CreateRoomButton';
import InvitationCodeInput from './InvitationCodeInput';
import JoinRoomButton from './JoinRoomButton';
import useHandler from '../../hooks/useHandler';
import { InvitationCode } from '@/types/InvitationCode';
import useInvitationCodeValidation from '@/hooks/useInvitationCodeValidation';
import { isInvitationCode } from '@/validators/isInvitationCode';
import { mainBoxStyle, avatarStyle, typographyStyle, formStyle } from './Entrance.styles';

function Entrance() {
  const [nickname, setNickname] = useState('');
  const { handleCreate, handleJoin } = useHandler();
  const { invitationCode, isValid, handleInputChange } = useInvitationCodeValidation();
  const isInvitationCodeValid = isInvitationCode(invitationCode);

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={mainBoxStyle}>
        <Avatar src="/spy.svg" alt="스파이 아이콘" sx={avatarStyle} />
        <Typography sx={typographyStyle} component="h1" variant="h5">
          스파이폴에 오신 것을 환영합니다!
        </Typography>
        <Box component="form" noValidate sx={formStyle}>
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
