import React from 'react';
import {Grid, Alert, AlertColor} from '@mui/material';

interface ContainedAlertProps {
  message: string;
  severity?: AlertColor;
}

export const ContainedAlert: React.FC<ContainedAlertProps> = (
  props: ContainedAlertProps
) => (
  <Grid container justifyContent="center" marginBottom={0.5}>
    <Alert severity={props.severity ?? 'error'} style={{width: 500}}>
      {props.message}
    </Alert>
  </Grid>
);
