import {Grid, Button} from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import React, {useState} from 'react';
import {IState as Props} from './CreateGroup';

interface IProps {
  groups: Props['groups'];
  setGroups: React.Dispatch<React.SetStateAction<Props['groups']>>;
}

interface IGroup {
  group: {
    navn: String;
    beskrivelse?: String;
    interesser?: String[];
    medlemmer?: String[];
  };
}

const AddToList: React.FC<IProps> = ({groups, setGroups}) => {
  const [input, setInput] = useState<IGroup['group']>({navn: ''});

  const [state, setState] = useState({reset: false});

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = (): void => {
    if (!input.navn) {
      return;
    }

    setGroups([
      ...groups,
      {
        gruppenavn: input.navn,
        beskrivelse: input.beskrivelse,
        medlemmer: input.medlemmer,
        interesser: input.interesser,
      },
    ]);
    setInput({
      navn: '',
      beskrivelse: '',
    });

    setState({
      reset: !state.reset,
    });
  };

  const reseter = state.reset ? '1' : '2';

  const users = [
    {name: 'Jonatan'},
    {name: 'Ellie'},
    {name: 'Ole'},
    {name: 'Pål'},
  ];
  const interests = [
    {name: 'Fjellklatring'},
    {name: 'Sport'},
    {name: 'Spillkveld'},
    {name: 'Vinkveld'},
  ];

  return (
    <>
      <Grid container justifyContent="center" marginTop={5}>
        <TextField
          style={{width: 500}}
          required
          id="outlined-required"
          label="Gruppenavn"
          onChange={handleChange}
          value={input.navn}
          name="navn"
        />
      </Grid>
      <Grid container justifyContent="center" marginTop={5}>
        <TextField
          style={{width: 500}}
          id="outlined-multiline-static"
          label="Gruppebeskrivelse"
          multiline
          rows={4}
          inputProps={{maxLength: 240}}
          onChange={handleChange}
          value={input.beskrivelse}
          name="beskrivelse"
        />
      </Grid>
      <Grid container justifyContent="center" marginTop={5}>
        <Autocomplete
          key={reseter}
          id="addUsers"
          multiple
          freeSolo
          style={{width: 500}}
          onChange={(event: React.SyntheticEvent, value: String[]) => {
            console.log(value);
            setInput({
              ...input,
              medlemmer: value,
            });
          }}
          options={users.map(option => option.name)}
          renderInput={params => (
            <TextField {...params} label="Legg til brukere" />
          )}
        />
      </Grid>
      <Grid container justifyContent="center" marginTop={5}>
        <Autocomplete
          key={reseter}
          id="addInterests"
          multiple={true}
          freeSolo
          style={{width: 500}}
          onChange={(event: React.SyntheticEvent, value: string[]) => {
            setInput({
              ...input,
              interesser: value,
            });
          }}
          options={interests.map(option => option.name)}
          renderInput={params => (
            <TextField {...params} label="Legg til interesser" />
          )}
        />
      </Grid>
      <Grid container justifyContent="center" marginTop={5}>
        <Button variant="contained" onClick={handleClick}>
          Legg til gruppe
        </Button>
      </Grid>
    </>
  );
};

export default AddToList;
