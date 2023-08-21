import { selectVotes } from "@/redux/slices/questionPhaseSlice";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useSnackbarState = () : [boolean,  Dispatch<SetStateAction<boolean>>] => {
    const [openedSnackbar, setOpenedSnackbar] = useState(false);
    const votes = useSelector(selectVotes);
  
    useEffect(() => {
      const readVotes = Object.values(votes);
      if (readVotes.every(vote => vote !== null) && readVotes.some(vote => vote === false)) {
        setOpenedSnackbar(true);
      }
    }, [votes]);
  
    return [openedSnackbar, setOpenedSnackbar];
  };
  
export default useSnackbarState;