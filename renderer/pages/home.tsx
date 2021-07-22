import React, {useEffect} from 'react';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import { Grid, Button, Divider, Typography, IconButton, Backdrop, LinearProgress, CircularProgress } from '@material-ui/core'
import { ipcRenderer } from 'electron';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: "200px",
    },
  })
);

function Home() {
  const classes = useStyles({});
useEffect(()=>{
  ipcRenderer.send('checkUpdate')


}, [])

  return (
    <React.Fragment>
      <div className={classes.root}> 
      <Grid container >
        <Grid item xs={12}>
        <CircularProgress />

        </Grid>
        <Grid item xs={12}>
        <Typography>
          Aguarde...
        </Typography>
        </Grid>
        

      </Grid>

      </div>
    

    </React.Fragment>
  );
};

export default Home;
