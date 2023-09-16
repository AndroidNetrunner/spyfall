import { useState } from 'react';
import { Alert, Box, Snackbar, Typography } from '@mui/material';

import FinalVoteTable from './FinalVoteTable';
import RoleTable from './RoleTable';

import useCleanupGame from '@/hooks/useCleanupGame';
import useHandler from '@/hooks/useHandler';

import { useDispatch, useSelector } from 'react-redux';
import { selectPlace, selectResultDescription, selectSpy, setResultDescription } from '@/redux/slices/gameSlice';
import { selectUser, setUserId } from '@/redux/slices/userSlice';

import { RESULTS } from '@/constants/results';
import ResetButtons from './ResetButtons';

export default function Result() {
  const dispatch = useDispatch();
  const place = useSelector(selectPlace);
  const resultDescription = useSelector(selectResultDescription);
  const spy = useSelector(selectSpy);
  const myUser = useSelector(selectUser);
  const myId = myUser.id;
  const { invitationCode } = myUser;

  if (!invitationCode) throw new Error('초대 코드가 존재하지 않음');

  const [openSnackbar, setOpenSnackbar] = useState(true);
  const { handleRejoin } = useHandler();
  const severity = decideSeverity(resultDescription, spy?.id === myId);
  const notification = decideNotification(resultDescription);
  useCleanupGame(invitationCode, spy?.id === myId);

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Typography component="h1" variant="h4">
        게임 종료
      </Typography>
      <Typography component="h1" variant="h5">
        {resultDescription}
      </Typography>
      <ResetButtons
        onReset={() => {
          dispatch(setUserId(null));
          dispatch(setResultDescription(''));
        }}
        onRejoin={() => void handleRejoin(myUser)}
      />
      <Typography sx={{ mt: 3 }} component="h1" variant="h5">
        장소: {place}
      </Typography>
      <FinalVoteTable />
      <RoleTable />
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={severity}>{notification}</Alert>
      </Snackbar>
    </Box>
  );
}

const decideNotification = (resultDescription: string) => {
  switch (resultDescription) {
    case RESULTS.citizensWin.guessWrongPlace:
      return '스파이가 장소 추리에 실패하였습니다!';
    case RESULTS.citizensWin.arrestCorrectly:
      return '스파이가 검거되었습니다!';
    case RESULTS.spyWin.guessCorrectPlace:
      return '스파이가 장소 추리에 성공하였습니다!';
    case RESULTS.spyWin.arrestIncorrectly:
      return '무고한 시민이 검거되었습니다!';
    default:
      return '';
  }
};

const decideSeverity = (resultDescription: string, amSpy: boolean) => {
  const { spyWin } = RESULTS;
  const wonBySpy = Object.values(spyWin).includes(resultDescription);
  return (wonBySpy && amSpy) || (!wonBySpy && !amSpy) ? 'success' : 'error';
};
