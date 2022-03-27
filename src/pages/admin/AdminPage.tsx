import React, {useState, useEffect} from 'react';
import {
  Grid,
  Button,
  CardContent,
  Card,
  CardMedia,
  Fab,
  Typography,
  Stack,
  CardActions,
} from '@mui/material';
import {IFirebaseDb} from '../../interfaces/firebase';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import Popper from '@mui/material/Popper';
import PopupState, {bindToggle, bindPopper} from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import {
  groups as firebaseGroups,
  users as firebaseUsers,
} from '../../service/firebase';
import {defaultGroupImageUrl} from '../../utils/constants';

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
    // removing all references to group in other group objects (likes and matches)
    Object.entries(groupList).forEach(groupData => {
      if (groupData[1].matches?.length > 0) {
        Object.entries(groupData[1]?.matches).forEach(match => {
          if (match[1].id === groupId) {
            firebaseGroups
              .child(groupData[0])
              .child('matches')
              .child(match[0])
              .remove();
          }
        });
      }
      if (groupData[1].likes?.length > 0) {
        console.log('1');
        Object.entries(groupData[1]?.likes).forEach(like => {
          if (like[1].id === groupId) {
            console.log('2');
            firebaseGroups
              .child(groupData[0])
              .child('likes')
              .child(like[0])
              .remove();
          }
        });
      }
    });

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
    // iterating through all groups and finding key for user to be removed
    Object.entries(groupList).forEach(groupData => {
      let userIndex = '';
      if (groupData[1].members?.includes(memberId)) {
        if (groupData[1].members.length === 1) {
          // Delete the group if the last user was deleted
          handleClickGroupDelete(groupData[0]);
        }
        if (groupData[1].groupAdmin === memberId) {
          // Update group admin if removed
          firebaseGroups
            .child(groupData[0])
            .child('groupAdmin')
            .set(groupData[1].members.filter(memId => memId !== memberId)[0]);
        }
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
    console.log(groupList[groupId].members.length);
    if (groupList[groupId].members.length === 1) {
      handleClickGroupDelete(groupId);
      return;
    }
    if (groupList[groupId].groupAdmin === memberId) {
      // Update group admin if removed
      firebaseGroups
        .child(groupId)
        .child('groupAdmin')
        .set(groupList[groupId].members.filter(memId => memId !== memberId)[0]);
    }
    Object.entries(groupList).forEach(groupData => {
      if (groupData[0] === groupId) {
        userIndex = Object.entries(groupData[1].members)
          .filter(memberData => memberData[1] === memberId)
          .map(memberData => memberData[0])[0];
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
        margin="auto"
      >
        {Object.entries(groupList).map(groupItemArray => (
          <Grid key={groupItemArray[0]} sx={{maxWidth: 400}} marginBottom={5}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: 260,
                minWidth: {sx: 'default', sm: 300},
                minHeight: '100%',
              }}
            >
              <CardMedia
                component="img"
                height="160"
                image={groupItemArray[1].imageUrl ?? defaultGroupImageUrl}
                alt="Gruppebilde"
              />
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                }}
              >
                <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                  {groupItemArray[1].name}
                </Typography>
                <Typography variant="body1" marginBottom={1}>
                  {groupItemArray[1].description}
                </Typography>
                <Typography variant="body1" marginBottom={1}>
                  Interesser: {groupItemArray[1].interests?.join(', ')}
                </Typography>
                <Typography
                  variant="body1"
                  marginBottom={1}
                  sx={{fontWeight: 'bold'}}
                >
                  Medlemmer
                </Typography>
                {Object.values(groupItemArray[1].members)?.map(memberId => (
                  <Grid
                    container
                    item
                    direction="column"
                    key={memberId}
                    justifyContent="center"
                    marginBottom={2}
                  >
                    <Grid container item direction="row" alignItems="center">
                      <Typography
                        variant="body1"
                        style={{marginTop: '-0.5em'}}
                        sx={{flexGrow: 1}}
                      >
                        {userList[memberId]?.name}
                      </Typography>
                      {(userList[memberId]?.reports?.length ?? 0) > 0 ? (
                        <PopupState
                          variant="popper"
                          popupId="demo-popup-popper"
                        >
                          {popupState => (
                            <Stack direction="row" spacing={2}>
                              <Grid>
                                <Fab
                                  color="error"
                                  size="small"
                                  {...bindToggle(popupState)}
                                >
                                  <PriorityHighIcon />
                                </Fab>
                              </Grid>
                              <Popper {...bindPopper(popupState)} transition>
                                {({TransitionProps}) => (
                                  <Fade {...TransitionProps} timeout={350}>
                                    <Paper>
                                      {userList[memberId]?.reports?.map(
                                        //hvor skal denne?
                                        report => (
                                          <Typography
                                            key={report.reportedBy}
                                            margin={1}
                                          >
                                            <p>
                                              Raportert av:{' '}
                                              {userList[report.reportedBy].name}
                                              <br />
                                              Begrunnelse: {report.reason}
                                            </p>
                                          </Typography>
                                        )
                                      )}
                                    </Paper>
                                  </Fade>
                                )}
                              </Popper>
                            </Stack>
                          )}
                        </PopupState>
                      ) : null}
                    </Grid>
                    <Grid container item direction="row" alignItems="center">
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{marginBottom: 0.5}}
                        onClick={() =>
                          handleClickUserRemove(memberId, groupItemArray[0])
                        }
                      >
                        Fjern fra gruppe
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{marginBottom: 0.5}}
                        onClick={() => handleClickUserDelete(memberId)}
                      >
                        Slett fra plattform
                      </Button>
                    </Grid>
                  </Grid>
                ))}
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  onClick={() => handleClickGroupDelete(groupItemArray[0])}
                >
                  Slett gruppe
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
