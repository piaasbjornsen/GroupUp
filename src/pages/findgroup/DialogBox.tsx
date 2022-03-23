import React, {useContext} from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {blue} from '@mui/material/colors';
import ReportIcon from '@mui/icons-material/Report';
import {
  IFirebaseReport,
  IFirebaseUser,
  IFirebaseUsers,
} from '../../interfaces/firebase';
import {users as firebaseUsers} from '../../service/firebase';
import {AuthContext} from '../../context/AuthContext';

const reports = [
  'Upassende oppførsel',
  'Bruker utgir seg for å være en annen',
  'Bruker kan være under 18 år',
];

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
  userID: string;
  setUsers2: React.Dispatch<React.SetStateAction<IFirebaseUsers>>;
}

function SimpleDialog(props: SimpleDialogProps) {
  const {onClose, selectedValue, open, userID, setUsers2} = props;
  const {currentUser} = useContext(AuthContext);
  const activeUserID = currentUser ? currentUser.uid : '';
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
    firebaseUsers.child(userID).once('value', snapshot => {
      const reportedUser: IFirebaseUser = snapshot.val();
      if (typeof reportedUser.reports === 'undefined') {
        reportedUser.reports = [];
      }
      const report: IFirebaseReport = {
        reportedBy: activeUserID,
        reason: value,
      };
      reportedUser.reports.push(report);
      firebaseUsers.child(userID).set(reportedUser);
      firebaseUsers.once('value', snapshot => {
        const users: IFirebaseUsers = snapshot.val();
        setUsers2(users);
      });
    });
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Velg rapporteringsgrunn</DialogTitle>
      <List sx={{pt: 0}}>
        {reports.map(report => (
          <ListItem
            button
            onClick={() => handleListItemClick(report)}
            key={report}
          >
            <ListItemAvatar>
              <Avatar sx={{bgcolor: blue[100], color: blue[600]}}>
                <ReportIcon></ReportIcon>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={report} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export default function SimpleDialogDemo(props: {
  userID: string;
  groupToMembers: string[];
  setGroupToMembers: React.Dispatch<React.SetStateAction<string[]>>;
  setUsers2: React.Dispatch<React.SetStateAction<IFirebaseUsers>>;
}) {
  const {userID, groupToMembers, setGroupToMembers, setUsers2} = props;
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(reports[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
    const members: string[] = groupToMembers;
    setGroupToMembers(members);
  };

  return (
    <div>
      <Button variant="outlined" size="small" onClick={handleClickOpen}>
        Rapporter
        <ReportIcon sx={{ml: 1}}></ReportIcon>
      </Button>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        userID={userID}
        setUsers2={setUsers2}
      />
    </div>
  );
}
