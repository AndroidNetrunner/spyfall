import { Place } from '@/constants/places';
import { selectAvailablePlaces } from '@/redux/slices/gameSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export default function AvailablePlaces() {
  const availablePlaces = useSelector(selectAvailablePlaces);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);

  if (!availablePlaces) return <></>;

  const handleSelectPlace = (place: Place) => {
    if (selectedPlaces.includes(place)) {
      setSelectedPlaces(prev => prev.filter(p => p !== place));
    } else {
      setSelectedPlaces(prev => [...prev, place]);
    }
  };

  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={2}>
              장소 목록
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: Math.ceil(availablePlaces.length / 2) }).map((_, idx) => {
            const firstPlace = availablePlaces[2 * idx];
            const secondPlace = availablePlaces[2 * idx + 1];
            return (
              <TableRow key={firstPlace}>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ color: selectedPlaces.includes(firstPlace) ? 'grey' : 'inherit' }}
                  onClick={() => handleSelectPlace(firstPlace)}>
                  {firstPlace}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ color: secondPlace && selectedPlaces.includes(secondPlace) ? 'grey' : 'inherit' }}
                  onClick={() => secondPlace && handleSelectPlace(secondPlace)}>
                  {secondPlace || ''}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
