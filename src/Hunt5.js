import React, { useState, useEffect, useRef } from 'react';
import './App.css'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';

import useSound from 'use-sound';
import alarm from './media/alarm.mp3';

const BoopButton = () => {
  const [play] = useSound(alarm);
  useEffect(()=>play(),[play])
  return <button disabled onClick={play}>Alarm!</button>;
};



const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  root: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
    flexGrow: 1,
  },
  infoBottom: {
    marginTop: theme.spacing(2),
  },
  infoTop: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));


export const numberFormat = (value) =>
  new Intl.NumberFormat('en-EN', {
    style: 'currency',
    currency: 'USD'
  }).format(value);


  // Fetch ETH price for further calculations
  var priceEth = 0;
  fetch('https://api.etherscan.io/api?module=stats&action=ethprice&apikey=15K8UEKJJ7XNPEIBESJ9BUVQI7R76ASHIK')
  .then(response => response.json())
  .then(data=> {priceEth = data.result.ethusd; });
  
 

// Graph https://thegraph.com/docs/graphql-api#queries
// Uniswap queries https://uniswap.org/docs/v2/API/queries/

const NEW_PAIRS = gql `
  query pairs($reserveUSD: Int!, $timeStamp: Int!, $txCount: Int!){
    pairs(where: {reserveUSD_gt: $reserveUSD, createdAtTimestamp_gt: $timeStamp, txCount_gt: $txCount} first: 10, 
    orderBy: createdAtTimestamp, orderDirection: desc) {
      id
      txCount
      totalSupply
      volumeUSD
      reserveUSD
      createdAtTimestamp
    token0 {
      name
      id
      derivedETH
    }
    token1 {
      name
      id
      derivedETH
    }
    }
  }
 `

 // from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function Hunt5() {


  let [count, setCount] = useState(0);

  useInterval(() => {
    // Your custom logic here
    setCount(count + 1);
  }, 14000);

  const { loading: newLoading5, data: data5 } = useQuery(NEW_PAIRS, {
    variables: {
      reserveUSD: 50000,
      timeStamp: Math.floor(Date.now() / 1000) - 300,  // 5 minutes
      txCount: 0
    }
  })


  const [play] = useSound(alarm,{ volume: 0.95 });

  const pairs5 = data5 && data5.pairs

  const classes = useStyles();
  var rowNumber = 0;

  return (
    <Grid container spacing={3} direction="row"  direction="column" justify="center" alignItems="center">
      <Grid item xl={10} xs={12}>
      <CssBaseline />
      <div className={classes.paper}>
      <Typography variant="h2" color="inherit" className={classes.toolbarTitle}>Catch new Uniswap listings</Typography>
      <Alert severity="info" className={classes.infoTop}>What does this page do? It checks for listed Uniswap projects in last 5 minutes and with higher then 50k USD liquidity</Alert> 
      <div className={classes.root}>
      <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
      <TableHead>
          <TableRow>
          <StyledTableCell></StyledTableCell>
          <StyledTableCell>Token 1 Uniswap/Etherscan</StyledTableCell>
          <StyledTableCell>Token 2 Uniswap/Etherscan</StyledTableCell>
          <StyledTableCell>TX count</StyledTableCell>
          <StyledTableCell>Volume USD</StyledTableCell>
          <StyledTableCell>Current liquidty</StyledTableCell>
          <StyledTableCell>Creation date</StyledTableCell>
          <StyledTableCell>Price T1/T2</StyledTableCell>          
          <StyledTableCell>Uniswap</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
          newLoading5
          ? 'Loading pairs data...'
          : (pairs5.length?  
          pairs5.map(function(item, key) {
            
            var d = new Date(item.createdAtTimestamp * 1000);
            var formattedDate = d.getDate() + "/" + (d.getMonth() + 1); // + "-" + d.getFullYear();
            var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
            var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
            var formattedTime = hours + ":" + minutes;
            
            formattedDate = formattedDate + " " + formattedTime;
            rowNumber++;
console.log (priceEth);
            return (
               <TableRow key = {key}>
                   <TableCell><BoopButton/></TableCell>
                   <TableCell>{item.token0.name}  <Link href= {"https://etherscan.io/address/" + item.token0.id + "#code"} target="_blank">SC</Link></TableCell>  
                   <TableCell>{item.token1.name}  <Link href= {"https://etherscan.io/address/" + item.token1.id + "#code"} target="_blank">SC</Link></TableCell>                  
                   <TableCell>{item.txCount}</TableCell>
                   <TableCell>{numberFormat(item.volumeUSD)}</TableCell>
                   <TableCell>{numberFormat(item.reserveUSD)}</TableCell>
                   <TableCell>{formattedDate}</TableCell>    
                   <TableCell>{numberFormat(priceEth * item.token0.derivedETH) + " / " + numberFormat(priceEth * item.token1.derivedETH)}</TableCell>                 
                   <TableCell><Link href= {"https://uniswap.info/pair/" + item.id } target="_blank" variant="body2">View pair</Link></TableCell> 
               </TableRow>
             )
          })
          : 'No results for this hunt')
        }
        </TableBody>
        </Table>

      </TableContainer>  
        </div>    
        <Alert severity="warning" className={classes.infoBottom}>Page is refreshed every 14 seconds (or roughly one eth block), there is also sound ALARM when something is caught so you can leave the page to work in Background</Alert> 
        <Alert severity="success" className={classes.infoBottom}>Donate if helpful 0x777a7dC0c7CC331ac0D8A99f723F547EBCC7B366</Alert>       
      </div>
       </Grid>
      </Grid>
  )
}

export default Hunt5
