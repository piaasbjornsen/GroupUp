import React from 'react';
import {Grid} from '@mui/material';
import 'typeface-roboto';
import {signOut} from '../../service/firebase';
import {Link} from 'react-router-dom';

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
        <Link to="/">Min side</Link>
        <a>Finn grupper</a>
        <a onClick={signOut} style={{cursor: 'pointer'}}>
          Logg ut
        </a>
        <Link to="/admin">Admin</Link>
      </Grid>
      <hr
        style={{
          width: '80%',
        }}
      />
    </Grid>
  );
}
