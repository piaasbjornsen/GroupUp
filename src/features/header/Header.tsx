import React from 'react';
import {Grid} from '@mui/material';
import 'typeface-roboto';
import {signOut} from '../../service/firebase';

export default function Header() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{mb: 1}}
    >
      <h1 id="logo">GroupUp</h1>
      <Grid width="80%" display="flex" justifyContent="space-around">
        <a>Min side</a>
        <a>Finn grupper</a>
        <a onClick={signOut} style={{cursor: 'pointer'}}>
          Logg ut
        </a>
      </Grid>
      <hr
        style={{
          width: '80%',
        }}
      />
    </Grid>
  );
}
