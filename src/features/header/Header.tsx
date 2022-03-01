import React, {useContext} from 'react';
import {Grid} from '@mui/material';
import 'typeface-roboto';
import {signOut} from '../../service/firebase';
import {Link} from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';

export default function Header() {
  const user = useContext(AuthContext);
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
        {user?.admin ? <Link to="/admin">Admin</Link> : null}
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
