import Players from "@/types/Players";
import { DocumentData } from "firebase/firestore";

const isSamePlayersWithFirebaseStore = (data: DocumentData, original: Players) => {
    if (data) return JSON.stringify(data.players) === JSON.stringify(original);
  };

export default isSamePlayersWithFirebaseStore;