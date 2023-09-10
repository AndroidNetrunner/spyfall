import { useEffect } from 'react';
import { ref, remove } from 'firebase/database';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { LOCAL_STORAGE_ID, LOCAL_STORAGE_INVITATION_CODE } from '../constants/localStorage';
import db from '../../firebase/firebase.config';

const useCleanupGame = (invitationCode: string, isSpy: boolean) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_ID);
      localStorage.removeItem(LOCAL_STORAGE_INVITATION_CODE);
    }

    if (!invitationCode) throw new Error('초대 코드가 존재하지 않음');

    void remove(ref(db, 'games/' + invitationCode));

    if (isSpy) {
      const analytics = getAnalytics();
      logEvent(analytics, 'GameEnd', { invitationCode });
    }
  }, [invitationCode, isSpy]);
};

export default useCleanupGame;
