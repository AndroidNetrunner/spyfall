import { selectResultDescription, selectSpy } from '@/redux/slices/gameSlice';
import { selectTimer } from '@/redux/slices/questionPhaseSlice';
import { useSelector } from 'react-redux';
import RoleInfo from './RoleInfo';
import Result from './Result/Result';
import QuestionPhase from './QuestionPhase/QuestionPhase';
import VotePhase from './VotePhase/VotePhase';
import { Box } from '@mui/material';

export default function GameContent() {
  const spy = useSelector(selectSpy);
  const timer = useSelector(selectTimer);
  const resultDescription = useSelector(selectResultDescription);

  const renderMainContent = () => {
    if (resultDescription) {
      return <Result />;
    } else if (timer > 0) {
      return <QuestionPhase />;
    } else {
      return <VotePhase />;
    }
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {spy && <RoleInfo />}
      {renderMainContent()}
    </Box>
  );
}
