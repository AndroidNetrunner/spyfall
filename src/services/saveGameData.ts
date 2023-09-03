import db from '../../firebase/firebase.config';
import GameData from '@/types/GameData';
import { ref, set } from 'firebase/database';

export default async function saveGameData(invitationCode: string, gameData: GameData) {
  const gameRef = ref(db, 'games/' + invitationCode);
  await set(gameRef, gameData);
}
