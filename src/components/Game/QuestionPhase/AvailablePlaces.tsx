import { Place } from '@/constants/places';
import { selectAvailablePlaces } from '@/redux/slices/gameSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { selectedCellStyle, defaultCellStyle, hintCellStyleSx } from './AvailablePlaces.styles';

export default function AvailablePlaces() {
  const availablePlaces = useSelector(selectAvailablePlaces);
  const [selectedPlaces, setSelectedPlaces] = useState<Set<Place>>(new Set());

  const COLSPANS = 2;

  const renderTableCell = (place?: Place) => (
    <TableCell
      component="th"
      scope="row"
      sx={{
        ...(place && selectedPlaces.has(place) ? selectedCellStyle : defaultCellStyle),
      }}
      onClick={() => place && toggleSelectedPlace(place)}>
      {place || ''}
    </TableCell>
  );

  const isPlaceSelected = (place: Place): boolean => selectedPlaces.has(place);

  const toggleSelectedPlace = (place: Place) => {
    const newSelectedPlaces = new Set(selectedPlaces);

    if (isPlaceSelected(place)) {
      newSelectedPlaces.delete(place);
    } else {
      newSelectedPlaces.add(place);
    }

    setSelectedPlaces(newSelectedPlaces);
  };

  return (
    <>
      {availablePlaces && (
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={2}>
                  장소 목록
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center" colSpan={2} sx={hintCellStyleSx}>
                  장소를 클릭하면 후보에서 제외할 수 있습니다.
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: Math.ceil(availablePlaces.length / COLSPANS) }).map((_, idx) => {
                const firstPlace = availablePlaces[2 * idx];
                const secondPlace = availablePlaces[2 * idx + 1];
                return (
                  <TableRow key={firstPlace}>
                    {renderTableCell(firstPlace)}
                    {renderTableCell(secondPlace)}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
