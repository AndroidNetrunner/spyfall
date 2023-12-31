import { Place } from '@/constants/places';
import { selectAvailablePlaces } from '@/redux/slices/gameSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { selectedCellStyle, defaultCellStyle, hintCellStyleSx } from './AvailablePlaces.styles';

const COLSPANS = 2;

export default function AvailablePlaces() {
  const availablePlaces = useSelector(selectAvailablePlaces);
  const [selectedPlaces, setSelectedPlaces] = useState<Set<Place>>(new Set());

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

  const getTableCell = (place?: Place) => (
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
  const getTableBody = (availablePlaces: Place[]) => {
    const rows = splitPlacesIntoRows(availablePlaces);

    return rows.map(row => (
      <TableRow key={row[0]}>
        {getTableCell(row[0])}
        {getTableCell(row[1])}
      </TableRow>
    ));
  };

  const splitPlacesIntoRows = (availablePlaces: Place[]): [Place, Place][] =>
    Array.from({ length: Math.ceil(availablePlaces.length / COLSPANS) }).map((_, idx) => {
      return [availablePlaces[2 * idx], availablePlaces[2 * idx + 1]];
    });

  return (
    <>
      {availablePlaces ? (
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
            <TableBody>{getTableBody(availablePlaces)}</TableBody>
          </Table>
        </TableContainer>
      ): null}
    </>
  );
}
