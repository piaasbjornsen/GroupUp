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
        sx={{py: 1}}
      >
        <Grid
          container
          item
          direction="column"
          width={1 / 2}
          alignItems="center"
        >
          <Typography variant="body2">GroupUp © Gruppe 34</Typography>
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
