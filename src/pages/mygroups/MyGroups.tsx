import React, {useState, useContext, useEffect} from 'react';
import {Grid, Card, CardContent, Typography, CardMedia} from '@mui/material';
import {groups as firebaseGroups} from '../../service/firebase';
import {IFirebaseDb} from '../../interfaces/firebase';
import {AuthContext} from '../../context/AuthContext';
import {defaultGroupImageUrl} from '../../utils/constants';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {setCurrentGroup} from '../../redux/currentGroupSlice';
import {ContainedAlert} from '../../features/containedalert/ContainedAlert';

export default function MyGroups() {
  const {currentUser} = useContext(AuthContext);

  const currentGroup = useSelector((state: RootState) => state.currentGroup);
  const dispatch = useDispatch();

  const [groupList, setGroupList] = useState<IFirebaseDb['groups']>({});

  useEffect(() => {
    firebaseGroups.once('value', snapshot => {
      // Fetch groups
      const groups: IFirebaseDb['groups'] = snapshot.val();
      setGroupList(groups);
    });
  }, []);

  if (currentUser?.uid === undefined) {
    return <ContainedAlert severity="info" message="Laster inn bruker..." />;
  }

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      marginBottom={10}
      marginTop={10}
    >
      <Typography variant="h2">Velg gruppe</Typography>
      <Typography variant="subtitle1">
        Velg gruppen du vil operere som.
      </Typography>
      <Grid
        container
        spacing={5}
        alignItems="stretch"
        marginTop={5}
        sx={{width: {sx: 1, sm: '70%'}}}
      >
        {Object.keys(groupList)
          .filter(groupKey =>
            groupList[groupKey].members.includes(currentUser.uid)
          )
          .map(groupKey => (
            <Grid item key={groupKey} xs sx={{minHeight: '100%'}}>
              <Card
                sx={{
                  maxWidth: 245,
                  minWidth: {sx: 'default', sm: 250},
                  cursor: 'pointer',
                  minHeight: '100%',
                }}
                onClick={() => {
                  dispatch(
                    setCurrentGroup({
                      groupId: groupKey,
                      group: groupList[groupKey],
                    })
                  );
                }}
                style={{
                  border:
                    currentGroup.groupId === groupKey
                      ? '5px solid gold'
                      : '5px solid transparent',
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={groupList[groupKey].imageUrl ?? defaultGroupImageUrl}
                  alt="Gruppebilde"
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    {groupList[groupKey].name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Grid>
  );
}
