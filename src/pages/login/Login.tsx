import React from 'react';
import {Grid, Button} from '@mui/material';

export default function Login() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{minHeight: '100vh'}}
    >
      <Grid item xs={3} sx={{p: 1}}>
        <h1>GroupUp</h1>
        <p>Login to connect with your future friends</p>
        <Button variant="contained" sx={{mt: 1}}>
          Login using Google
        </Button>
      </Grid>
    </Grid>
  );
}
