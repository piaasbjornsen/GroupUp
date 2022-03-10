import {Grid, Button} from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import React, {useContext, useEffect, useState} from 'react';
import {groups as firebaseGroups} from '../../service/firebase';
import {interests as firebaseInterests} from '../../service/firebase';
import {users as firebaseUsers} from '../../service/firebase';
import {
  IFirebaseDb,
  IFirebaseGroup,
  IFirebaseInterest,
  IFirebaseUserId,
  IFirebaseUserName,
} from '../../interfaces/firebase';
import {useNavigate} from 'react-router-dom';
import validateGroupData, {
  emptyErrorMessages,
  groupHasErrorMessages,
  IErrorMessages,
} from '../../utils/validateGroupData';
import {ContainedAlert} from '../../features/containedalert/ContainedAlert';
import {AuthContext} from '../../context/AuthContext';
import {availableLocations, emptyGroupObject} from '../../utils/constants';

interface IUserListItem {
  id: IFirebaseUserId;
  name: IFirebaseUserName;
}

const AddToList: React.FC = () => {
  const currentUser = useContext(AuthContext);

  const [input, setInput] = useState<IFirebaseGroup>(emptyGroupObject);
  const [interests, setInterests] = useState<IFirebaseInterest[]>([]);
  const [users, setUsers] = useState<IUserListItem[]>([]);
  const [errorMessages, setErrorMessages] =
    useState<IErrorMessages>(emptyErrorMessages);

  const [resetForm, setResetForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    firebaseUsers.once('value', snapshot => {
      const users: IFirebaseDb['users'] = snapshot.val();
      const userList: IUserListItem[] = Object.keys(users).map<IUserListItem>(
        userId => ({id: userId, name: users[userId].name})
      );
      setUsers(userList);
    });
    firebaseInterests.once('value', snapshot => {
      const interests = snapshot.val();
      setInterests(interests);
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = (): void => {
    // Add current user to the group
    if (
      !input.members.includes(currentUser?.uid ?? '') &&
      currentUser !== null
    ) {
      input.members.push(currentUser?.uid);
      console.log('Added user to group');
    }

    const updatedErrorMessages = validateGroupData(input);

    if (groupHasErrorMessages(updatedErrorMessages)) {
      setErrorMessages(updatedErrorMessages);
      return;
    }

    firebaseGroups.push(input).then(newReference => {
      console.log(newReference.key);

      navigate('/groups/' + newReference.key);
    });

    setInput(emptyGroupObject);

    setResetForm(!resetForm);
  };

  return (
    <>
      <Grid container justifyContent="center" marginTop={2}>
        {errorMessages.name === '' ? null : (
          <ContainedAlert message={errorMessages.name} />
        )}
        <TextField
          style={{width: 500}}
          required
          size="small"
          id="outlined-required"
          label="Gruppenavn"
          onChange={handleChange}
          value={input.name}
          name="name"
        />
      </Grid>
      <Grid container justifyContent="center" marginTop={2}>
        {errorMessages.description === '' ? null : (
          <ContainedAlert message={errorMessages.description} />
        )}
        <TextField
          style={{width: 500}}
          size="small"
          id="outlined-multiline-static"
          label="Beskrivelse"
          multiline
          rows={4}
          inputProps={{maxLength: 240}}
          onChange={handleChange}
          value={input.description}
          name="description"
        />
      </Grid>
      <Grid container justifyContent="center" marginTop={2}>
        {errorMessages.members === '' ? null : (
          <ContainedAlert message={errorMessages.members} />
        )}
        <Autocomplete
          key={'users' + resetForm}
          id="addUsers"
          size="small"
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
          options={users}
          getOptionLabel={option => option.name}
          renderInput={params => (
            <TextField {...params} label="Legg til medlemmer" />
          )}
        />
      </Grid>
      <Grid container justifyContent="center" marginTop={2}>
        {errorMessages.interests === '' ? null : (
          <ContainedAlert message={errorMessages.interests} />
        )}
        <Autocomplete
          key={'interests' + resetForm}
          id="addInterests"
          size="small"
          multiple={true}
          freeSolo
          style={{width: 500}}
          onChange={(event: React.SyntheticEvent, value: string[]) => {
            setInput({
              ...input,
              interests: value,
            });
          }}
          options={interests}
          renderInput={params => (
            <TextField {...params} label="Legg til interesser" />
          )}
        />
      </Grid>
      <Grid container justifyContent="center" marginTop={2}>
        {errorMessages.location === '' ? null : (
          <ContainedAlert message={errorMessages.location} />
        )}
        <Autocomplete
          key={'location' + resetForm}
          id="addLocation"
          multiple={false}
          freeSolo
          style={{width: 500}}
          size="small"
          options={availableLocations}
          renderInput={params => (
            <TextField {...params} label="Legg til lokasjon" />
          )}
          onChange={(event: React.SyntheticEvent, value: string | null) => {
            setInput({
              ...input,
              location: value ?? '',
            });
          }}
        />
      </Grid>
      <Grid container justifyContent="center" marginTop={2} marginBottom={1}>
        {errorMessages.imageUrl === '' ? null : (
          <ContainedAlert message={errorMessages.imageUrl} />
        )}
        <TextField
          style={{width: 500}}
          id="outlined-multiline-static"
          label="Gruppebilde"
          rows={4}
          inputProps={{maxLength: 240}}
          onChange={handleChange}
          size="small"
          name="imageUrl"
        />
      </Grid>
      <Grid container justifyContent="center" marginTop={2} marginBottom={10}>
        <Button variant="contained" onClick={handleClick}>
          Legg til gruppe
        </Button>
      </Grid>
    </>
  );
};

export default AddToList;
