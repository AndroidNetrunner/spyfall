import { selectPlace, selectRoles } from '@/redux/slices/gameSlice';
import { selectId } from '@/redux/slices/userSlice';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

export default function CitizenRole() {
  const place = useSelector(selectPlace);
  const id = useSelector(selectId);
  if (!id) throw new Error('플레이어 id가 존재하지 않음.');
  const roles = useSelector(selectRoles);
  const role = roles[id];
  return (
    <Box>
      <Typography component="h1" variant="h5">
        장소: {place} <br />
        역할: {role}
      </Typography>
    </Box>
  );
}
