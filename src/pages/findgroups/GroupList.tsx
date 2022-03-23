import {Grid, Typography, Card, CardContent, CardMedia} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import React from 'react';
import {defaultGroupImageUrl} from '../../utils/constants';

export interface IGroupListItem {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  memberCount: number;
  interests: string[];
  description: string;
  minAge: number;
  maxAge: number;
  meetingDate: string;
}

interface IGroupListProps {
  groups: IGroupListItem[];
}

export default function GroupList(props: IGroupListProps) {
  const navigate = useNavigate();
  return (
    <Grid container item direction="row" marginTop={5} justifyContent="center">
      {props.groups.map(group => (
        <Grid item key={group.id} sx={{m: 1, width: 1 / 6}}>
          <Card
            sx={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: 245,
              minWidth: {sx: 'default', sm: 200},
              cursor: 'pointer',
              minHeight: '100%',
            }}
            onClick={() => {
              navigate('/groups/' + group.id);
            }}
          >
            <CardMedia
              component="img"
              height="160"
              image={group.imageUrl ?? defaultGroupImageUrl}
              alt="Gruppebilde"
            />
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
              }}
            >
              <Typography variant="h5" component="div">
                {group.name}
              </Typography>
              <Typography variant="body2" sx={{flexGrow: 1, pb: 1}}>
                {group.description.length > 150
                  ? group.description.substring(0, 147) + '...'
                  : group.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
