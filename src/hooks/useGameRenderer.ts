import QuestionPhase from '@/app/Game/QuestionPhase/QuestionPhase';
import Result from '@/app/Game/Result/Result';
import VotePhase from '@/app/Game/VotePhase/VotePhase';
import { selectResultDescription } from '@/redux/slices/gameSlice';
import { selectTimer } from '@/redux/slices/questionPhaseSlice';
import { useSelector } from 'react-redux';

function useGameRenderer() {
  const timer = useSelector(selectTimer);
  const resultDescription = useSelector(selectResultDescription);

  if (resultDescription) return Result;
  if (timer > 0) return QuestionPhase;
  return VotePhase;
}

export default useGameRenderer;
