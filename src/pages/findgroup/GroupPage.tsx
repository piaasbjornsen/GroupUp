import {Grid, Typography, Button, Box} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import {groups as firebaseGroups} from '../../service/firebase';
import {users as firebaseUsers} from '../../service/firebase';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import CircularProgress from '@mui/material/CircularProgress';
import Rating from '@mui/material/Rating';
import {
  IFirebaseGroup,
  IFirebaseUserId,
  IFirebaseMatch,
  IFirebaseLike,
  IFirebaseUserName,
  IFirebaseDb,
  IFirebaseUser,
  IFirebaseRating,
  IFirebaseReport,
  IFirebaseUsers,
} from '../../interfaces/firebase';
import {useParams} from 'react-router-dom';
import {emptyGroupObject} from '../../utils/constants';
import {AuthContext} from '../../context/AuthContext';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import SimpleDialogDemo from './DialogBox';
import ReportIcon from '@mui/icons-material/Report';

//Bruker i liste
interface IUserListItem {
  id: IFirebaseUserId;
  name: IFirebaseUserName;
}

export default function groupPage() {
  const {currentUser} = useContext(AuthContext);
  const currentGroup = useSelector((state: RootState) => state.currentGroup);

  const [groupTo, setGroupTo] = useState<IFirebaseGroup>(emptyGroupObject);
  const [groupFrom, setGroupFrom] = useState<IFirebaseGroup>(emptyGroupObject);
  const [groupToMembers, setGroupToMembers] = useState<string[]>([]);
  const urlParams = useParams();
  const [isMatch, setIsMatch] = useState<boolean>();
  const [match, setMatch] = useState<IFirebaseMatch | null>();
  const groupIdTo = urlParams.groupIdTo ? urlParams.groupIdTo : '';
  const groupIdFrom = currentGroup.groupId ?? '';
  const [isLiked, setIsLiked] = useState<boolean>();
  const [isSuperLiked, setIsSuperLiked] = useState<boolean>();
  const [users, setUsers] = useState<IUserListItem[]>([]);
  const [users2, setUsers2] = useState<IFirebaseUsers>({});
  const [gold, setGold] = useState<boolean>(false);
  const [rating, setRating] = React.useState<number | null>(0);
  const [canRate, setCanRate] = React.useState<boolean>(true);
  const [isRated, setIsRated] = React.useState<boolean>(false);
  const userID = currentUser ? currentUser.uid : '';
  const [groupRating, setGroupRating] = React.useState<number>(0);
  const ratingText: string = canRate
    ? 'Gi rating av gruppa:'
    : 'Din rating av gruppa:';

  useEffect(() => {
    //groupTO
    firebaseGroups.child(groupIdTo).once('value', snapshot => {
      const groupTo: IFirebaseGroup = snapshot.val();
      setGroupTo(groupTo);
      setGroupToMembers(groupTo.members);
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

      if (
        !(typeof groupTo.rating === 'undefined' || groupTo.rating.count === 0)
      ) {
        setIsRated(true);
        setGroupRating(groupTo.rating.score / groupTo.rating.count);
      }
    });

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
        if (
          (users[userID].groupsRated ?? []).some(
            (rating: IFirebaseRating) => rating.groupRated === groupIdTo
          )
        ) {
          setCanRate(false);
          const rating: IFirebaseRating | undefined = (
            users[userID].groupsRated ?? []
          ).find((rating: IFirebaseRating) => rating.groupRated === groupIdTo);
          setRating(rating?.rating ?? 0);
        }
      });
    });

    //Users
    firebaseUsers.once('value', snapshot => {
      const users: IFirebaseUsers = snapshot.val();
      setUsers2(users);
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

  const handelRate = (value: number): void => {
    setCanRate(false);
    setRating(value);
    firebaseUsers.once('value', snapshot => {
      const users: IFirebaseDb['users'] = snapshot.val();
      const user: IFirebaseUser = users[userID];
      user.groupsRated = user.groupsRated ?? [];
      if (
        user.groupsRated.some(
          (rating: IFirebaseRating) => rating.groupRated === groupIdTo
        )
      ) {
        return;
      } else {
        user.groupsRated.push({groupRated: groupIdTo, rating: value});
        firebaseUsers.child(userID).set(user);
        if (typeof groupTo.rating === 'undefined') {
          groupTo.rating = {score: 0, count: 0};
        }
        groupTo.rating.score += value;
        groupTo.rating.count++;
        firebaseGroups.child(groupIdTo).set(groupTo);
        setGroupRating(groupTo.rating.score / groupTo.rating.count);
        setIsRated(true);
      }
    });
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
      <Grid
        sx={{
          width: '100%',
          height: '300px',
          backgroundImage:
            'url(' + (groupTo.imageUrl ?? '/assets/background_image.jpg') + ')',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <Typography
          variant="h4"
          marginLeft={3}
          paddingTop={3}
          sx={{color: 'white', textShadow: '1px 1px 10px #5f5f5f'}}
        >
          {groupTo?.name}
        </Typography>
      </Grid>
      <Grid
        container
        item
        direction={'row'}
        sx={{width: '80%', margin: '0 auto'}}
      >
        {/** LIKE / SUPERLIKE */}
        {groupFrom.likes?.filter(
          like =>
            like.id === groupIdTo && (gold === true || like.super === true)
        ).length === 0 ? (
          <Grid
            container
            item
            direction={'row'}
            marginTop={3}
            justifyContent="center"
          >
            {!isMatch ? (
              <>
                <Grid>
                  {isLiked ? (
                    <Button
                      variant={'outlined'}
                      onClick={() => handleClickUnLike(false)}
                    >
                      <Grid container justifyContent="space-around">
                        unlike
                        <FavoriteIcon sx={{ml: 1}}></FavoriteIcon>
                      </Grid>
                    </Button>
                  ) : (
                    <Button
                      variant={'outlined'}
                      onClick={() => handleClickLike(false)}
                    >
                      Like
                      <FavoriteBorderIcon sx={{ml: 1}}></FavoriteBorderIcon>
                    </Button>
                  )}
                </Grid>
                {gold ? (
                  <Grid sx={{ml: 2}}>
                    {isSuperLiked ? (
                      <Button
                        variant={'outlined'}
                        onClick={() => handleClickUnLike(true)}
                      >
                        <Grid container justifyContent="space-around">
                          Fjern super-like
                          <StarIcon sx={{ml: 1}}></StarIcon>
                        </Grid>
                      </Button>
                    ) : (
                      <Button
                        variant={'outlined'}
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
                <Grid container justifyContent="center">
                  <Button variant={'contained'} onClick={handleClickUnMatch}>
                    <Grid container justifyContent="space-around">
                      Unmatch
                      <CloseIcon sx={{ml: 1}}></CloseIcon>
                    </Grid>
                  </Button>
                  <Grid container justifyContent="center" marginTop={1}>
                    <Typography variant="caption">
                      Dere matchet: {match?.date}
                    </Typography>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        ) : null}
        {/** GROUP HAS LIKED/SUPERLIKED YOUR GROUP */}
        {[
          groupFrom.likes
            ?.filter(
              like =>
                like.id === groupIdTo && (gold === true || like.super === true)
            )
            ?.sort(like => (like.super === true ? -1 : 1))[0] ?? null,
        ].map(like =>
          like === null ? null : (
            <Grid
              marginTop={3}
              item
              key={like.id}
              sx={{width: 1, textAlign: 'center'}}
            >
              <Typography
                variant="body1"
                style={{width: '100%'}}
                marginBottom={1}
              >
                {groupTo.name} har {like.super ? 'super-liket' : 'liket'}{' '}
                {groupFrom.name}
              </Typography>
              <Button
                variant={'outlined'}
                onClick={() => handleClickLike(false)}
              >
                Match
              </Button>
            </Grid>
          )
        )}
        {/** MEETING DATE */}
        <Grid
          container
          item
          direction="row"
          marginTop={2}
          justifyContent="center"
        >
          <Typography variant="body1">
            {groupTo.name} har{' '}
            {(groupTo.meetingDate ?? '') === ''
              ? 'ingen foretrukket møtedato'
              : 'foretrukket møtedato ' + groupTo.meetingDate + '. '}
            {(groupTo.meetingFrequency ?? '') !== ''
              ? groupTo.meetingFrequency + '.'
              : ''}
          </Typography>
        </Grid>
        {/** GROUP INFO */}
        <Grid container item direction="row" marginTop={1} marginBottom={3}>
          {/** DESCRIPTION */}
          <Grid item sx={{width: 1 / 3, verticalAlign: 'top'}}>
            <Typography
              variant="h5"
              sx={{textAlign: 'center', marginX: 2, marginBottom: 1}}
            >
              Beskrivelse
            </Typography>
            <Typography variant="body1" sx={{textAlign: 'center', marginX: 2}}>
              {groupTo.description}
            </Typography>
          </Grid>
          {/** INTERESTS */}
          <Grid item sx={{width: 1 / 3, verticalAlign: 'top'}}>
            <Typography
              variant="h5"
              sx={{textAlign: 'center', marginX: 2, marginBottom: 1}}
            >
              Interesser
            </Typography>
            <Typography variant="body1" sx={{textAlign: 'center', marginX: 2}}>
              {groupTo.interests.map(interest => (
                <span key={interest}>
                  {interest}
                  <br />
                </span>
              ))}
            </Typography>
          </Grid>
          {/** MEMBERS ? HAVE ALREADY MATCHED : HAVE NOT MATCHED */}
          <Grid item sx={{width: 1 / 3, verticalAlign: 'top'}}>
            {isMatch ? (
              <>
                <Typography
                  variant="h5"
                  sx={{textAlign: 'center', marginX: 2, marginBottom: 1}}
                >
                  Medlemmer
                </Typography>
                <Grid container item direction="column" justifyContent="center">
                  {groupToMembers
                    .map(
                      (userId: IFirebaseUserId) =>
                        users.find(user => user.id === userId) ?? {
                          id: '',
                          name: '',
                        }
                    )
                    .filter((user: IUserListItem) => user.id !== '')
                    .map((user: IUserListItem) => (
                      <Grid
                        item
                        container
                        key={user.id}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        marginRight={12}
                        flexWrap="wrap"
                        marginBottom={1.5}
                      >
                        <Typography sx={{width: 1, textAlign: 'center'}}>
                          {user.name}
                        </Typography>
                        <Grid marginTop={0.5}>
                          {users2[user.id].reports?.some(
                            (report: IFirebaseReport) =>
                              report.reportedBy === userID
                          ) ? (
                            <Button variant="outlined" size="small" disabled>
                              Er rapportert
                              <ReportIcon sx={{ml: 1}}></ReportIcon>
                            </Button>
                          ) : (
                            <SimpleDialogDemo
                              userID={user.id}
                              groupToMembers={groupToMembers}
                              setGroupToMembers={setGroupToMembers}
                              setUsers2={setUsers2}
                            ></SimpleDialogDemo>
                          )}
                        </Grid>
                      </Grid>
                    ))}
                </Grid>
              </>
            ) : (
              <>
                <Typography
                  variant="h5"
                  sx={{textAlign: 'center', marginX: 2, marginBottom: 1}}
                >
                  Medlemmer
                </Typography>
                <Typography
                  variant="body1"
                  sx={{textAlign: 'center', marginX: 2}}
                >
                  {groupTo.members.length} medlemmer.
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
        {/** GIVE RATING */}
        <Grid
          container
          item
          direction={'column'}
          alignItems="center"
          sx={{width: 1, textAlign: 'center'}}
        >
          {isRated ? (
            <Box marginTop={2} display="flex">
              <Typography component="legend">
                Gjennomsnittlig rating av gruppa:{' '}
              </Typography>
              <Rating
                sx={{ml: 1}}
                name="total-rating"
                value={groupRating}
                disabled
                precision={0.5}
              />
            </Box>
          ) : (
            <Typography variant="body1">
              Gruppa har ikke mottatt noen rating.
            </Typography>
          )}
          {isMatch ? (
            <Box marginTop={2} display="flex">
              <Typography component="legend">{ratingText} </Typography>
              <Rating
                name="rate"
                value={rating}
                onChange={(event, newValue) => {
                  handelRate(newValue ?? 0);
                }}
                disabled={!canRate}
                sx={{ml: 2.5}}
              />
            </Box>
          ) : (
            <Typography variant="body1" marginTop={2}>
              Du kan gi gruppa en egen rating hvis dere matcher!
            </Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
}
