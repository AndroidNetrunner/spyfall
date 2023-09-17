import { useDispatch, useSelector } from 'react-redux';
import { setUserId, enterRoomByInvitationCode, setNickname, UserState } from '../../redux/slices/userSlice';
import db from '../../../firebase/firebase.config';
import { InvitationCode } from '@/types/InvitationCode';
import { UserId } from '@/types/UserId';
import { setInvitationCode, setIsGameMaster, setPlayers } from '@/redux/slices/roomSlice';
import { selectSpy } from '@/redux/slices/gameSlice';
import { Place } from '@/constants/places';
import { NO_VOTE_YET, Vote } from '@/types/Vote';
import { RESULTS } from '@/constants/results';
import { isInvitationCode } from '@/validators/isInvitationCode';
import { isUserId } from '@/validators/isUserId';
import { ref, get, set, runTransaction, update } from 'firebase/database';
import { RoomData } from '@/types/Data';
import GameData from '@/types/GameData';
import Players from '@/types/Players';
import createNewGame from '../../utils/createNewGame';
import { LOCAL_STORAGE_ID, LOCAL_STORAGE_INVITATION_CODE } from '@/constants/localStorage';

const useHandler = () => {
  if (!db) throw new Error();
  const dispatch = useDispatch();
  const spy = useSelector(selectSpy);
  const handleCreate = async (nickname: string) => {
    const getRandomInvitationCode = (): InvitationCode => {
      const number = (Math.floor(Math.random() * 900000) + 100000).toString();
      if (isInvitationCode(number)) return number;
      else throw new Error('생성된 초대코드가 유효하지 않음.');
    };
    const invitationCode = getRandomInvitationCode();
    const id = generateUserID();
    const myUser = { invitationCode, id, nickname };
    try {
      await set(ref(db, '/rooms/' + invitationCode), {
        players: { [myUser.id]: myUser },
      });
    } catch (error) {
      console.error('Firebase 저장 오류:', error);
    }
    dispatch(enterRoomByInvitationCode(invitationCode));
    dispatch(setInvitationCode(invitationCode));
    dispatch(setNickname(nickname));
    dispatch(setUserId(id));
    dispatch(
      setPlayers({
        [id]: myUser,
      }),
    );
    dispatch(setIsGameMaster(true));
  };

  const dispatchUserDetails = (myUser: UserState) => {
    dispatch(enterRoomByInvitationCode(myUser.invitationCode));
    dispatch(setInvitationCode(myUser.invitationCode));
    dispatch(setUserId(myUser.id));
    dispatch(setNickname(myUser.nickname));
  };

  const handleJoin = async (nickname: string, invitationCode: InvitationCode) => {
    const roomRef = ref(db, 'rooms/' + invitationCode);
    const myUser = {
      invitationCode,
      id: generateUserID(),
      nickname,
    };
    const userRef = ref(db, `rooms/${invitationCode}/players/${myUser.id}`);
    const dataSnapshot = await get(roomRef);
    if (!dataSnapshot.exists()) {
      alert('해당 초대 코드의 방이 존재하지 않습니다.');
      return;
    }
    dispatchUserDetails(myUser);
    await update(userRef, myUser);
  };

  const handleStartGame = async (invitationCode: InvitationCode, players: Players) => {
    const gameDocRef = ref(db, 'games/' + invitationCode);
    await runTransaction(gameDocRef, (currentData: GameData) => {
      if (!currentData) {
        const newGame = createNewGame(invitationCode, players);
        return newGame;
      }
    });
    const roomDocRef = ref(db, 'rooms/' + invitationCode);
    await runTransaction(roomDocRef, (currentData: RoomData) => {
      if (!currentData) return undefined;
      return null;
    });
  };

  const handleAccuse = async (
    invitationCode: InvitationCode,
    nominatorId: UserId,
    nomineeId: UserId,
  ): Promise<void> => {
    const gameDocRef = ref(db, 'games/' + invitationCode);
    const gameSnap = await get(gameDocRef);
    if (!gameSnap.exists()) {
      throw new Error("Game doesn't exists");
    }
    try {
      await runTransaction(gameDocRef, (currentData: GameData) => {
        const votes = Object.values(currentData.players)
          .filter((player: UserState) => player.id !== nomineeId)
          .reduce<Vote>((acc, player: UserState) => {
            if (player.id) acc[player.id] = NO_VOTE_YET;
            return acc;
          }, {});
        return {
          ...currentData,
          nominator: nominatorId,
          nominee: nomineeId,
          votes,
        };
      });
    } catch (error) {
      console.log('Failed to start the game', error);
    }
  };

  const handleAccusationVote = async (
    invitationCode: InvitationCode,
    voterId: UserId,
    isYesVote: boolean,
    spyId: UserId,
  ) => {
    const gameDocRef = ref(db, 'games/' + invitationCode);
    const gameSnap = await get(gameDocRef);
    if (!gameSnap.exists()) {
      throw new Error('게임이 존재하지 않습니다.');
    }
    try {
      await runTransaction(gameDocRef, (currentData: GameData) => {
        if (currentData && currentData.votes) {
          currentData.votes[voterId] = isYesVote;
          const noVotes = Object.values(currentData.votes).filter(vote => vote === NO_VOTE_YET).length;
          /* ts-ignore를 사용한 이유는, rela*/
          if (noVotes === 0) {
            if (Object.values(currentData.votes).every(data => data === true)) {
              currentData.resultDescription =
                spyId === currentData.nominee ? RESULTS.citizensWin.arrestCorrectly : RESULTS.spyWin.arrestIncorrectly;
            }
            // @ts-ignore
            currentData.nominator = null;
            // @ts-ignore
            currentData.nominee = null;

            // @ts-ignore
            currentData.votes = null;
          }
          return currentData;
        }
      });
    } catch (error) {
      console.log('Failed to start the game', error);
    }
  };

  const handleGuess = async (invitationCode: InvitationCode, guessedPlace: Place) => {
    const gameDocRef = ref(db, 'games/' + invitationCode);
    const gameSnap = await get(gameDocRef);
    if (!gameSnap.exists()) {
      throw new Error("Game doesn't exists");
    }
    try {
      await runTransaction(gameDocRef, (currentData: GameData) => {
        const resultDescription =
          guessedPlace === currentData.place ? RESULTS.spyWin.guessCorrectPlace : RESULTS.citizensWin.guessWrongPlace;
        currentData.resultDescription = resultDescription;
        return currentData;
      });
    } catch (error) {
      console.log('Failed to start the game', error);
    }
  };

  const handleFinalVote = async (invitationCode: InvitationCode, from: UserId, to: UserId) => {
    const gameDocRef = ref(db, 'games/' + invitationCode);
    const gameSnap = await get(gameDocRef);
    if (!gameSnap.exists()) {
      throw new Error("Game with given invitation code doesn't exist.");
    }

    try {
      await runTransaction(gameDocRef, (currentData: GameData) => {
        if (!currentData.finalVotes) {
          currentData.finalVotes = {
            [from]: to,
          };
          return currentData;
        }
        const newFinalVotes = {
          ...currentData.finalVotes,
          [from]: to,
        };
        const spyId = spy?.id;
        if (!spyId) throw new Error('Spy data is missing.');
        const voteCount = Object.values(currentData.finalVotes).length;
        if (allPlayersVoted(voteCount, currentData.players)) {
          const resultDescription = decideResultDescription(newFinalVotes, spyId);
          currentData.resultDescription = resultDescription;
        }
        currentData.finalVotes = newFinalVotes;
        return currentData;
      });
    } catch (error) {
      console.log('Failed to start the game', error);
    }
  };

  const handleRejoin = async (myUser: UserState) => {
    const { invitationCode, id } = myUser;
    if (!invitationCode) throw new Error('초대 코드가 존재하지 않음');
    if (!id) throw new Error('유저 id가 존재하지 않음');
    const roomDocRef = ref(db, 'rooms/' + invitationCode);
    try {
      await runTransaction(roomDocRef, (currentData: RoomData) => {
        if (!currentData)
          return {
            invitationCode,
            players: { [id]: myUser },
          };
        else {
          const players = currentData.players;
          if (players) players[myUser.id as UserId] = myUser;
          return currentData;
        }
      });
      dispatch(setInvitationCode(invitationCode));
    } catch (error) {
      console.log('Failed to start the game', error);
    }
  };

  const handleQuit = () => {
    const isConfirmed = window.confirm('정말로 강제 종료하시겠습니까?');
    if (isConfirmed && typeof window !== undefined) {
      localStorage.removeItem(LOCAL_STORAGE_ID);
      localStorage.removeItem(LOCAL_STORAGE_INVITATION_CODE);
      dispatch(setUserId(null));
      dispatch(enterRoomByInvitationCode(null));
    }
  };

  return {
    handleCreate,
    handleJoin,
    handleStartGame,
    handleGuess,
    handleAccuse,
    handleAccusationVote,
    handleFinalVote,
    handleRejoin,
    handleQuit,
  };
};

