'use client';

import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import useCreateHandler from '../../hooks/useCreateHandler';
import { InvitationCode, isValidInvitationCode } from '@/types/isValidInvitationCode';

export default function Entrance() {
  const [nickname, setNickname] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const { handleCreate, handleJoin } = useCreateHandler();
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
            <TextField
              margin="normal"
              required
              inputProps={{
                maxLength: 8,
              }}
              id="nickname"
              label="닉네임"
              name="nickname"
              autoFocus
              onChange={event => setNickname(event.target.value)}
            />
            <Button
              onClick={() => void handleCreate(nickname)}
              variant="outlined"
              sx={{
                ml: 3,
                mt: 3,
                mb: 2,
              }}
              disabled={!nickname || !!invitationCode}>
              방 생성
            </Button>
          </div>
          <div>
            <TextField
              margin="normal"
              color="success"
              helperText={
                !!invitationCode && !isValidInvitationCode(invitationCode) ? '유효한 초대 코드가 아닙니다.' : ''
              }
              inputProps={{
                maxLength: 6,
              }}
              error={!!invitationCode && !isValidInvitationCode(invitationCode)}
              name="invitationCode"
              label="초대 코드"
              onChange={event => setInvitationCode(event.target.value)}
            />
            <Button
              onClick={() => void handleJoin(nickname, invitationCode as InvitationCode)}
              variant="outlined"
              color="success"
              sx={{ ml: 3, mt: 3, mb: 2 }}
              disabled={!(nickname && isValidInvitationCode(invitationCode))}>
              방 참가
            </Button>
          </div>
        </Box>
      </Box>
    </Container>
  );
}
