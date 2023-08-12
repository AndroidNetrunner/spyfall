import { UserState } from "@/redux/slices/userSlice";
import { DocumentData } from "firebase/firestore";

const isSamePlayersWithFirebaseStore = (data: DocumentData, original: UserState[]) => {
    if (data) return JSON.stringify(data.players) === JSON.stringify(original);
  };

export default isSamePlayersWithFirebaseStore;