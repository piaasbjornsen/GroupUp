import React from 'react';
import {Grid, IconButton, Box} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface GroupInterface {
  groupID: number;
  title: string;
  description: string;
  interests: string[];
  members: string[];
}

export default function AdminPage() {
  const groups: GroupInterface[] = [
    {
      groupID: 1,
      title: 'Gruppe 1',
      description: 'Kul gruppe',
      interests: ['Spill'],
      members: ['Ellie'],
    },
    {
      groupID: 2,
      title: 'Gruppe 2',
      description: 'Kul gruppe',
      interests: ['Spill', 'mjau'],
      members: ['Pål', 'Olav'],
    },
    {
      groupID: 3,
      title: 'Gruppe 3',
      description: 'VI ER BEST',
      interests: ['Spill', 'mjau'],
      members: ['Pål', 'Olav'],
    },
    {
      groupID: 3,
      title: 'Gruppe 4',
      description: 'MJAU',
      interests: ['fotball', 'hest'],
      members: ['Pål', 'Ole'],
    },
    {
      groupID: 5,
      title: 'Gruppe 5',
      description: 'Kul gruppe',
      interests: ['Spill'],
      members: ['Ellie'],
    },
    {
      groupID: 6,
      title: 'Gruppe 6',
      description: 'Kul gruppe',
      interests: ['Spill', 'mjau'],
      members: ['Pål', 'Olav'],
    },
    {
      groupID: 7,
      title: 'Gruppe 7',
      description: 'VI ER BEST',
      interests: ['Spill', 'mjau'],
      members: ['Pål', 'Olav'],
    },
    {
      groupID: 8,
      title: 'Gruppe 8',
      description: 'MJAU',
      interests: ['fotball', 'hest'],
      members: ['Pål', 'Ole'],
    },
  ];

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <h1 style={{fontWeight: '300', fontSize: '4em'}}>Admin</h1>

      <Grid
        display="flex"
        justifyContent="space-around"
        flexWrap="wrap"
        width="80%"
        margin="0 auto"
      >
        {groups.map(group => (
          <Grid key={group.groupID}>
            <Box
              sx={{bgcolor: '#96AB94', m: '2em', p: '1em', borderRadius: '5%'}}
            >
              <p style={{fontWeight: 'bold', fontSize: '1.2em'}}>
                {group.title}
              </p>
              <p>Beskrivelse: {group.description}</p>
              <p>Interesser: {group.interests.join(', ')}</p>
              <p>Medlemmer:</p>
              {group.members.map(member => (
                <p style={{marginTop: '-0.5em'}} key={group.groupID}>
                  {member}{' '}
                  <IconButton>
                    <ClearIcon fontSize="small"></ClearIcon>
                  </IconButton>
                </p>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
