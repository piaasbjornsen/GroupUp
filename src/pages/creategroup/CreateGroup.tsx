import React, {useState} from 'react';
import {Typography, Grid, CssBaseline} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import AddToList from './AddToList';
import {IGroup} from '../../interfaces/groups';

export default function CreateGroup() {
  const [groups, setGroups] = useState<IGroup[]>([]);

  return (
    <>
      <CssBaseline />
      <Grid container justifyContent="center" marginTop={5}>
        <GroupsIcon fontSize="large" />
        <Typography variant="h4" marginLeft={2}>
          Opprett gruppe
        </Typography>
        <AddToList groups={groups} setGroups={setGroups} />
      </Grid>
    </>
  );
}
