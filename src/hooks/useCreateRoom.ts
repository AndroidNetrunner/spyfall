import { useDispatch } from "react-redux";
import {
  setUserId,
  enterRoomByInvitationCode,
  setNickname,
} from "../redux/slices/userSlice";
import { arrayUnion, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../../firebase/firebase.config";

const useCreateHandler = () => {
  const dispatch = useDispatch();
  const handleCreate = async (nickname: string) => {
    const getRandomInvitationCode = () => {
      const number = Math.floor(Math.random() * 900000) + 100000;
      return number.toString();
    };
    const invitationCode = getRandomInvitationCode();
    const id = generateUserID();
    const myUser = { invitationCode, id, nickname };
    dispatch(enterRoomByInvitationCode(invitationCode));
    dispatch(setNickname(nickname));
    dispatch(setUserId(id));
    await setDoc(doc(db, "rooms", invitationCode), {
      invitationCode,
      players: [myUser],
    });
  };
  const handleJoin = async (nickname: string, invitationCode: string) => {
    const docRef = doc(db, "rooms", invitationCode);
    const roomSnap = await getDoc(docRef);
    if (!roomSnap.exists()) alert("해당하는 방이 존재하지 않습니다.");
    else {
      const myUser = {
        invitationCode,
        id: generateUserID(),
        nickname,
      };
      dispatch(enterRoomByInvitationCode(myUser.invitationCode));
      dispatch(setUserId(myUser.id));
      dispatch(setNickname(myUser.nickname));
      await updateDoc(docRef, {
        players: arrayUnion(myUser),
      });
    }
  };
  return { handleCreate, handleJoin };
};

const generateUserID = () =>
  Array.from(
    { length: 10 },
    () =>
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[
        Math.floor(Math.random() * 62)
      ]
  ).join("");

export default useCreateHandler;
