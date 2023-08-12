import { selectSpy } from '@/redux/slices/gameSlice';
import { selectId } from '@/redux/slices/userSlice';
import { useSelector } from 'react-redux';
import SpyRole from './Spyrole';
import CitizenRole from './CitizenRole';

export default function RoleInfo() {
  const spy = useSelector(selectSpy);
  const myId = useSelector(selectId);
  if (!spy) throw new Error('스파이가 존재하지 않음.');
  return spy.id === myId ? <SpyRole /> : <CitizenRole />;
}
