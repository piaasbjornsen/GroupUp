import React, {useContext} from 'react';
import {
  Divider,
  Grid,
  Link,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import 'typeface-roboto';
import {signOut} from '../../service/firebase';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';
import {ContentCut, Info, ReplayOutlined} from '@mui/icons-material';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {defaultGroupImageUrl} from '../../utils/constants';

export default function Header() {
  const {currentUser} = useContext(AuthContext);
  const navigate = useNavigate();

  const currentGroup = useSelector((state: RootState) => state.currentGroup);

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container spacing={0} direction="column" justifyContent="center">
      <Grid
        display="flex"
        alignItems={'center'}
        justifyContent="right"
        style={{height: '60px'}}
        container
        spacing={0}
      >
        <RouterLink to="/groups/find">
          <img
            src="/assets/groupup_logo_black.png"
            style={{height: '40px', position: 'absolute', left: 10, top: 10}}
          />
        </RouterLink>

        {currentUser?.admin ? (
          <Grid item marginRight={6}>
            <Link
              component={RouterLink}
              to="/admin"
              style={{
                textDecoration: 'none',
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              ADMIN
            </Link>
          </Grid>
        ) : null}

        <Grid item marginRight={6}>
          <Link
            component={RouterLink}
            to={'/groups/find'}
            style={{textDecoration: 'none', color: 'black', fontWeight: 'bold'}}
          >
            FINN GRUPPER
          </Link>
        </Grid>

        <Grid item marginRight={6}>
          <Link
            component={RouterLink}
            to={'/groups/create'}
            style={{textDecoration: 'none', color: 'black', fontWeight: 'bold'}}
          >
            OPPRETT GRUPPE
          </Link>
        </Grid>

        <Grid item marginRight={6}>
          <Link
            onClick={handleClick}
            style={{textDecoration: 'none', cursor: 'pointer'}}
          >
            <Typography
              style={{
                display: 'inline-block',
                textDecoration: 'none',
                color: 'black',
                fontWeight: 'bold',
                padding: '10px 0',
                verticalAlign: 'top',
                paddingRight: 10,
              }}
            >
              {currentGroup?.group?.name.toUpperCase() ?? 'VELG GRUPPE'}
            </Typography>
            <img
              src={currentGroup?.group?.imageUrl ?? defaultGroupImageUrl}
              alt="Gruppebilde"
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                display: 'inline-block',
              }}
            />
          </Link>
        </Grid>
      </Grid>
      <Paper sx={{width: 320, maxWidth: '100%'}}>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem
            onClick={() => {
              handleClose();
              navigate('/');
            }}
          >
            <Info>
              <ContentCut fontSize="small" />
            </Info>
            <ListItemText>Min gruppe</ListItemText>
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClose();
              navigate('/groups/change');
            }}
          >
            <ReplayOutlined>
              <ContentCut fontSize="small" />
            </ReplayOutlined>
            <ListItemText>Bytt gruppe</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={signOut}>
            <ListItemText>Logg ut</ListItemText>
          </MenuItem>
        </Menu>
      </Paper>
    </Grid>
  );
}
