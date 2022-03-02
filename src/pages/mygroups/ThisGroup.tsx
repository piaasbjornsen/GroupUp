import {Grid, Button, CssBaseline, Typography} from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import React, {useContext, useEffect, useState} from 'react';
import {groups as firebaseGroups} from '../../service/firebase';
import {interests as firebaseInterests} from '../../service/firebase';
import {users as firebaseUsers} from '../../service/firebase';
import GroupsIcon from '@mui/icons-material/Groups';
import {
  IFirebaseDb,
  IFirebaseGroup,
  IFirebaseInterest,
  IFirebaseUserId,
  IFirebaseUserName,
} from '../../interfaces/firebase';
import {Link, useParams} from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';

//Bruker i liste
interface IUserListItem {
  id: IFirebaseUserId;
  name: IFirebaseUserName;
}

//Gruppeobjekt
const emptyGroupObject = {
  name: '',
  description: '',
  interests: [],
  members: [],
};

const AddToList: React.FC = () => {
  const [input, setInput] = useState<IFirebaseGroup>(emptyGroupObject);
  const [interests, setInterests] = useState<IFirebaseInterest[]>([]);
  const [users, setUsers] = useState<IUserListItem[]>([]);
  const [group, setGroup] = useState<IFirebaseGroup | null>(null);
  const [resetForm, setResetForm] = useState(false);

  const urlParams = useParams();
  const user = useContext(AuthContext);

  useEffect(() => {
    console.log(urlParams);

    firebaseGroups.once('value', snapshot => {
      const groups: IFirebaseDb['groups'] = snapshot.val();
      if (groups[urlParams.groupId ?? ''] ?? false) {
        setGroup(groups[urlParams.groupId ?? '']);
        setInput(groups[urlParams.groupId ?? '']);
        console.log(groups[urlParams.groupId ?? '']);

        firebaseUsers.once('value', snapshot => {
          const users: IFirebaseDb['users'] = snapshot.val();
          const userList: IUserListItem[] = Object.keys(
            users
          ).map<IUserListItem>(userId => ({
            id: userId,
            name: users[userId].name,
          }));
          setUsers(userList);
          setResetForm(!resetForm);
        });
      } else {
        console.log('false');
      }
    });
    firebaseInterests.once('value', snapshot => {
      const interests = snapshot.val();
      setInterests(interests);
    });
  }, []);

  if (group === null || users === null || input === null) {
    return <p>Laster inn</p>;
  }

  if (!group.members?.includes(user?.uid ?? '')) {
    return (
      <>
        <>
          <CssBaseline />
          <Grid container justifyContent="center" marginTop={5}>
            {' '}
            {/* Overskriften på siden, hentet fra react */}
            <GroupsIcon fontSize="large" />
            <Typography variant="h4" marginLeft={2}>
              {group?.name}
            </Typography>
          </Grid>
        </>
        <Grid container justifyContent="center" marginTop={5}>
          {' '}
          {/* Beskrivelsen */}
          <Typography variant="body1" style={{width: 500}}>
            {group?.description}
          </Typography>
        </Grid>
        <Grid container justifyContent="center" marginTop={5}>
          <Typography variant="body1" style={{width: 500}}>
            {group?.members
              .map(
                (userId: IFirebaseUserId) =>
                  users.find(user => user.id === userId)?.name
              )
              .join(', ')}
          </Typography>
        </Grid>
        <Grid container justifyContent="center" marginTop={5}>
          <Typography variant="body1" style={{width: 500}}>
            {group?.interests.join(', ')}
          </Typography>
        </Grid>
      </>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = (): void => {
    if (urlParams?.groupId === '') {
      console.log('Invalid group');
      return;
    }

    const updatedData = {
      // Mulig vi må endre denne, da det er en bug når vi oppdaterer siden.
      ...group,
      ...input,
    };
    if (
      (updatedData?.name ?? '') === '' ||
      (updatedData?.description ?? '') === '' ||
      (updatedData?.members ?? []).length <= 1 ||
      (updatedData?.interests ?? []).length === 0
    ) {
      console.log('Invalid data');
      console.log(updatedData);
      console.log(
        (updatedData?.name ?? '') === '',
        (updatedData?.description ?? '') === '',
        (updatedData?.members ?? []).length <= 1,
        (updatedData?.interests ?? []).length === 0
      );
      return;
    }
    console.log(updatedData);
    firebaseGroups.child(urlParams?.groupId ?? '').update(updatedData);
  };

  return (
    <>
      <>
        <CssBaseline />
        <Grid container justifyContent="center" marginTop={5}>
          {' '}
          {/* Overskriften på siden, hentet fra react */}
          <GroupsIcon fontSize="large" />
          <Typography variant="h4" marginLeft={2}>
            {group?.name}
          </Typography>
        </Grid>
      </>
      <Grid container justifyContent="center" marginTop={3}>
        <Link to={'/groups/' + urlParams.groupId + '/findgroups'}>
          <Button variant={'contained'}>Finn andre grupper</Button>
        </Link>
      </Grid>
      <Grid container justifyContent="center" marginTop={5}>
        {' '}
        {/* Beskrivelsen */}
        <TextField
          style={{width: 500}}
          id="outlined-multiline-static"
          variant="standard"
          label="Beskrivelse"
          multiline
          rows={4}
          inputProps={{maxLength: 240}}
          onChange={handleChange}
          defaultValue={group?.description}
          name="description"
          InputLabelProps={{shrink: true}}
        />
      </Grid>
      <Grid container justifyContent="center" marginTop={5}>
        <Autocomplete
          key={'users' + resetForm}
          id="addUsers"
          multiple
          freeSolo
          style={{width: 500}}
          onChange={(
            event: React.SyntheticEvent,
            value: (string | IUserListItem)[]
          ) => {
            const userIds = value.map(userListItem =>
              typeof userListItem !== 'string' ? userListItem.id : userListItem
            );
            setInput({
              ...input,
              members: userIds,
            });
          }}
          defaultValue={group?.members.map(userId => {
            return (
              users.find(userItem => userItem.id === userId) ?? {
                id: '',
                name: 'Ugyldig bruker',
              }
            );
          })}
          options={users}
          getOptionLabel={option => option.name}
          renderInput={params => (
            <TextField {...params} label="Legg til medlemmer" />
          )}
        />
      </Grid>
      <Grid container justifyContent="center" marginTop={5}>
        <Autocomplete
          key={'interests' + resetForm}
          id="addInterests"
          multiple={true}
          freeSolo
          style={{width: 500}}
          onChange={(event: React.SyntheticEvent, value: string[]) => {
            setInput({
              ...input,
              interests: value,
            });
          }}
          defaultValue={group?.interests}
          options={interests}
          renderInput={params => (
            <TextField {...params} label="Legg til interesser" />
          )}
        />
      </Grid>
      <Grid container justifyContent="center" marginTop={5} marginBottom={10}>
        <Button variant="contained" onClick={handleClick}>
          Oppdater
        </Button>
      </Grid>
    </>
  );
};

export default AddToList;
