import React, {useEffect, useState}  from 'react';
import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';


const useStyles = makeStyles(({ spacing, palette }) => {
  const family =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
  return {
    card: {
      display: 'flex',
      padding: spacing(2),
      minWidth: 250,
      borderRadius: 12,
      boxShadow: '0 2px 4px 0 rgba(138, 148, 159, 0.2)',
      '& > *:nth-child(1)': {
        marginRight: spacing(2),
      },
      '& > *:nth-child(2)': {
        flex: 'auto',
      },
  },
    heading: {
      fontFamily: family,
      fontSize: 16,
      marginBottom: 0,
    },
    subheader: {
      fontFamily: family,
      fontSize: 14,
      color: palette.grey[600],
      letterSpacing: '1px',
      marginBottom: 4,
    },
    value: {
      marginLeft: 8,
      fontSize: 14,
      color: palette.grey[500],
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
          <Box>
      <h3 className={styles.heading}>{item.Name}</h3>
      <p className={styles.subheader}>{item.Value} Bells • {item.Location}</p>
      </Box>
    </Card >
  );
}

export default Item;
