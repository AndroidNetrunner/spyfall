import { InvitationCode } from '@/types/InvitationCode';
import { Place, ROLES_BY_PLACE } from '@/constants/places';
import { shuffleStringArray } from '@/utils/shuffleArray';
import { UserState } from '@/redux/slices/userSlice';
import { UserId } from '@/types/UserId';
import { GameState } from '@/redux/slices/gameSlice';
import Players from '@/types/Players';

const NUMBER_OF_PLACES = 20;

const createNewGame = (invitationCode: InvitationCode, players: Players): GameState => {
  const [place, possiblePlaces] = chooseRandomPlace(players);
  const availablePlaces = makeAvailablePlaces(place, possiblePlaces);
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

const makeAvailablePlaces = (place: Place, possiblePlaces: Place[]): Place[] => {
  const otherPlaces = possiblePlaces.filter(availablePlace => place != availablePlace);
  return shuffleStringArray(otherPlaces.slice(0, NUMBER_OF_PLACES - 1).concat(place)) as Place[];
};

const decideRoleOfCitizens = (players: UserState[], roles: string[]): { [key: string]: string } => {
  const shuffledRoles = shuffleStringArray(roles);
  return players.reduce<{ [key: UserId]: string }>((acc, player, index) => {
    if (!player.id) throw new Error('플레이어의 id가 존재하지 않음');
    acc[player.id] = shuffledRoles[index];
    return acc;
  }, {});
};

const chooseRandomPlace = (players: Players): [Place, Place[]] => {
  const numberOfPlayers = Object.keys(players).length;
  const possiblePlaces = Object.keys(ROLES_BY_PLACE).filter(
    place => ROLES_BY_PLACE[place as Place].length >= numberOfPlayers,
  ) as Place[];
  return [possiblePlaces[Math.floor(Math.random() * possiblePlaces.length)], possiblePlaces];
};

export default createNewGame;
