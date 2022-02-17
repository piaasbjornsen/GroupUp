import {Typography, Grid, CssBaseline} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import React, {useState} from 'react';
import AddToList from './AddToList';

export interface IState {
  groups: {
    gruppenavn: String;
    beskrivelse?: String;
    interesser?: String[];
    medlemmer?: String[];
  }[];
}

export default function CreateGroup() {
  const [groups, setGroups] = useState<IState['groups']>([]);

  return (
    <>
      <CssBaseline />
      <Grid container justifyContent="center" marginTop={13}>
        <GroupsIcon fontSize="large" />
        <Typography variant="h4" marginLeft={2}>
          Opprett gruppe
        </Typography>
        <AddToList groups={groups} setGroups={setGroups} />
      </Grid>
    </>
  );
}
