import { doc, setDoc } from "firebase/firestore";
import db from "../../firebase/firebase.config";
import GameData from "@/types/GameData";

export default async function saveGameData(invitationCode: string, gameData: GameData) {
    const gameRef = doc(db, 'games', invitationCode);
    await setDoc(gameRef, gameData);
}