const allPlayersVoted = (votes: number, players: Players): boolean => {
  return votes === Object.keys(players).length - 1;
};

const decideResultDescription = (newFinalVotes: { [key in UserId]: UserId }, spy: UserId): string => {
  const voteCounts = Object.values(newFinalVotes).reduce(
    (acc, vote) => {
      if (vote) {
        acc[vote] = (acc[vote] || 0) + 1;
      }
      return acc;
    },
    {} as { [key in UserId]: number },
  );

  const sortedVotes = Object.entries(voteCounts).sort((a, b) => b[1] - a[1]);
  const maxVotes = sortedVotes[0][1];
  const mostVotedUserIds = sortedVotes.filter(entry => entry[1] === maxVotes).map(entry => entry[0] as UserId);
  const mostVotedUserId = mostVotedUserIds[0];
  if (mostVotedUserIds.length === 1 && mostVotedUserId === spy) return RESULTS.citizensWin.arrestCorrectly;
  return RESULTS.spyWin.arrestIncorrectly;
};

const generateUserID = (): UserId => {
  const randomString = Array.from(
    { length: 10 },
    () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)],
  ).join('');
  const id = 'id_' + randomString;
  if (isUserId(id)) return id;
  throw new Error('생성된 userID가 유효하지 않음.');
};

export default useHandler;
