import Result from '../Result/Result';
import VoteForm from './VoteForm';
import PlayersWhoDidNotVote from './PlayersWhoDidNotVote';
import { useVotePhase } from '@/hooks/useVoteState';

export default function VotePhase() {
  const { votedTo, setVotedTo, unvotedOpponents } = useVotePhase();
  return (
    <>
      {votedTo === null ? (
        <VoteForm votedTo={votedTo} setVotedTo={setVotedTo} />
      ) : unvotedOpponents.length > 0 ? (
        <PlayersWhoDidNotVote unvotedOpponents={unvotedOpponents} />
      ) : (
        <Result />
      )}
    </>
  );
}
