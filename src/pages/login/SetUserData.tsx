import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {IFirebaseUser} from '../../interfaces/firebase';
import {emptyUserObject} from '../../utils/constants';
import {users as firebaseUsers} from '../../service/firebase';
import validateUserData, {
  emptyErrorMessages,
  userHasErrorMessages,
  IErrorMessages,
} from '../../utils/validateUserData';
import {ContainedAlert} from '../../features/containedalert/ContainedAlert';
import {AuthContext} from '../../context/AuthContext';
import {useNavigate} from 'react-router-dom';

export default function SetUserData() {
  const navigate = useNavigate();
  const [input, setInput] = useState<IFirebaseUser>(emptyUserObject);
  const [errorMessages, setErrorMessages] =
    useState<IErrorMessages>(emptyErrorMessages);
  const [resetForm, setResetForm] = useState(false);
  const {currentUser, refetchUser} = useContext(AuthContext);
  const userID = currentUser ? currentUser.uid : '';

  useEffect(() => {
    setInput({
      ...input,
      admin: true,
      gold: true,
      dateOfBirth: '2000-01-01',
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

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setInput({
      ...input,
      [event.target.name]: event.target.value === '1',
    });
  };

  const handleClick = (): void => {
    const updatedErrorMessages = validateUserData(input);

    if (userHasErrorMessages(updatedErrorMessages)) {
      setErrorMessages(updatedErrorMessages);
      setResetForm(!resetForm);
      return;
    }

    input.email = currentUser?.email ?? '';

    setResetForm(!resetForm);
    console.log('Saving:');
    console.log(input);
    firebaseUsers
      .child(userID)
      .set(input)
      .then(() => {
        console.log('refetching');
        console.log(currentUser);
        refetchUser();
        navigate('/');
      })
      .catch(err => console.log('failed', err));
  };

  return (
    <Grid container justifyContent="center">
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid style={{position: 'absolute', top: 10, left: 10}}>
          <img src="assets/groupup_logo_black.png" />
        </Grid>
        <Typography variant="h2" marginTop={25}>
          Velkommen til GroupUp!
        </Typography>
      </Grid>
      <Grid container justifyContent="center" marginTop={10} sx={{width: 500}}>
        <Typography marginBottom={1} sx={{width: 1}}>
          Fyll inn feltene under for å fullføre brukerprofilen din
        </Typography>
        <Grid container justifyContent="center" marginTop={3}>
          {errorMessages.name === '' ? null : (
            <ContainedAlert message={errorMessages.name} />
          )}
          <TextField
            style={{width: 500}}
            variant="standard"
            required
            size="small"
            id="outlined-required"
            label="Navn"
            onChange={handleChange}
            value={input.name}
            name="name"
          />
        </Grid>
        <Grid container justifyContent="center" marginTop={3}>
          {errorMessages.dateOfBirth === '' ? null : (
            <ContainedAlert message={errorMessages.dateOfBirth} />
          )}
          <TextField
            style={{width: 500}}
            variant="standard"
            required
            size="small"
            id="outlined-required"
            type="date"
            label="Fødselsdato"
            InputLabelProps={{shrink: true}}
            onChange={handleChange}
            value={input.dateOfBirth ?? new Date(2000, 0, 1)}
            name="dateOfBirth"
          />
        </Grid>
        <Grid container justifyContent="center" marginTop={3}>
          {errorMessages.gold === '' ? null : (
            <ContainedAlert message={errorMessages.gold} />
          )}
          <FormControl style={{width: 500}} required size="small">
            <InputLabel id="demo-simple-select-label" sx={{left: -14, top: 5}}>
              Gold
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              variant="standard"
              id="demo-simple-select"
              label="Gold"
              value={input.gold ? '1' : '0'}
              onChange={handleChangeSelect}
              name="gold"
            >
              <MenuItem value={'1'}>Ja</MenuItem>
              <MenuItem value={'0'}>Nei</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid container justifyContent="center" marginTop={3}>
          {errorMessages.admin === '' ? null : (
            <ContainedAlert message={errorMessages.admin} />
          )}
          <FormControl style={{width: 500}} required size="small">
            <InputLabel id="demo-simple-select-label" sx={{left: -14, top: 5}}>
              Admin
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              variant="standard"
              id="demo-simple-select"
              label="Admin"
              value={input.admin ? '1' : '0'}
              onChange={handleChangeSelect}
              name="admin"
            >
              <MenuItem value={'1'}>Ja</MenuItem>
              <MenuItem value={'0'}>Nei</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid container justifyContent="center" marginTop={3} marginBottom={10}>
          <Button variant="contained" onClick={handleClick}>
            Oppdater profil
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
