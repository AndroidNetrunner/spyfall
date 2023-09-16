import { useCallback, useState } from 'react';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import { useSelector } from 'react-redux';

import { Place } from '@/constants/places';

import useHandler from '@/app/hooks/useHandler';

import { selectAvailablePlaces, selectInvitationCode } from '@/redux/slices/gameSlice';

const textFieldStyles = {
  width: {
    xs: '100%',
    sm: '100%',
    md: '100%',
  },
  mt: 3,
  mb: 1,
};

export default function GuessingPlaceForm() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const availablePlaces = useSelector(selectAvailablePlaces);
  const { handleGuess } = useHandler();
  const invitationCode = useSelector(selectInvitationCode);

  if (!invitationCode) {
    return <p>초대 코드가 존재하지 않습니다.</p>;
  }

  const handleChange = useCallback((_: object, newValue: Place | null) => {
    setSelectedPlace(newValue);
  }, []);

  const handleButtonClick = useCallback(() => {
    if (invitationCode && selectedPlace) {
      void handleGuess(invitationCode, selectedPlace);
    }
  }, [handleGuess, invitationCode, selectedPlace]);

  return (
    <Box component="form">
      {availablePlaces && (
        <Autocomplete
          value={selectedPlace}
          onChange={handleChange}
          renderInput={params => (
            <TextField sx={textFieldStyles} {...params} label="맞힐 장소를 선택하세요." variant="outlined" />
          )}
          options={availablePlaces}
        />
      )}
      <Box display="grid" justifyContent="center">
        <Button disabled={!selectedPlace} variant="outlined" onClick={handleButtonClick}>
          장소 맞히기
        </Button>
      </Box>
    </Box>
  );
}
