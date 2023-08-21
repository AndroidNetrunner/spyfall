import QuestionPhase from "@/components/Game/QuestionPhase/QuestionPhase";
import Result from "@/components/Game/Result/Result";
import VotePhase from "@/components/Game/VotePhase/VotePhase";
import { selectResultDescription } from "@/redux/slices/gameSlice";
import { selectTimer } from "@/redux/slices/questionPhaseSlice";
import { useSelector } from "react-redux";

function useGameRenderer() {
    const timer = useSelector(selectTimer);
    const resultDescription = useSelector(selectResultDescription);
  
    if (resultDescription) return Result;
    if (timer > 0) return QuestionPhase;
    return VotePhase;
  }

export default useGameRenderer;