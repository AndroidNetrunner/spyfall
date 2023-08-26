import { useDispatch } from "react-redux";
import {
  setUserId,
  enterRoomByInvitationCode,
  setNickname,
  UserState,
} from "../redux/slices/userSlice";
import {
  arrayUnion,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  runTransaction,
} from "firebase/firestore";
import db from "../../firebase/firebase.config";
import { InvitationCode } from "@/types/InvitationCode";
import { UserId } from "@/types/UserId";
import { setInvitationCode, setPlayers } from "@/redux/slices/roomSlice";
import { GameState } from "@/redux/slices/gameSlice";
import { Place, ROLES_BY_PLACE } from "@/constants/places";
import { shuffleStringArray } from "@/utils/shuffleArray";
import { Vote } from "@/types/Vote";
import { RESULTS } from "@/constants/results";
import { isInvitationCode } from "@/validators/isInvitationCode";
import { isUserId } from "@/validators/isUserId";

const useCreateHandler = () => {
  const dispatch = useDispatch();

  const handleCreate = async (nickname: string) => {
    const getRandomInvitationCode = (): InvitationCode => {
      const number = (Math.floor(Math.random() * 900000) + 100000).toString();
      if (isInvitationCode(number)) return number;
      else throw new Error("생성된 초대코드가 유효하지 않음.");
    };
    const invitationCode = getRandomInvitationCode();
    const id = generateUserID();
    const myUser = { invitationCode, id, nickname };
    await setDoc(doc(db, "rooms", invitationCode), {
      invitationCode,
      players: [myUser],
    });
    dispatch(enterRoomByInvitationCode(invitationCode));
    dispatch(setInvitationCode(invitationCode));
    dispatch(setNickname(nickname));
    dispatch(setUserId(id));
    dispatch(setPlayers([myUser]));
  };

  const handleJoin = async (
    nickname: string,
    invitationCode: InvitationCode
  ) => {
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
      dispatch(setInvitationCode(myUser.invitationCode));
      dispatch(setUserId(myUser.id));
      dispatch(setNickname(myUser.nickname));
      await updateDoc(docRef, {
        players: arrayUnion(myUser),
      });
    }
  };

  const handleStart = async (
    invitationCode: InvitationCode,
    players: UserState[]
  ) => {
    const roomDocRef = doc(db, "rooms", invitationCode);
    const gameDocRef = doc(db, "games", invitationCode);
    try {
      await runTransaction(db, async (transaction) => {
        const roomSnap = await transaction.get(roomDocRef);
        if (!roomSnap.exists()) {
          throw new Error("Room does not exist");
        }

        const gameSnap = await transaction.get(gameDocRef);
        if (gameSnap.exists()) {
          throw new Error("Game already exists");
        }

        transaction.delete(roomDocRef);

        const newGame = createNewGame(invitationCode, players);
        transaction.set(gameDocRef, newGame);
      });
    } catch (error) {
      console.log("Failed to start the game", error);
    }
  };

  const handleAccuse = async (
    invitationCode: InvitationCode,
    nominatorId: UserId,
    nomineeId: UserId
  ): Promise<void> => {
    const gameDocRef = doc(db, "games", invitationCode);
    try {
      await runTransaction(db, async (transaction) => {
        const gameSnap = await transaction.get(gameDocRef);
        if (!gameSnap.exists()) {
          throw new Error("Game doesn't exists");
        }
        const gameData = gameSnap.data() as GameState;
        const votes = gameData.players
          .filter((player) => player.id !== nomineeId)
          .reduce<Vote>((acc, player) => {
            if (player.id) acc[player.id] = null;
            return acc;
          }, {});
        const updatedGameData = {
          ...gameData,
          nominator: nominatorId,
          nominee: nomineeId,
          votes,
        };
        transaction.set(gameDocRef, updatedGameData);
      });
    } catch (error) {
      console.log("Failed to start the game", error);
    }
  };
  // TODO: handleVote를 handleAccusationVote로 바꾸기
  const handleVote = async (
    invitationCode: InvitationCode,
    voterId: UserId,
    isYesVote: boolean,
    spyId: UserId
  ) => {
    const gameDocRef = doc(db, "games", invitationCode);
    try {
      await runTransaction(db, async (transaction) => {
        const gameSnap = await transaction.get(gameDocRef);
        if (!gameSnap.exists()) {
          throw new Error("Game doesn't exists");
        }
        const gameData = gameSnap.data();
        if (gameData && gameData.votes) {
          const newData = { ...(gameData.votes as Vote), [voterId]: isYesVote };
          const noVotes = Object.values(newData as Vote).filter(
            (vote) => vote === null
          ).length;
          const updateData = { [`votes.${voterId}`]: isYesVote };

          if (noVotes === 0) {
            updateData.nominator = null;
            if (Object.values(newData).every((data) => data === true)) {
              updateData.resultDescription =
                spyId === gameData.nominee
                  ? RESULTS.citizensWin.arrestCorrectly
                  : RESULTS.spyWin.arrestIncorrectly;
            }
          }
          transaction.update(gameDocRef, updateData);
        }
      });
    } catch (error) {
      console.log("Failed to start the game", error);
    }
  };

  const handleGuess = async (
    invitationCode: InvitationCode,
    guessedPlace: Place
  ) => {
    const gameDocRef = doc(db, "games", invitationCode);
    try {
      await runTransaction(db, async (transaction) => {
        const gameSnap = await transaction.get(gameDocRef);
        if (!gameSnap.exists()) {
          throw new Error("Game doesn't exists");
        }
        const gameData = gameSnap.data();
        const resultDescription =
          guessedPlace === gameData.place
            ? RESULTS.spyWin.guessCorrectPlace
            : RESULTS.citizensWin.guessWrongPlace;
        transaction.update(gameDocRef, {
          resultDescription,
        });
      });
    } catch (error) {
      console.log("Failed to start the game", error);
    }
  };

  const handleFinalVote = async (
    invitationCode: InvitationCode,
    from: UserId,
    to: UserId
  ) => {
    const gameDocRef = doc(db, "games", invitationCode);
    try {
      await runTransaction(db, async (transaction) => {
        const gameSnap = await transaction.get(gameDocRef);
        if (!gameSnap.exists()) {
          throw new Error("Game with given invitation code doesn't exist.");
        }

        const gameData = gameSnap.data();
        if (!gameData || !gameData.finalVotes || !gameData.spy) {
          throw new Error("Incomplete game data.");
        }

        const newFinalVotes = {
          ...gameData.finalVotes,
          [from]: to,
        };

        const spyId = gameData.spy.id;
        if (!spyId) throw new Error("Spy data is missing.");

        const voteCount = Object.values(gameData.finalVotes).length;
        if (allPlayersVoted(voteCount, gameData.players)) {
          const resultDescription = decideResultDescription(
            newFinalVotes,
            spyId
          );
          transaction.update(gameDocRef, { resultDescription });
        }

        transaction.update(gameDocRef, {
          finalVotes: newFinalVotes,
        });
      });
    } catch (error) {
      console.log("Failed to start the game", error);
    }
  };

  const handleRejoin = async (myUser: UserState) => {
    const { invitationCode } = myUser;
    if (!invitationCode) throw new Error("초대 코드가 존재하지 않음");
    const roomDocRef = doc(db, "rooms", invitationCode);
    try {
      await runTransaction(db, async (transaction) => {
        const roomSnap = await transaction.get(roomDocRef);
        if (!roomSnap.exists()) {
          transaction.set(roomDocRef, {
            invitationCode,
            players: [myUser],
          });
        } else {
          const roomData = roomSnap.data();
          transaction.update(roomDocRef, {
            players: [...(roomData.players as UserState[]), myUser],
          });
        }
      });
      dispatch(setInvitationCode(invitationCode));
    } catch (error) {
      console.log("Failed to start the game", error);
    }
  };
  return {
    handleCreate,
    handleJoin,
    handleStart,
    handleGuess,
    handleAccuse,
    handleVote,
    handleFinalVote,
    handleRejoin,
  };
};

