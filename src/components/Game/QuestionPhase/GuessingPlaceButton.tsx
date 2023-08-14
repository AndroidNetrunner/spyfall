import { Place } from '@/constants/places';
import useCreateHandler from '@/hooks/useCreateHandler';
import { selectAvailablePlaces, selectInvitationCode } from '@/redux/slices/gameSlice';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function GuessingPlaceButton() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const availablePlaces = useSelector(selectAvailablePlaces);
  const { handleGuess } = useCreateHandler();
  const invitationCode = useSelector(selectInvitationCode);
  if (!invitationCode) throw new Error('초대 코드가 존재하지 않음.');

  return (
    <Box alignItems="center" justifyContent="center" component="form">
      {availablePlaces && (
        <Autocomplete
          value={selectedPlace}
          onChange={(e, newValue) => {
            e.preventDefault();
            setSelectedPlace(newValue);
          }}
          renderInput={params => (
            <TextField
              sx={{
                width: {
                  xs: '100%',
                  sm: '50%',
                  md: 200,
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
