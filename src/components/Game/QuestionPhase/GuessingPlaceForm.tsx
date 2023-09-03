import { Place } from '@/constants/places';
import useHandler from '@/hooks/useHandler';
import { selectAvailablePlaces, selectInvitationCode } from '@/redux/slices/gameSlice';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

export default function GuessingPlaceForm() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const availablePlaces = useSelector(selectAvailablePlaces);
  const { handleGuess } = useHandler();
  const invitationCode = useSelector(selectInvitationCode);
  if (!invitationCode) throw new Error('초대 코드가 존재하지 않음.');

  const handleChange = useCallback((_: object, newValue: Place | null) => {
    setSelectedPlace(newValue);
  }, []);
  return (
    <Box component="form">
      {availablePlaces && (
        <Autocomplete
          value={selectedPlace}
          onChange={handleChange}
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
              label="맞힐 장소를 선택하세요."
              variant="outlined"
            />
          )}
          options={availablePlaces}
        />
      )}
      <Box display="grid" justifyContent="center">
        <Button
          disabled={!selectedPlace}
          variant="outlined"
          onClick={() => void handleGuess(invitationCode, selectedPlace as Place)}>
          {' '}
          장소 맞히기
        </Button>
      </Box>
    </Box>
  );
}
