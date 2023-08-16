import useCreateHandler from '@/hooks/useCreateHandler';
import { selectPlayers } from '@/redux/slices/gameSlice';
import { selectId, selectUser } from '@/redux/slices/userSlice';
import { UserId } from '@/types/isValidUserId';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import { useSelector } from 'react-redux';

export default function AccusationButton({ setCanAccuse }: { setCanAccuse: Dispatch<SetStateAction<boolean>> }) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null | undefined>(null);
  const myUserId = useSelector(selectId);
  if (!myUserId) throw new Error('유저 id가 존재하지 않음.');
  const availablePlayers = useSelector(selectPlayers).filter(player => player.id !== myUserId);
  const { invitationCode } = useSelector(selectUser);
  if (!invitationCode) throw new Error('초대 코드가 존재하지 않음.');
  const { handleAccuse } = useCreateHandler();
  return (
    <Box component="form">
      {availablePlayers && (
        <Autocomplete
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(e, newValue) => {
            e.preventDefault();
            setSelectedPlayer(newValue?.id);
          }}
          renderInput={params => (
            <TextField
              sx={{
                width: {
                  xs: '100%',
                  sm: '100%',
                  md: '100%',
                },
                mt: 3,
                mb: 1,
              }}
              {...params}
              label="고발할 사람을 선택하세요."
              variant="outlined"
              color="warning"
            />
          )}
          options={availablePlayers.map(player => {
            return { id: player.id, value: player.nickname };
          })}
          getOptionLabel={option => option.value}
        />
      )}
      <Box display="flex" justifyContent="center">
        <Button
          color="error"
          disabled={!selectedPlayer}
          variant="outlined"
          onClick={() => {
            void handleAccuse(invitationCode, myUserId, selectedPlayer as UserId);
            setCanAccuse(false);
          }}>
          고발하기
        </Button>
      </Box>
    </Box>
  );
}
