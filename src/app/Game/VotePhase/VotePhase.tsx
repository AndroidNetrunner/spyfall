import Result from '../Result/Result';
import VoteForm from './VoteForm';
import PlayersWhoDidNotVote from './PlayersWhoDidNotVote';
import { useVotePhase } from '@/hooks/useVoteState';
import { useState } from 'react';

export default function VotePhase() {
  const { votedTo, setVotedTo, unvotedOpponents } = useVotePhase();
  const [hasVote, setHasVote] = useState(true);
  return (
    <>
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
