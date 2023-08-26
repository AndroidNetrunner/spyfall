import React, { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { selectInvitationCode, selectPlayers } from "@/redux/slices/gameSlice";
import { selectId } from "@/redux/slices/userSlice";
import useCreateHandler from "@/hooks/useCreateHandler";

import VoteButton from "./VoteButton";
import VoteTable from "./VoteTable";

interface Props {
  votedTo: string | null;
  setVotedTo: Dispatch<SetStateAction<string | null>>;
}

const VoteForm = ({ votedTo, setVotedTo }) => {
  const myUserId = useSelector(selectId);
  const invitationCode = useSelector(selectInvitationCode);
  const opponents = useSelector(selectPlayers).filter(
    (player) => player.id !== myUserId
  );
  if (!myUserId || !invitationCode)
    throw new Error("초대 코드나 UserID가 존재하지 않음");
  const { handleFinalVote } = useCreateHandler();

  const handleVoteButtonClick = async () => {
    if (votedTo) {
      try {
        await handleFinalVote(invitationCode, myUserId, votedTo);
        setVotedTo(null);
      } catch (error) {
        console.error("투표 중 오류 발생:", error);
      }
    }
  };

  return (
    <>
      <VoteButton onVoteClick={handleVoteButtonClick} isVoted={!!votedTo} />
      <VoteTable opponents={opponents} onVoteChange={setVotedTo} />
    </>
  );
};

export default VoteForm;