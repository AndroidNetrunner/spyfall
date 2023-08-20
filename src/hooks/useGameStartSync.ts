import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDoc, doc, onSnapshot } from "firebase/firestore";

import db from "../../firebase/firebase.config";
import { selectUser } from "@/redux/slices/userSlice";
import { GameState, resetGame, setGame, setResultDescription } from "@/redux/slices/gameSlice";
import { setFinalVotes } from '@/redux/slices/votePhaseSlice';
import { setNominator, setNominee, setTimer, setVotes } from '@/redux/slices/questionPhaseSlice';
import isGameData from "@/validators/isGameData";

export default function useGameStartSync() {
    const { invitationCode } = useSelector(selectUser);
    if (!invitationCode) throw new Error('초대 코드가 존재하지 않음');

    const docRef = doc(db, 'games', invitationCode);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setTimer(8 * 60));

        const unsubscribe = onSnapshot(docRef, snapshot => {
            const currentData = snapshot.data();

            if (isGameData(currentData)) {
                dispatch(setGame(currentData as GameState));

                if (currentData.votes) {
                    dispatch(setVotes(currentData.votes));
                }
                if (currentData.nominee) {
                    dispatch(setNominee(currentData.nominee));
                }
                if (currentData.nominator) {
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
            void deleteDoc(docRef);
            dispatch(resetGame());
        };
    }, [docRef.path, dispatch]);
}
