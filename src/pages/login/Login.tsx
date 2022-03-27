import React from 'react';
import {Grid, Button, Typography} from '@mui/material';
import {signInWithGoogle} from '../../service/firebase';
import {Link} from 'react-router-dom';

export default function Login() {
  return (
    <Grid>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{
          minHeight: '100vh',
          backgroundImage: 'url("/assets/background_image.jpg")',
        }}
      >
        <Grid style={{position: 'absolute', top: 10, left: 10}}>
          <Link to="/">
            <img src="assets/groupup_logo.png" />
          </Link>
        </Grid>
        <Typography variant="h1" style={{color: 'white'}} marginBottom={10}>
          Velkommen til GroupUp!
        </Typography>
        <Button
          variant="contained"
          sx={{mt: 1}}
          onClick={signInWithGoogle}
          size="large"
        >
          Login using Google
        </Button>
      </Grid>
    </Grid>
  );
}
