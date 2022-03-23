import React, {useState, useEffect} from 'react';
import {Grid, Box, Button} from '@mui/material';
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

  const handleClickGroupDelete = (groupId: string): void => {
    // Removing group
    firebaseGroups.child(groupId).remove();
    // Updating state once group is gone
    firebaseGroups.once('value', snapshot => {
      // Fetch groups
      const groups: IFirebaseDb['groups'] = snapshot.val();
      setGroupList(groups);
    });
  };

  const removeUserFromAllGroups = (memberId: string): void => {
    // NOTE: this does not update states, if called states should be updated
    Object.entries(groupList).forEach(groupData => {
      let userIndex = '';
      console.log('no');
      if (groupData[1].members?.includes(memberId)) {
        console.log('yes');
        userIndex = groupData[1].members.indexOf(memberId).toString();
        // removing user from group in database
        firebaseGroups
          .child(groupData[0])
          .child('members')
          .child(userIndex)
          .remove();
      }
    });
  };

  const handleClickUserRemove = (memberId: string, groupId: string): void => {
    // finding key of user in members list
    let userIndex = '';
    Object.entries(groupList).forEach(groupData => {
      if (groupData[0] === groupId) {
        userIndex = groupData[1].members.indexOf(memberId).toString();
        // removing user from group in database
        firebaseGroups
          .child(groupId)
          .child('members')
          .child(userIndex)
          .remove();
      }
    });
    // Updating state once user is out of group
    firebaseGroups.once('value', snapshot => {
      const groups: IFirebaseDb['groups'] = snapshot.val();
      setGroupList(groups);
    });
  };

  const handleClickUserDelete = (memberId: string): void => {
    // Removing user from all groups
    removeUserFromAllGroups(memberId);
    // Deleting from platform
    firebaseUsers.child(memberId).remove();
    // Updating state once user is gone
    firebaseUsers.once('value', snapshot => {
      const users: IFirebaseDb['users'] = snapshot.val();
      setUserList(users);
    });
    firebaseGroups.once('value', snapshot => {
      const groups: IFirebaseDb['groups'] = snapshot.val();
      setGroupList(groups);
    });
  };

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
              <Button onClick={() => handleClickGroupDelete(groupItemArray[0])}>
                Slett gruppe
              </Button>
              <p style={{fontWeight: 'bold', fontSize: '1.2em'}}>
                {groupItemArray[1].name}
              </p>
              <p>Beskrivelse: {groupItemArray[1].description}</p>
              <p>Interesser: {groupItemArray[1].interests?.join(', ')}</p>
              <p>Medlemmer:</p>
              {groupItemArray[1].members?.map(memberId => (
                <div key={memberId}>
                  <p style={{marginTop: '-0.5em'}}>
                    {userList[memberId]?.name}
                  </p>
                  <Button onClick={() => handleClickUserDelete(memberId)}>
                    plattform
                  </Button>
                  <Button
                    onClick={() =>
                      handleClickUserRemove(memberId, groupItemArray[0])
                    }
                  >
                    gruppe
                  </Button>
                </div>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
