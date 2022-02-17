import {Grid, Button} from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import {groups as firebaseGroups} from '../../service/firebase';
import {interests as firebaseInterests} from '../../service/firebase';
import {users as firebaseUsers} from '../../service/firebase';
import {
  IGroup,
  IGroupInterest,
  IGroupMember,
  Users,
} from '../../interfaces/groups';

interface IProps {
  groups: IGroup[];
  setGroups: React.Dispatch<React.SetStateAction<IGroup[]>>;
}

const AddToList: React.FC<IProps> = ({groups, setGroups}) => {
  const [input, setInput] = useState<IGroup>({name: ''});
  const [interests, setInterests] = useState<IGroupInterest[]>([]);
  const [users, setUsers] = useState<String[]>([]);

  const [state, setState] = useState({reset: false});

  useEffect(() => {
    firebaseUsers.once('value', snapshot => {
      const users: Users = snapshot.val();
      console.log(users);
      const userArray = Object.values(users).map((user: IGroupMember) => {
        return user['name'];
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
    };

    firebaseGroups.push(newGroup);

    setGroups([...groups, newGroup]);

    setInput({
      name: '',
      description: '',
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
          label="Group name"
          onChange={handleChange}
          value={input.name}
          name="name"
        />
      </Grid>
      <Grid container justifyContent="center" marginTop={5}>
        <TextField
          style={{width: 500}}
          id="outlined-multiline-static"
          label="Description"
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
            event: SyntheticEvent<Element, Event>,
            value: (string | String)[]
          ) => {
            setInput({
              ...input,
              members: value,
            });
          }}
          options={users}
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
