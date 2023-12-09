import { ref, remove } from 'firebase/database';
import db from '../../firebase/firebase.config';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { LOCAL_STORAGE_END_TIME, LOCAL_STORAGE_ID, LOCAL_STORAGE_INVITATION_CODE } from '@/constants/localStorage';

export const cleanupGame = (invitationCode: string, isLogging: boolean) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_ID);
    localStorage.removeItem(LOCAL_STORAGE_INVITATION_CODE);
    localStorage.removeItem(LOCAL_STORAGE_END_TIME);
  }

  if (!invitationCode) throw new Error('초대 코드가 존재하지 않음');

  void remove(ref(db, 'games/' + invitationCode));

  if (isLogging) {
    const analytics = getAnalytics();
    logEvent(analytics, 'GameEnd', { invitationCode });
  }
};
