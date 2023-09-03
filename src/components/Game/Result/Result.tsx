import { selectPlace, selectResultDescription, selectSpy, setResultDescription } from '@/redux/slices/gameSlice';
import { Alert, Box, Button, Snackbar, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import FinalVoteTable from './FinalVoteTable';
import RoleTable from './RoleTable';
import { selectUser, setUserId } from '@/redux/slices/userSlice';
import { RESULTS } from '@/constants/results';
import { useEffect, useState } from 'react';
import useHandler from '@/hooks/useHandler';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { ref, remove } from 'firebase/database';
import db from '../../../../firebase/firebase.config';

export default function Result() {
  const analytics = getAnalytics();
  const place = useSelector(selectPlace);
  const resultDescription = useSelector(selectResultDescription);
  const dispatch = useDispatch();
  const notification = decideNotification(resultDescription);
  const spy = useSelector(selectSpy);
  const myUser = useSelector(selectUser);
  const myId = myUser.id;
  const { invitationCode } = myUser;
  const [openSnackbar, setOpenSnackbar] = useState(true);
  const { handleRejoin } = useHandler();
  const severity = decideSeverity(resultDescription, spy?.id === myId);
  useEffect(() => {
    if (!invitationCode) throw new Error('초대 코드가 존재하지 않음');
    void remove(ref(db, 'games/' + invitationCode));
    if (spy?.id === myUser.id) {
      logEvent(analytics, 'GameEnd', { invitationCode });
    }
  }, []);

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
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mt: 2,
        }}>
        <Button
          variant="outlined"
          onClick={() => {
            dispatch(setUserId(null));
            dispatch(setResultDescription(''));
          }}>
          처음으로
        </Button>
        <Button
          variant="outlined"
          color="success"
          onClick={() => {
            void handleRejoin(myUser);
          }}>
          다시 하기
        </Button>
      </Box>
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

const decideSeverity = (setResultDescription: string, amSpy: boolean) => {
  const { spyWin } = RESULTS;
  const wonBySpy = Object.values(spyWin).includes(setResultDescription);
  return (wonBySpy && amSpy) || (!wonBySpy && !amSpy) ? 'success' : 'error';
};
