import useHandler from '@/app/hooks/useHandler';
import { selectInvitationCode, selectSpy } from '@/redux/slices/gameSlice';
import { selectUser } from '@/redux/slices/userSlice';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';

export default function ForceQuitButton() {
  const { handleQuit } = useHandler();
  const invitationCode = useSelector(selectInvitationCode);
  const myUser = useSelector(selectUser);
  const spy = useSelector(selectSpy);

  if (!invitationCode) return;

  return (
    <Button color="error" variant="outlined" onClick={() => handleQuit(invitationCode, myUser.id === spy?.id)}>
      강제 종료
    </Button>
  );
}
