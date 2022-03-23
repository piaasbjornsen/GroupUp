import React from 'react';
import {Grid} from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Slider from '@mui/material/Slider';
import {availableLocations} from '../../utils/constants';

export interface IFilterOptions {
  interests: string[];
  location: string;
  fromDate: string;
  toDate: string;
  age: [number, number];
  memberCount: [number, number];
}

export const defaultFilterOptions: IFilterOptions = {
  interests: [],
  location: '',
  fromDate: '',
  toDate: '',
  age: [18, 100],
  memberCount: [1, 30],
};

export interface IMinMax {
  age: [number | null, number | null];
  memberCount: [number | null, number | null];
}

interface IFilterViewProps {
  filters: IFilterOptions;
  setFilters: React.Dispatch<IFilterOptions>;
  minmax: IMinMax;
  interests: string[];
}

export default function FilterView(props: IFilterViewProps) {
  const handleSliderChange = (
    element: 'memberCount' | 'age',
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    const minDistance = 1;

    const newFilters = {...props.filters};
    if (activeThumb === 0) {
      newFilters[element] = [
        Math.min(newValue[0], props.filters[element][1] - minDistance),
        props.filters[element][1],
      ];
    } else {
      newFilters[element] = [
        props.filters[element][0],
        Math.max(newValue[1], props.filters[element][0] + minDistance),
      ];
    }
    props.setFilters(newFilters);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFilters = {...props.filters};
    if (event.target.name !== 'toDate' && event.target.name !== 'fromDate') {
      return;
    }
    updatedFilters[event.target.name] = event.target.value;
    props.setFilters(updatedFilters);
  };

  return (
    <Grid container direction="row" marginTop={5} justifyContent="center">
      <Grid item sx={{m: 1}}>
        <Autocomplete
          id="addInterests"
          size="small"
          multiple={true}
          freeSolo
          style={{width: 250}}
          onChange={(event: React.SyntheticEvent, value: string[]) => {
            props.setFilters({...props.filters, interests: value});
          }}
          options={props.interests}
          renderInput={params => (
            <TextField {...params} label="Interesser" variant={'standard'} />
          )}
        />
      </Grid>
      <Grid item sx={{m: 1}}>
        <TextField
          variant={'standard'}
          type="date"
          size="small"
          label="Møte fra dato"
          value={props.filters.fromDate}
          onChange={handleDateChange}
          InputLabelProps={{shrink: true}}
          name="fromDate"
        />
      </Grid>
      <Grid item sx={{m: 1}}>
        <TextField
          variant={'standard'}
          type="date"
          size="small"
          label="Til dato"
          value={props.filters.toDate}
          onChange={handleDateChange}
          InputLabelProps={{shrink: true}}
          name="toDate"
        />
      </Grid>
      <Grid item sx={{m: 1}}>
        <Autocomplete
          multiple={false}
          freeSolo
          style={{width: 150}}
          size="small"
          options={availableLocations}
          renderInput={params => (
            <TextField {...params} label="Lokasjon" variant={'standard'} />
          )}
          onChange={(event: React.SyntheticEvent, value: string | null) => {
            props.setFilters({
              ...props.filters,
              location: value === null ? '' : value,
            });
          }}
        />
      </Grid>
      <Grid item sx={{ml: 4}}>
        Aldersspenn
        <Slider
          getAriaLabel={() => 'Minimum distance'}
          value={props.filters.age}
          onChange={(
            event: Event,
            newValue: number | number[],
            activeThumb: number
          ) => {
            return handleSliderChange('age', event, newValue, activeThumb);
          }}
          valueLabelDisplay="auto"
          getAriaValueText={() => 'Testtekst'}
          disableSwap
          min={
            props.minmax.age[0] !== null && !isNaN(props.minmax.age[0])
              ? props.minmax.age[0]
              : 1
          }
          max={
            props.minmax.age[1] !== null && !isNaN(props.minmax.age[1])
              ? props.minmax.age[1]
              : 30
          }
        />
      </Grid>
      <Grid item sx={{ml: 4}}>
        Gruppestørrelse
        <Slider
          getAriaLabel={() => 'Minimum distance'}
          value={props.filters.memberCount}
          onChange={(
            event: Event,
            newValue: number | number[],
            activeThumb: number
          ) => {
            return handleSliderChange(
              'memberCount',
              event,
              newValue,
              activeThumb
            );
          }}
          valueLabelDisplay="auto"
          getAriaValueText={() => 'testTds'}
          min={
            props.minmax.memberCount[0] !== null &&
            !isNaN(props.minmax.memberCount[0])
              ? props.minmax.memberCount[0]
              : 18
          }
          max={
            props.minmax.memberCount[1] !== null &&
            !isNaN(props.minmax.memberCount[1])
              ? props.minmax.memberCount[1]
              : 30
          }
          disableSwap
        />
      </Grid>
    </Grid>
  );
}
