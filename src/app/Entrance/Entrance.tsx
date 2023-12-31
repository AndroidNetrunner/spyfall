import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

import { InvitationCode } from '@/types/InvitationCode';
import { isInvitationCode } from '@/validators/isInvitationCode';

import useHandler from '../hooks/useHandler';
import useInvitationCodeValidation from '@/app/hooks/useInvitationCodeValidation';

import EntryButton from './EntryButton';
import UserEntryField from './UserEntryField';

import { mainBoxStyle, avatarStyle, typographyStyle, formStyle } from './Entrance.styles';
import { useDispatch } from 'react-redux';
import { setIsGameMaster } from '@/redux/slices/roomSlice';

function Entrance() {
  const dispatch = useDispatch();
  const [nickname, setNickname] = useState('');
  const { handleCreate, handleJoin } = useHandler();
  const { invitationCode, isValid, handleInputChange } = useInvitationCodeValidation();
  const isInvitationCodeValid = isInvitationCode(invitationCode);

  useEffect(() => {
    dispatch(setIsGameMaster(false));
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={mainBoxStyle}>
        <Avatar src="/spy.svg" alt="스파이 아이콘" sx={avatarStyle} />
        <Typography sx={typographyStyle} component="h1" variant="h5">
          스파이폴에 오신 것을 환영합니다!
        </Typography>
        <Box component="form" noValidate sx={formStyle}>
          <div>
            <UserEntryField label="닉네임" handler={setNickname} maxLength={8} name="nickname" required autoFocus />
          </div>
          <div>
            <UserEntryField
              label="초대 코드"
              handler={handleInputChange}
              error={!!invitationCode && !isInvitationCodeValid}
              helperText={!isValid ? '유효한 초대 코드가 아닙니다.' : ''}
              maxLength={6}
              name="invitationCode"
              color="success"
            />
          </div>
          <div>
            <EntryButton
              label="방 생성"
              sx={{ mr: 3, mt: 3 }}
              onClick={() => void handleCreate(nickname)}
              disabled={!nickname || !!invitationCode}
            />
            <EntryButton
              label="방 참가"
              sx={{ ml: 3, mt: 3 }}
              buttonColor="success"
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
