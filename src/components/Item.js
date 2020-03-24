import React, {useEffect, useState}  from 'react';
import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';


const useStyles = makeStyles(({ spacing, palette }) => {
  const family =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
  return {
    card: {
      display: 'flex',
      padding: spacing(1),
      margin: spacing(1),
      flexDirection: 'column',
      minWidth: 250,
      borderRadius: 12,
      color: '#E8F0F2',
      boxShadow: '0 2px 4px 0 rgba(138, 148, 159, 0.2)',
      '& > *:nth-child(1)': {
        marginRight: spacing(1),
      },
      '& > *:nth-child(2)': {
        flex: 'auto',
      },
  },
    heading: {
      fontFamily: family,
      fontSize: 18,
      marginBottom: 1,
      paddingBottom: 0.5,
      color: '#E8F0F2',
      fontWeight: 'bold'
    },
    subheader: {
      fontFamily: family,
      fontSize: 12,
      // color: palette.grey[600],
      letterSpacing: '1px',
      paddingTop: 1,
      marginBottom: 2,
      color: 'rgba(232, 240, 242, 0.7)'
    },
  };
});

function Item(props) {
    const [item,setItem] = useState([]);
    useEffect(() => {
        setItem(props.item);
    }, [props.item]);
    // useEffect(() => {
    //     console.log(props.item)
    // }, [item]);
    // useEffect(() => {
    //     console.log(props)
    // }, [props]);
    const styles = useStyles();
  return (
      <Card className={cx(styles.card, props.type)} elevation={0}>
          <CardHeader title={item.Name} disableTypography className={cx(styles.heading, "cardHeader")}/>
      <CardContent className={cx(styles.subheader, "cardInfo")}>
      <p className={styles.subheader}>{item.Value} Bells • {item.TimeString ? item.TimeString : ""}</p>
      <Divider />
      <div id="extraInfo">
      <p className={styles.subheader}>{item.Location}</p>
      {props.type === "fish" ? <p className={styles.subheader}>Shadow size: {item.Shadow}</p> : ""}
      </div>
  </CardContent>
    </Card >
  );
}

export default Item;


// <Card className={cx(styles.card, props.type)} elevation={0}>
//     <CardHeader title={item.Name} />
// <h3 className={styles.heading}>{item.Name}</h3>
// <Box>
// <p className={styles.subheader}>{item.Value} Bells • {item.TimeString ? item.TimeString : ""}</p>
// <Divider />
// <p className={styles.subheader}>{item.Location}</p>
// {props.type === "fish" ? <p className={styles.subheader}>Shadow size: {item.Shadow}</p> : ""}
// </Box>
// </Card >
