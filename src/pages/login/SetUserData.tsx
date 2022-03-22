import {
  Button,
  CssBaseline,
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

export default function SetUserData() {
  const [input, setInput] = useState<IFirebaseUser>(emptyUserObject);
  const [errorMessages, setErrorMessages] =
    useState<IErrorMessages>(emptyErrorMessages);
  const [resetForm, setResetForm] = useState(false);
  const [admin, setAdmin] = useState<string>('1');
  const [gold, setGold] = useState<string>('1');
  const user = useContext(AuthContext);
  const userID = user ? user.uid : '';

  useEffect(() => {
    setInput({
      ...input,
      admin: true,
      gold: true,
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

  const handleChangeAdmin = (event: SelectChangeEvent) => {
    const setAdmin1: string = event.target.value;
    setAdmin(event.target.value as string);
    input.admin = setAdmin1 === '1';
  };

  const handleChangeGold = (event: SelectChangeEvent) => {
    const setGold1: string = event.target.value as string;
    setGold(event.target.value as string);
    input.gold = setGold1 === '1';
  };

  const handleClick = (): void => {
    const updatedErrorMessages = validateUserData(input);

    if (userHasErrorMessages(updatedErrorMessages)) {
      setErrorMessages(updatedErrorMessages);
      setResetForm(!resetForm);
      return;
    }

    setInput(emptyUserObject);

    setResetForm(!resetForm);
    firebaseUsers.child(userID).set(input);
  };

  return (
    <>
      <CssBaseline />
      <Grid container justifyContent="center" marginTop={5}>
        <Typography variant="h5" marginLeft={2}>
          Velkommen til GroupUp!
        </Typography>
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
              label="Navn"
              onChange={handleChange}
              value={input.name}
              name="name"
            />
          </Grid>
          <Grid container justifyContent="center" marginTop={2}>
            {errorMessages.dateOfBirth === '' ? null : (
              <ContainedAlert message={errorMessages.name} />
            )}
            <TextField
              style={{width: 500}}
              required
              size="small"
              id="outlined-required"
              type="date"
              label="Fødselsdato"
              InputLabelProps={{shrink: true}}
              onChange={handleChange}
              value={input.dateOfBirth}
              name="date"
            />
          </Grid>
          <Grid container justifyContent="center" marginTop={2}>
            {errorMessages.gold === '' ? null : (
              <ContainedAlert message={errorMessages.name} />
            )}
            <FormControl style={{width: 500}} required size="small">
              <InputLabel id="demo-simple-select-label">Gold</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={gold}
                label="Gold"
                onChange={handleChangeGold}
              >
                <MenuItem value={'1'}>Ja</MenuItem>
                <MenuItem value={'0'}>Nei</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid container justifyContent="center" marginTop={2}>
            {errorMessages.admin === '' ? null : (
              <ContainedAlert message={errorMessages.name} />
            )}
            <FormControl style={{width: 500}} required size="small">
              <InputLabel id="demo-simple-select-label">Admin</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={admin}
                label="Admin"
                onChange={handleChangeAdmin}
              >
                <MenuItem value={'1'}>Ja</MenuItem>
                <MenuItem value={'0'}>Nei</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            container
            justifyContent="center"
            marginTop={2}
            marginBottom={10}
          >
            <Button variant="contained" onClick={handleClick}>
              Opprett
            </Button>
          </Grid>
        </>
      </Grid>
    </>
  );
}
