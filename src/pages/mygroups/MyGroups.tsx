import React, {useState, useContext, useEffect} from 'react';
import {Grid, Button, Card, CardContent, Typography} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import {Link, useNavigate} from 'react-router-dom';
import {groups as firebaseGroups} from '../../service/firebase';
import {IFirebaseDb} from '../../interfaces/firebase';
import {AuthContext} from '../../context/AuthContext';

export default function MyGroups() {
  const user = useContext(AuthContext);
  const navigate = useNavigate();

  const [groupList, setGroupList] = useState<IFirebaseDb['groups']>({});

  useEffect(() => {
    firebaseGroups.once('value', snapshot => {
      // Fetch groups
      const groups: IFirebaseDb['groups'] = snapshot.val();
      Object.keys(groups).forEach(groupKey => {
        if (!groups[groupKey].members?.includes(user?.uid ?? '')) {
          // Remove groups that the user is not a member of
          delete groups[groupKey];
        }
      });
      setGroupList(groups);
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
      <GroupsIcon
        style={{fontSize: '400%', color: '#6E8B6B'}}
        sx={{mb: -1}}
      ></GroupsIcon>
      <Link to="/creategroup">
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
      </Link>

      <h1 style={{fontWeight: '300', fontSize: '4em'}}>Mine grupper</h1>
      <Grid
        container
        spacing={5}
        alignItems="stretch"
        sx={{width: {sx: 1, sm: '70%'}}}
      >
        {Object.keys(groupList).map(groupKey => (
          <Grid item key={groupKey} xs>
            <Card
              sx={{
                maxWidth: 245,
                minWidth: {sx: 'default', sm: 200},
                cursor: 'pointer',
              }}
              onClick={() => {
                navigate('/groups/' + groupKey);
              }}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  {groupList[groupKey].name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {groupList[groupKey].description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
