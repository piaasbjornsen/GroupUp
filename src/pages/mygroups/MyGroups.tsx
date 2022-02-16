import React from 'react';
import {Grid, Button} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';

export default function MyGroups() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <GroupsIcon
        style={{fontSize: '400%', color: '#6E8B6B'}}
        sx={{mb: -1}}
      ></GroupsIcon>
      <Button
        id="assignGroup"
        variant="contained"
        size="small"
        style={{
          color: 'black',
        }}
        sx={{mb: -5}}
      >
        Opprett Gruppe
      </Button>

      <h1 style={{fontWeight: '300', fontSize: '4em'}}>Mine grupper</h1>
    </Grid>
  );
}
