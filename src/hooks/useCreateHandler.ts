import { useDispatch, useSelector } from 'react-redux';
import { setUserId, enterRoomByInvitationCode, setNickname, UserState } from '../redux/slices/userSlice';
import db from '../../firebase/firebase.config';
import { InvitationCode } from '@/types/InvitationCode';
import { UserId } from '@/types/UserId';
import { setInvitationCode, setPlayers } from '@/redux/slices/roomSlice';
import { GameState, selectSpy } from '@/redux/slices/gameSlice';
import { Place, ROLES_BY_PLACE } from '@/constants/places';
import { shuffleStringArray } from '@/utils/shuffleArray';
import { Vote } from '@/types/Vote';
import { RESULTS } from '@/constants/results';
import { isInvitationCode } from '@/validators/isInvitationCode';
import { isUserId } from '@/validators/isUserId';
import { ref, get, set, runTransaction, DataSnapshot } from 'firebase/database';
import { RoomData } from '@/types/Data';
import GameData from '@/types/GameData';
import Players from '@/types/Players';

const useCreateHandler = () => {
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
    await set(ref(db, 'rooms/' + invitationCode), {
      players: { [myUser.id]: myUser },
    });
    dispatch(enterRoomByInvitationCode(invitationCode));
    dispatch(setInvitationCode(invitationCode));
    dispatch(setNickname(nickname));
    dispatch(setUserId(id));
    dispatch(setPlayers({
      [id] : myUser,
    }));
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
    dispatchUserDetails(myUser);


    try {
        await runTransaction(roomRef, (currentData: DataSnapshot) => {
            if (!currentData.exists()) {
                alert('해당하는 방이 존재하지 않습니다.');
                return;
            }

            const currentValue = currentData.val() as RoomData;
            if (!currentValue.players) {
                currentValue.players = {};
            }
            currentValue.players[myUser.id] = myUser;

            return currentValue;
        });
    } catch (error) {
        console.error('Error updating room:', error);
        alert('방 정보를 업데이트하는 중 오류가 발생했습니다.');
    }
};

  const handleStart = async (invitationCode: InvitationCode, players: Players) => {
    const roomDocRef = ref(db, 'rooms/' + invitationCode);
    const gameDocRef = ref(db, 'games/' + invitationCode);
    try {
      const roomSnap = await get(roomDocRef);
      const gameSnap = await get(gameDocRef);
      if (!roomSnap.exists()) throw new Error('삭제할 방이 존재하지 않음');
      if (gameSnap.exists()) throw new Error('생성할 방이 이미 존재함');
      await runTransaction(roomDocRef, (currentData: DataSnapshot) => {
        const currentValue = currentData.val() as RoomData;
        if (currentValue && currentValue.players && Array.isArray(currentValue.players)) {
          return currentData;
        }
        return createNewGame(invitationCode, players);  
      });
    } catch (error) {
      console.log('Failed to start the game', error);
    }
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
      await runTransaction(gameDocRef, (currentData: DataSnapshot) => {
        const dataValue = currentData.val() as GameState;
        const votes = Object.values(dataValue.players)
          .filter((player: UserState) => player.id !== nomineeId)
          .reduce<Vote>((acc, player: UserState) => {
            if (player.id) acc[player.id] = null;
            return acc;
          }, {});
        return {
          ...dataValue,
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
      throw new Error("게임이 존재하지 않습니다.");
    }
    try {
      await runTransaction(gameDocRef, (currentData: DataSnapshot) => {
      const dataValue = currentData.val() as GameData;
      if (dataValue && dataValue.votes) {
          dataValue.votes[voterId] = isYesVote;
          const noVotes = Object.values(dataValue.votes).filter(vote => vote === null).length; 
          if (noVotes === 0) {
            dataValue.nominator = undefined;
            if (Object.values(dataValue.votes).every(data => data === true)) {
              dataValue.resultDescription =
                spyId === dataValue.nominee ? RESULTS.citizensWin.arrestCorrectly : RESULTS.spyWin.arrestIncorrectly;
            }
          }
          return dataValue;
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
      await runTransaction(gameDocRef, (currentData: DataSnapshot) => {
        const dataValue = currentData.val() as GameData;
        const resultDescription =
          guessedPlace === dataValue.place ? RESULTS.spyWin.guessCorrectPlace : RESULTS.citizensWin.guessWrongPlace;
        dataValue.resultDescription = resultDescription;
        return dataValue;
      });
    } catch (error) {
      console.log('Failed to start the game', error);
    }
  };
// TODO: Firestore에서 Realtime Database로 이관
  const handleFinalVote = async (invitationCode: InvitationCode, from: UserId, to: UserId) => {
    const gameDocRef = ref(db, 'games/' + invitationCode);
    const gameSnap = await get(gameDocRef);
    if (!gameSnap.exists()) {
      throw new Error("Game with given invitation code doesn't exist.");
    }

    try {
      await runTransaction(gameDocRef, (currentData: DataSnapshot) => {
       const dataValue = currentData.val() as GameData;
        const newFinalVotes = {
          ...(dataValue.finalVotes as {
            [playerId in UserId]: UserId;
          }),
          [from]: to,
        };
        if (!dataValue.finalVotes) throw new Error("최종 투표가 존재하지 않습니다.");
        const spyId = spy?.id;
        if (!spyId) throw new Error('Spy data is missing.');

        const voteCount = Object.values(dataValue.finalVotes).length;
        if (allPlayersVoted(voteCount, dataValue.players)) {
          const resultDescription = decideResultDescription(newFinalVotes, spyId);
          dataValue.resultDescription = resultDescription;
        }
        dataValue.finalVotes = newFinalVotes;
        return dataValue;
      });
    } catch (error) {
      console.log('Failed to start the game', error);
    }
  };

  const handleRejoin = async (myUser: UserState) => {
    const { invitationCode } = myUser;
    if (!invitationCode) throw new Error('초대 코드가 존재하지 않음');
    const roomDocRef = ref(db, 'rooms/' + invitationCode);
    try {
      await runTransaction(roomDocRef, (currentData: DataSnapshot) => {
        if (!currentData.val()) 
          return {
            invitationCode,
            players: [myUser],
          };
        else {
          const dataValue = currentData.val() as RoomData;
          const players = dataValue.players;
          if (players)
            players[myUser.id as UserId] = myUser
          return dataValue;
        }
      });
      dispatch(setInvitationCode(invitationCode));
    } catch (error) {
      console.log('Failed to start the game', error);
    }
  };
  return {
    handleCreate,
    handleJoin,
    handleStart,
    handleGuess,
    handleAccuse,
    handleAccusationVote,
    handleFinalVote,
    handleRejoin,
  };
};

const allPlayersVoted = (votes: number, players: Players): boolean => {
  return votes === Object.keys(players).length - 1;
};

const createNewGame = (invitationCode: InvitationCode, players: Players): GameState => {
  const place = chooseRandomPlace();
  const availablePlaces = makeAvailablePlaces(place);
  const playersArray = Object.values(players) as UserState[];
  const spy = playersArray[Math.floor(Math.random() * playersArray.length)];
  const citizens = playersArray.filter(player => player.id !== spy.id);
  const roles = decideRoleOfCitizens(citizens, ROLES_BY_PLACE[place]);
  return {
    invitationCode,
    availablePlaces,
    players,
    roles,
    place,
    spy,
    resultDescription: '',
  };
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

const makeAvailablePlaces = (place: Place): Place[] => {
  const allPlaces = shuffleStringArray(Object.keys(ROLES_BY_PLACE)).filter(availablePlace => place != availablePlace);
  return shuffleStringArray(allPlaces.slice(0, 19).concat(place)) as Place[];
};

const decideRoleOfCitizens = (players: UserState[], roles: string[]): { [key: string]: string } => {
  const shuffledRoles = shuffleStringArray(roles);
  return players.reduce<{ [key: UserId]: string }>((acc, player, index) => {
    if (!player.id) throw new Error('플레이어의 id가 존재하지 않음');
    acc[player.id] = shuffledRoles[index];
    return acc;
  }, {});
};
const chooseRandomPlace = (): Place => {
  const places = Object.keys(ROLES_BY_PLACE);
  return places[Math.floor(Math.random() * places.length)] as keyof typeof ROLES_BY_PLACE;
};

const generateUserID = (): UserId => {
  const id = Array.from(
    { length: 10 },
    () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)],
  ).join('');
  if (isUserId(id)) return id;
  throw new Error('생성된 userID가 유효하지 않음.');
};

export default useCreateHandler;
