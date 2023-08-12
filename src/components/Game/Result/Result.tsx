import { selectPlace, selectResultDescription, selectSpy, setResultDescription } from '@/redux/slices/gameSlice';
import { Alert, Box, Button, Snackbar, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import FinalVoteTable from './FinalVoteTable';
import RoleTable from './RoleTable';
import { selectId, setUserId } from '@/redux/slices/userSlice';
import { RESULTS } from '@/constants/results';
import { useState } from 'react';

export default function Result() {
  const place = useSelector(selectPlace);
  const resultDescription = useSelector(selectResultDescription);
  const dispatch = useDispatch();
  const notification = decideNotification(resultDescription);
  const spy = useSelector(selectSpy);
  const myId = useSelector(selectId);
  const [openSnackbar, setOpenSnackbar] = useState(true);
  const severity = decideSeverity(resultDescription, spy?.id === myId);
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
      <Button
        variant="outlined"
        onClick={() => {
          dispatch(setUserId(null));
          dispatch(setResultDescription(''));
        }}>
        처음으로
      </Button>
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
