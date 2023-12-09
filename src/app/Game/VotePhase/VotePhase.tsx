import Result from '../Result/Result';
import VoteForm from './VoteForm';
import PlayersWhoDidNotVote from '../../components/PlayersWhoDidNotVote';
import { useVotePhase } from '@/app/hooks/useVoteState';
import { useState } from 'react';
import { selectNominator } from '@/redux/slices/questionPhaseSlice';
import { useSelector } from 'react-redux';
import VoteForAccuse from '../QuestionPhase/VoteForAccuse';

export default function VotePhase() {
  const { votedTo, setVotedTo, unvotedOpponents } = useVotePhase();
  const [hasVote, setHasVote] = useState(true);
  const nominator = useSelector(selectNominator);
  return (
    <>
      {nominator && <VoteForAccuse />}
      {hasVote ? (
        <VoteForm votedTo={votedTo} setVotedTo={setVotedTo} setHasVote={setHasVote} />
      ) : unvotedOpponents.length > 0 ? (
        <PlayersWhoDidNotVote unvotedOpponents={unvotedOpponents} />
      ) : (
        <Result />
      )}
    </>
  );
}
