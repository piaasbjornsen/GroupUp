import React from 'react';
import {Grid, Typography} from '@mui/material';

export default function Footer() {
  return (
    <Grid container marginTop={10} flexGrow={1} alignItems="flex-end">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        height="fit-content"
        sx={{py: 1, backgroundColor: '#a3a3a3'}}
      >
        <Grid
          container
          item
          direction="row"
          width={1 / 2}
          alignItems="center"
          justifyContent="center"
        >
          <img src="/assets/groupup_logo_black.png" style={{height: '40px'}} />
          <Typography variant="body2" marginLeft={1}>
            © Gruppe 34
          </Typography>
        </Grid>
        <Grid
          container
          item
          direction="column"
          width={1 / 2}
          alignItems="center"
        >
          <Typography variant="body2">
            Bidra på{' '}
            <a
              href="https://gitlab.stud.idi.ntnu.no/tdt4140-2022/landsby-2/gruppe_34/groupup"
              target="_blank"
              rel="noreferrer"
            >
              Gitlab
            </a>
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
