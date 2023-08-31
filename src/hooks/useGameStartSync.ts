import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ref, onValue, remove } from "firebase/database";

import db from "../../firebase/firebase.config";
import { selectUser } from "@/redux/slices/userSlice";
import { resetGame, setGame, setResultDescription } from "@/redux/slices/gameSlice";
import { setFinalVotes } from '@/redux/slices/votePhaseSlice';
import { setNominator, setNominee, setTimer, setVotes } from '@/redux/slices/questionPhaseSlice';
import isGameData from "@/validators/isGameData";
import GameData from "@/types/GameData";

export default function useGameStartSync() {
    const { invitationCode } = useSelector(selectUser);
    if (!invitationCode) throw new Error('초대 코드가 존재하지 않음');

    const gameRef = ref(db, 'games/' + invitationCode);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setTimer(8 * 60));

        const unsubscribe = onValue(gameRef, snapshot => {
            const currentData = snapshot.val() as GameData;
            if (isGameData(currentData)) {
                dispatch(setGame(currentData));

                if (currentData.votes) {
                    dispatch(setVotes(currentData.votes));
                }
                if (currentData.nominee) {
                    dispatch(setNominee(currentData.nominee));
                }
                if (currentData.nominator !== undefined) {
                    dispatch(setNominator(currentData.nominator));
                }
                if (currentData.finalVotes) {
                    dispatch(setFinalVotes(currentData.finalVotes));
                }
                if (currentData.resultDescription) {
                    dispatch(setResultDescription(currentData.resultDescription));
                }
            }
        });

        return () => {
            unsubscribe();
            void remove(gameRef);
            dispatch(resetGame());
        };
    }, [gameRef, dispatch]);
}
