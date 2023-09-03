import { InvitationCode } from '@/types/InvitationCode';
import { Place, ROLES_BY_PLACE } from '@/constants/places';
import { shuffleStringArray } from '@/utils/shuffleArray';
import { UserState } from '@/redux/slices/userSlice';
import { UserId } from '@/types/UserId';
import { GameState } from '@/redux/slices/gameSlice';
import Players from '@/types/Players';

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

export default createNewGame;
