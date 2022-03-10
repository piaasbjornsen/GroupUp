import React from 'react';
import {Typography, Grid, CssBaseline} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import AddToList from './AddToList';

export default function CreateGroup() {
  return (
    <>
      <CssBaseline />
      <Grid container justifyContent="center" marginTop={5}>
        <GroupsIcon fontSize="large" />
        <Typography variant="h5" marginLeft={2}>
          Opprett gruppe
        </Typography>
        <AddToList />
      </Grid>
    </>
  );
}
