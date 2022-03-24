import {
  Grid,
  Button,
  Typography,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
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
import {setCurrentGroup} from '../../redux/currentGroupSlice';
import {useDispatch} from 'react-redux';

interface IUserListItem {
  id: IFirebaseUserId;
  name: IFirebaseUserName;
}

const AddToList: React.FC = () => {
  const {currentUser} = useContext(AuthContext);
  const dispatch = useDispatch();
  const [input, setInput] = useState<IFirebaseGroup>(emptyGroupObject);
  const [interests, setInterests] = useState<IFirebaseInterest[]>([]);
  const [users, setUsers] = useState<IUserListItem[]>([]);
  const [errorMessages, setErrorMessages] =
    useState<IErrorMessages>(emptyErrorMessages);
  const [resetForm, setResetForm] = useState(false);
  const navigate = useNavigate();
  //Select
  const [meetingTime, setMeetingTime] = React.useState<string>('');

  const handleChangeSelect = (e: SelectChangeEvent) => {
    setMeetingTime(e.target.value);
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

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

    input.groupAdmin = currentUser?.uid ?? '';

    const updatedErrorMessages = validateGroupData(input);

    if (groupHasErrorMessages(updatedErrorMessages)) {
      setErrorMessages(updatedErrorMessages);
      return;
    }

    firebaseGroups.push(input).then(newReference => {
      console.log(newReference.key);
      dispatch(
        setCurrentGroup({
          groupId: newReference.key ?? '',
          group: input,
        })
      );
      navigate('/');
    });

    setInput(emptyGroupObject);

    setResetForm(!resetForm);
  };

  return (
    <>
      <Grid
        sx={{
          width: '100%',
          height: '300px',
          backgroundImage:
            'url(' +
            ((input?.imageUrl ?? '') !== ''
              ? input.imageUrl
              : '/assets/background_image.jpg') +
            ')',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      ></Grid>
      <Grid
        container
        item
        sx={{width: '80%', marginX: 'auto'}}
        justifyContent="center"
        marginTop={3}
      >
        <Typography variant="h4" marginLeft={2}>
          Opprett gruppe
        </Typography>
        <Grid
          container
          item
          justifyContent="center"
          marginTop={2}
          marginBottom={3}
        >
          {errorMessages.name === '' ? null : (
            <ContainedAlert message={errorMessages.name} />
          )}
          <TextField
            style={{width: 500}}
            variant={'standard'}
            required
            size="small"
            id="outlined-required"
            label="Gruppenavn"
            onChange={handleChange}
            value={input.name}
            name="name"
          />
          <Grid container item justifyContent="center" marginTop={2}>
            {errorMessages.description === '' ? null : (
              <ContainedAlert message={errorMessages.description} />
            )}
            <TextField
              style={{width: 500}}
              variant={'standard'}
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
        </Grid>
        <Grid container item flexDirection={'column'} width={1 / 2}>
          <Grid container item justifyContent="center" marginTop={2}>
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
                  typeof userListItem !== 'string'
                    ? userListItem.id
                    : userListItem
                );
                setInput({
                  ...input,
                  members: userIds,
                });
              }}
              options={users}
              getOptionLabel={option => option.name}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Inviter medlemmer"
                  variant={'standard'}
                />
              )}
            />
          </Grid>
          <Grid container item justifyContent="center" marginTop={2}>
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
                <TextField
                  {...params}
                  label="Legg til interesser"
                  variant={'standard'}
                />
              )}
            />
          </Grid>
          <Grid container item justifyContent="center" marginTop={2}>
            <TextField
              style={{width: 500}}
              variant="standard"
              required
              size="small"
              id="outlined-required"
              type="date"
              label="Møtedato"
              InputLabelProps={{shrink: true}}
              onChange={handleChange}
              value={input.meetingDate ?? new Date(2000, 0, 1)}
              name="meetingDate"
            />
          </Grid>
        </Grid>
        <Grid container item flexDirection={'column'} width={1 / 2}>
          <Grid container item justifyContent="center" marginTop={1.77}>
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
                <TextField {...params} label="Lokasjon" variant={'standard'} />
              )}
              onChange={(event: React.SyntheticEvent, value: string | null) => {
                setInput({
                  ...input,
                  location: value ?? '',
                });
              }}
            />
          </Grid>
          <Grid
            container
            item
            justifyContent="center"
            marginTop={2}
            marginBottom={1}
          >
            {errorMessages.imageUrl === '' ? null : (
              <ContainedAlert message={errorMessages.imageUrl} />
            )}
            <TextField
              style={{width: 500}}
              variant={'standard'}
              id="outlined-multiline-static"
              label="Gruppebilde (url)"
              rows={4}
              inputProps={{maxLength: 240}}
              onChange={handleChange}
              size="small"
              name="imageUrl"
            />
          </Grid>
          <Grid
            container
            item
            justifyContent="center"
            marginTop={1}
            marginBottom={1}
          >
            <FormControl variant="standard" sx={{minWidth: 510}}>
              <InputLabel id="demo-simple-select-filled-label">
                Møtefrekvens
              </InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={meetingTime}
                name="meetingFrequency"
                onChange={handleChangeSelect}
              >
                <MenuItem value={'Gruppen ønsker å møtes 1 gang'}>1</MenuItem>
                <MenuItem value={'Gruppen ønsker å møtes 1-3 ganger'}>
                  1-3
                </MenuItem>
                <MenuItem value={'Gruppen ønsker å møtes 3-5 ganger'}>
                  3-5
                </MenuItem>
                <MenuItem value={'Gruppen ønsker å møtes mer enn 5 ganger'}>
                  5+
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container item justifyContent="center" marginTop={5}>
          <Button variant="outlined" onClick={handleClick}>
            Opprett gruppe
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default AddToList;
