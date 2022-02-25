import {Grid, Button} from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import React, {useEffect, useState} from 'react';
import {groups as firebaseGroups} from '../../service/firebase';
import {interests as firebaseInterests} from '../../service/firebase';
import {users as firebaseUsers} from '../../service/firebase';
import {IUser} from '../../interfaces/users';
import {IGroup, IGroupInterest} from '../../interfaces/groups';

interface IProps {
  groups: IGroup[];
  setGroups: React.Dispatch<React.SetStateAction<IGroup[]>>;
}

const AddToList: React.FC<IProps> = ({groups, setGroups}) => {
  const [input, setInput] = useState<IGroup>({
    name: '',
    mathcRequests: [],
    matches: [],
  });
  const [interests, setInterests] = useState<IGroupInterest[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  const [state, setState] = useState({reset: false});

  useEffect(() => {
    firebaseUsers.once('value', snapshot => {
      const users: IUser[] = snapshot.val();
      console.log(users);
      const userArray = Object.values(users).map((user: IUser) => {
        return user;
      });
      setUsers(userArray);
      firebaseInterests.once('value', snapshot => {
        const interests = snapshot.val();
        setInterests(interests);
      });
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
    if (input.name === '') {
      return;
    }

    const newGroup: IGroup = {
      name: input.name,
      description: input.description,
      members: input.members,
      interests: input.interests,
      mathcRequests: [],
      matches: [],
    };

    firebaseGroups.push(newGroup);

    setGroups([...groups, newGroup]);

    setInput({
      name: '',
      description: '',
      mathcRequests: [],
      matches: [],
    });

    setState({
      reset: !state.reset,
    });
  };

  const reseter = state.reset ? '1' : '2';

  return (
    <>
      <Grid container justifyContent="center" marginTop={5}>
        <TextField
          style={{width: 500}}
          required
          id="outlined-required"
          label="Gruppenavn"
          onChange={handleChange}
          value={input.name}
          name="name"
        />
      </Grid>
      <Grid container justifyContent="center" marginTop={5}>
        <TextField
          style={{width: 500}}
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
      <Grid container justifyContent="center" marginTop={5}>
        <Autocomplete
          key={reseter}
          id="addUsers"
          multiple
          freeSolo
          style={{width: 500}}
          onChange={(
            event: React.SyntheticEvent,
            //PROBLEM
            //Irriterer meg at den absolutt vil ha med string også. Dette fører til at members
            //i IGroup også må godta string[] hvilket egentlig er feil....
            value: (string | IUser)[]
          ) => {
            console.log(value);
            setInput({
              ...input,
              members: value,
            });
          }}
          options={users}
          getOptionLabel={option => option.name}
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
              interests: value,
            });
          }}
          options={interests}
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