const allPlayersVoted = (votes: number, players: UserState[]): boolean => {
  return votes === players.length - 1;
};

const createNewGame = (
  invitationCode: InvitationCode,
  players: UserState[]
): GameState => {
  const place = chooseRandomPlace();
  const availablePlaces = makeAvailablePlaces(place);
  const spy = players[Math.floor(Math.random() * players.length)];
  const citizens = players.filter((player) => player.id !== spy.id);
  const roles = decideRoleOfCitizens(citizens, ROLES_BY_PLACE[place]);
  return {
    invitationCode,
    availablePlaces,
    players,
    roles,
    place,
    spy,
    resultDescription: "",
  };
};

const decideResultDescription = (
  newFinalVotes: { [key in UserId]: UserId },
  spy: UserId
): string | boolean => {
  const voteCounts = Object.values(newFinalVotes).reduce((acc, vote) => {
    if (vote) {
      acc[vote] = (acc[vote] || 0) + 1;
    }
    return acc;
  }, {} as { [key in UserId]: number });

  const sortedVotes = Object.entries(voteCounts).sort((a, b) => b[1] - a[1]);
  const maxVotes = sortedVotes[0][1];
  const mostVotedUserIds = sortedVotes
    .filter((entry) => entry[1] === maxVotes)
    .map((entry) => entry[0] as UserId);
  const mostVotedUserId = mostVotedUserIds[0];
  if (mostVotedUserIds.length === 1 && mostVotedUserId === spy)
    return RESULTS.citizensWin.arrestCorrectly;
  return RESULTS.spyWin.arrestIncorrectly;
};
const makeAvailablePlaces = (place: Place): Place[] => {
  const allPlaces = shuffleStringArray(Object.keys(ROLES_BY_PLACE)).filter(
    (availablePlace) => place != availablePlace
  );
  return shuffleStringArray(allPlaces.slice(0, 19).concat(place)) as Place[];
};

const decideRoleOfCitizens = (
  players: UserState[],
  roles: string[]
): { [key: string]: string } => {
  const shuffledRoles = shuffleStringArray(roles);
  return players.reduce<{ [key: UserId]: string }>((acc, player, index) => {
    if (!player.id) throw new Error("플레이어의 id가 존재하지 않음");
    acc[player.id] = shuffledRoles[index];
    return acc;
  }, {});
};

const chooseRandomPlace = (): Place => {
  const places = Object.keys(ROLES_BY_PLACE);
  return places[
    Math.floor(Math.random() * places.length)
  ] as keyof typeof ROLES_BY_PLACE;
};

const generateUserID = (): UserId => {
  const id = Array.from(
    { length: 10 },
    () =>
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[
        Math.floor(Math.random() * 62)
      ]
  ).join("");
  if (isUserId(id)) return id;
  throw new Error("생성된 userID가 유효하지 않음.");
};

export default useCreateHandler;
