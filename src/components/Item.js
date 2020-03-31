import React, {useEffect, useState, useContext}  from 'react';
import PropTypes from 'prop-types';
import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import { faExclamationTriangle as warning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import {FirebaseContext} from './Firebase';
import UserContext from './UserContext';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

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
      fontWeight: 'bold'
    },
    subheader: {
      fontFamily: family,
      fontSize: 12,
      // color: palette.grey[600],
      letterSpacing: '1px',
      paddingTop: 1,
      marginBottom: 2,
      // color: 'rgba(232, 240, 242, 0.7)'
    },
    avatar: {
        backgroundColor: '#7A212F',
    }
  };
});

function Item(props) {
    // console.log(props);
    const firebase = useContext(FirebaseContext);
    const userData = useContext(UserContext);
    const [item,setItem] = useState([]);
    const [collected,setCollected] = useState(false);
    const [donated,setDonated] = useState(false);
    const [type, setType] = useState('');
    let leave = false;
    // useEffect(() => {
    //     console.log(props);
    // }, [props]);
    useEffect(() => {
        setItem(props.item);
    }, [props.item]);
    useEffect(() => {
        if(props.item.Shadow) {
            console.log("fish");
            setType("fish");
        } else {
            setType("bug");
        }
        // setType(props.item);
    }, [props.item]);
    useEffect(() => {
        // console.log("collected")
        setCollected(props.collected);
    }, [props.collected]);
    // useEffect(() => {
    //     console.log(collected)
    // }, [collected]);
    useEffect(() => {
        setDonated(props.donated);
    }, [props.donated]);

    const styles = useStyles();
    if(props.currMonth) {
        let next = monthNames[props.currMonth+1]
        if(!props.item.Months[next]) {
            leave = true;
        }
    }

    function updateDB(type, val) {
        let name = props.item.Name.toLowerCase();
        if(type === "collected") {
            firebase.db.collection('users').doc(userData.authUser.uid).update({[name]:[val,donated]});

        } else {
            firebase.db.collection('users').doc(userData.authUser.uid).update({[name]:[collected,val]});
        }
    }

    function update(type) {
        if(type === "collected") {
            updateDB("collected", !collected);
            setCollected(!collected);

        } else {
            updateDB("donated", !donated);
            setDonated(!donated);
        }
    }

    let collections = <div id="collections">
        <div>Collected
            <Checkbox
              icon={
                  <Avatar className="off">
                        <FontAwesomeIcon icon={faCheck} alt="Switch light mode" size="sm"/></Avatar>
              }
                    checkedIcon={
                        <Avatar className="on"><FontAwesomeIcon icon={faCheck} alt="Switch light mode" size="sm"/></Avatar>
                    }
              checked={collected}
              onClick={() => update("collected")}
              />
        </div>
        <div>Donated<Checkbox
          icon={
              <Avatar className="off">
                    <FontAwesomeIcon icon={faCheck} alt="Switch light mode" size="sm"/></Avatar>
          }
                checkedIcon={
                    <Avatar className="on"><FontAwesomeIcon icon={faCheck} alt="Switch light mode" size="sm"/></Avatar>
                }
                checked={donated}
                onClick={() => update("donated")}
          />
          </div>
    </div>

    let avi = <Avatar className={styles.avatar}><FontAwesomeIcon icon={warning} alt="Switch light mode" size="xs" transform="up-2" title="Leaving end of month"/></Avatar>
  return (
      <Card className={cx(styles.card, type)} elevation={0}>
          <CardHeader title={item.Name} disableTypography className={cx(styles.heading, "cardHeader")} avatar={leave ? avi : ''}/>
      <CardContent className={cx(styles.subheader, "cardInfo")}>
      <p className={styles.subheader}>{item.Value} Bells • {item.TimeString ? item.TimeString : ""}</p>
      <Divider />
      <div id="extraInfo">
      <p>{item.Location}</p>
      {props.type === "fish" ? <p>Shadow size: {item.Shadow}</p> : ""}
      </div>
      {userData ? <Divider /> : ''}
      {userData ? collections : ''}

  </CardContent>
    </Card >
  );
}

Item.defaultProps = {
    collected: false,
    donated: false
}

Item.propTypes ={
    collected: PropTypes.bool,
    donated: PropTypes.bool
}

export default Item;
