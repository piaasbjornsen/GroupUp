import React, {useState, useEffect} from 'react';
import {Grid, Box} from '@mui/material';
import {IFirebaseDb} from '../../interfaces/firebase';
import {
  groups as firebaseGroups,
  users as firebaseUsers,
} from '../../service/firebase';

export default function AdminPage() {
  const [groupList, setGroupList] = useState<IFirebaseDb['groups']>({});
  const [userList, setUserList] = useState<IFirebaseDb['users']>({});

  useEffect(() => {
    firebaseGroups.once('value', snapshot => {
      // Fetch groups
      const groups: IFirebaseDb['groups'] = snapshot.val();
      setGroupList(groups);
    });
    firebaseUsers.once('value', snapshot => {
      // Fetch users
      const users: IFirebaseDb['users'] = snapshot.val();
      setUserList(users);
    });
  }, []);

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
        {Object.entries(groupList).map(groupItemArray => (
          <Grid key={groupItemArray[0]} sx={{maxWidth: 400}}>
            <Box
              sx={{bgcolor: '#96AB94', m: '2em', p: '1em', borderRadius: '5%'}}
            >
              <p style={{fontWeight: 'bold', fontSize: '1.2em'}}>
                {groupItemArray[1].name}
              </p>
              <p>Beskrivelse: {groupItemArray[1].description}</p>
              <p>Interesser: {groupItemArray[1].interests?.join(', ')}</p>
              <p>Medlemmer:</p>
              {groupItemArray[1].members?.map(memberId => (
                <p style={{marginTop: '-0.5em'}} key={memberId}>
                  {userList[memberId]?.name}
                </p>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
