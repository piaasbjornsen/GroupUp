import {Grid, CssBaseline, Typography, Button, Box} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {groups as firebaseGroups} from '../../service/firebase';
import {users as firebaseUsers} from '../../service/firebase';
import GroupsIcon from '@mui/icons-material/Groups';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import CircularProgress from '@mui/material/CircularProgress';
import {
  IFirebaseGroup,
  IFirebaseUserId,
  IFirebaseMatch,
  IFirebaseLike,
  IFirebaseUserName,
  IFirebaseDb,
} from '../../interfaces/firebase';
import {useParams} from 'react-router-dom';
import {emptyGroupObject} from '../../utils/constants';
import {AuthContext} from '../../context/AuthContext';

//Bruker i liste
interface IUserListItem {
  id: IFirebaseUserId;
  name: IFirebaseUserName;
}

export default function groupPage() {
  const currentUser = useContext(AuthContext);

  const [groupTo, setGroupTo] = useState<IFirebaseGroup>(emptyGroupObject);
  const [groupFrom, setGroupFrom] = useState<IFirebaseGroup>(emptyGroupObject);
  const urlParams = useParams();
  const [isMatch, setIsMatch] = useState<boolean>();
  const [match, setMatch] = useState<IFirebaseMatch | null>();
  const groupIdTo = urlParams.groupIdTo ? urlParams.groupIdTo : '';
  const groupIdFrom = urlParams.groupIdFrom ? urlParams.groupIdFrom : '';
  const [isLiked, setIsLiked] = useState<boolean>();
  const [isSuperLiked, setIsSuperLiked] = useState<boolean>();
  const [users, setUsers] = useState<IUserListItem[]>([]);
  const [gold, setGold] = useState<boolean>(false);

  useEffect(() => {
    //groupTO
    firebaseGroups.child(groupIdTo).once('value', snapshot => {
      const groupTo = snapshot.val();
      setGroupTo(groupTo);
      if (typeof groupTo.likes === 'undefined') {
        groupTo.likes = [];
      }
      setIsLiked(
        groupTo.likes.some(
          (like: IFirebaseLike) => like.id === groupIdFrom && !like.super
        )
      );
      setIsSuperLiked(
        groupTo.likes.some(
          (like: IFirebaseLike) => like.id === groupIdFrom && like.super
        )
      );
      if (typeof groupTo.matches === 'undefined') {
        groupTo.matches = [];
      }
      setIsMatch(
        groupTo.matches.some(
          (match: IFirebaseMatch) => match.id === groupIdFrom
        )
      );
      groupTo.matches
        .filter((match: IFirebaseMatch) => match.id === groupIdFrom)
        .some((match: IFirebaseMatch) => setMatch(match));
    });
    setIsLiked(
      groupTo.likes.some(
        (like: IFirebaseLike) => like.id === groupIdFrom && !like.super
      )
    );
    setIsSuperLiked(
      groupTo.likes.some(
        (like: IFirebaseLike) => like.id === groupIdFrom && like.super
      )
    );

    //GroupFrom
    firebaseGroups.child(groupIdFrom).once('value', snapshot => {
      const groupFrom = snapshot.val();
      setGroupFrom(groupFrom);
      if (typeof groupFrom.likes === 'undefined') {
        groupFrom.likes = [];
      }
      if (typeof groupFrom.matches === 'undefined') {
        groupFrom.matches = [];
      }
      firebaseUsers.once('value', snapshot => {
        const users: IFirebaseDb['users'] = snapshot.val();
        setGold(
          groupFrom.members.some((user: string) => users[user].gold ?? false)
        );
      });
    });

    //Users
    firebaseUsers.once('value', snapshot => {
      const users = snapshot.val();
      const userList: IUserListItem[] = Object.keys(users).map<IUserListItem>(
        userId => ({
          id: userId,
          name: users[userId].name,
        })
      );
      setUsers(userList);
    });
  }, []);

  const handleClickLike = (isSuper: boolean): void => {
    const like: IFirebaseLike = {
      id: groupIdFrom,
      super: isSuper,
    };
    const matchTo: IFirebaseMatch = {
      id: groupIdFrom,
      date: new Date().toLocaleString(),
    };
    const matchFrom: IFirebaseMatch = {
      id: groupIdTo,
      date: new Date().toLocaleString(),
    };
    if (!groupFrom.likes.some((like: IFirebaseLike) => like.id === groupIdTo)) {
      groupTo.likes.push(like);
      firebaseGroups.child(groupIdTo + '/likes').set(groupTo.likes);
    } else {
      groupTo.likes = groupTo.likes.filter(
        (like: IFirebaseLike) => like.id !== groupIdFrom
      );
      groupFrom.likes = groupFrom.likes.filter(
        (like: IFirebaseLike) => like.id !== groupIdTo
      );
      groupFrom.matches.push(matchFrom);
      groupTo.matches.push(matchTo);
      firebaseGroups.child(groupIdFrom + '/matches').set(groupFrom.matches);
      firebaseGroups.child(groupIdTo + '/matches').set(groupTo.matches);
      firebaseGroups.child(groupIdFrom + '/likes').set(groupFrom.likes);
      firebaseGroups.child(groupIdTo + '/likes').set(groupTo.likes);
      setIsMatch(true);
      setMatch(matchTo);
    }
    isSuper ? setIsSuperLiked(true) : setIsLiked(true);
  };
  const handleClickUnLike = (isSuper: boolean): void => {
    groupTo.likes = groupTo.likes.filter(
      (like: IFirebaseLike) => like.id !== groupIdFrom || like.super !== isSuper
    );
    firebaseGroups.child(groupIdTo + '/likes').set(groupTo.likes);
    isSuper ? setIsSuperLiked(false) : setIsLiked(false);
  };

  const handleClickUnMatch = (): void => {
    groupTo.matches = groupTo.matches.filter(
      (match: IFirebaseMatch) => match.id !== groupIdFrom
    );
    groupFrom.matches = groupFrom.matches.filter(
      (match: IFirebaseMatch) => match.id !== groupIdTo
    );
    firebaseGroups.child(groupIdTo + '/matches').set(groupTo.matches);
    firebaseGroups.child(groupIdFrom + '/matches').set(groupFrom.matches);
    setIsMatch(false);
    setMatch(null);
    setIsLiked(false);
    setIsSuperLiked(false);
  };

  if (
    groupTo === null ||
    users === null ||
    typeof isSuperLiked === 'undefined' ||
    typeof isLiked === 'undefined' ||
    typeof isMatch === 'undefined'
  ) {
    return (
      <>
        <Grid container justifyContent="center" marginTop={20}>
          <CircularProgress />
        </Grid>
      </>
    );
  }
  return (
    <>
      <>
        <CssBaseline />
        <Grid marginLeft={30} container direction={'row'} marginTop={2}>
          <GroupsIcon fontSize="large" />
          <Typography variant="h4" marginLeft={3}>
            {groupTo?.name}
          </Typography>
          {!isMatch ? (
            <>
              <Grid marginLeft={3}>
                {isLiked ? (
                  <Button
                    variant={'contained'}
                    onClick={() => handleClickUnLike(false)}
                  >
                    <Grid container justifyContent="space-around">
                      unlike
                      <FavoriteIcon sx={{ml: 1}}></FavoriteIcon>
                    </Grid>
                  </Button>
                ) : (
                  <Button
                    variant={'contained'}
                    onClick={() => handleClickLike(false)}
                  >
                    <Grid container justifyContent="space-around">
                      Like
                      <FavoriteBorderIcon sx={{ml: 1}}></FavoriteBorderIcon>
                    </Grid>
                  </Button>
                )}
              </Grid>
              {gold ? (
                <Grid marginLeft={2}>
                  {isSuperLiked ? (
                    <Button
                      variant={'contained'}
                      onClick={() => handleClickUnLike(true)}
                    >
                      <Grid container justifyContent="space-around">
                        Fjern super-like
                        <StarIcon sx={{ml: 1}}></StarIcon>
                      </Grid>
                    </Button>
                  ) : (
                    <Button
                      variant={'contained'}
                      onClick={() => handleClickLike(true)}
                    >
                      <Grid container justifyContent="space-around">
                        Super like
                        <StarBorderIcon sx={{ml: 1}}></StarBorderIcon>
                      </Grid>
                    </Button>
                  )}
                </Grid>
              ) : (
                <></>
              )}
            </>
          ) : (
            <>
              <Grid marginLeft={3}>
                <Button variant={'contained'} onClick={handleClickUnMatch}>
                  <Grid container justifyContent="space-around">
                    Unmatch
                    <CloseIcon sx={{ml: 1}}></CloseIcon>
                  </Grid>
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </>
      {[
        groupFrom.likes
          ?.filter(
            like =>
              like.id === groupIdTo &&
              ((currentUser?.gold ?? false) === true || like.super === true)
          )
          ?.sort(like => (like.super === true ? -1 : 1))[0] ?? null,
      ].map(like =>
        like === null ? null : (
          <Grid
            marginLeft={29}
            marginTop={2}
            container
            direction={'row'}
            key={like.id}
          >
            <Typography
              variant="body1"
              style={{width: '100%'}}
              marginBottom={1}
            >
              {groupFrom.name} har blitt {like.super ? 'super-liket' : 'liket'}{' '}
              av {groupTo.name}
            </Typography>
            <Button
              variant={'contained'}
              onClick={() => handleClickLike(false)}
            >
              <Grid container justifyContent="space-around">
                Godta
              </Grid>
            </Button>
          </Grid>
        )
      )}
      <Grid marginLeft={29} container direction={'row'} marginTop={3}>
        <Grid sx={{mr: 3}}>
          <Grid item>
            <Box
              component="img"
              sx={{
                height: 350,
                width: 350,
                maxHeight: {xs: 500, md: 250},
                maxWidth: {xs: 500, md: 250},
              }}
              alt="Student group."
              //src= groupTo.imageUrl  TODO
              src="https://img.freepik.com/free-vector/group-young-people-posing-photo_52683-18823.jpg?t=st=1646909401~exp=1646910001~hmac=5acffd8fef1d5ec0375a2eafc88b06e09115773e54ace3acb2f3e2dc3ea74ae6"
            />
          </Grid>
        </Grid>
        <Grid>
          <Grid marginTop={3}>
            <Typography variant="body1" style={{width: 500}}>
              {groupTo.description}
            </Typography>
          </Grid>
          <Grid marginTop={3}>
            <Typography>Interesser:</Typography>
            <Typography variant="body1" style={{width: 500}}>
              {groupTo.interests.map(interest => (
                <span key={interest}>
                  - {interest}
                  <br />
                </span>
              ))}
            </Typography>
          </Grid>
          <Grid>
            {isMatch ? (
              <>
                <Grid marginTop={3}>
                  <Typography>Medlemmer:</Typography>
                  <Typography variant="body1" style={{width: 500}}>
                    {groupTo.members
                      .map(
                        (userId: IFirebaseUserId) =>
                          users.find(user => user.id === userId)?.name
                      )
                      .map(name => (
                        <span key={name}>
                          - {name}
                          <br />
                        </span>
                      ))}
                  </Typography>
                </Grid>
                <Grid container justifyContent="center" marginTop={5}>
                  <Typography variant="caption">
                    Dere matchet: {match?.date}
                  </Typography>
                </Grid>
              </>
            ) : (
              <>
                <Grid marginTop={3}>
                  <Typography>Antall medlemmer:</Typography>
                  <Typography variant="body1" style={{width: 500}}>
                    {groupTo.members.length}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
