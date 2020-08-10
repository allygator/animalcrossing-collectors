import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import cx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Checkbox from "@material-ui/core/Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faPaintBrush } from "@fortawesome/free-solid-svg-icons";
// import { FirebaseContext } from "./Firebase";
import UserContext from "./UserContext";

const useStyles = makeStyles(({ spacing, palette }) => {
  const family =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
  return {
    card: {
      display: "flex",
      padding: spacing(1),
      margin: spacing(1),
      flexDirection: "column",
      minWidth: 250,
      borderRadius: 12,
      color: "#E8F0F2",
      boxShadow: "0 2px 4px 0 rgba(138, 148, 159, 0.2)",
      "& > *:nth-child(1)": {
        marginRight: spacing(1),
      },
      "& > *:nth-child(2)": {
        flex: "auto",
      },
    },
    heading: {
      fontFamily: family,
      fontSize: 18,
      marginBottom: 1,
      paddingBottom: 0.5,
      fontWeight: "bold",
    },
    subheader: {
      fontFamily: family,
      fontSize: 12,
      // color: palette.grey[600],
      letterSpacing: "1px",
      paddingTop: 1,
      marginBottom: 2,
      // color: 'rgba(232, 240, 242, 0.7)'
    },
    avatar: {
      backgroundColor: "#7A212F",
    },
  };
});

function OtherItem(props) {
  // const firebase = useContext(FirebaseContext);
  const userData = useContext(UserContext);
  const [item, setItem] = useState([]);
  const [collected, setCollected] = useState(false);
  const [donated, setDonated] = useState(false);
  let leave = false;
  useEffect(() => {
    setItem(props.item);
  }, [props.item]);
  useEffect(() => {
    setCollected(props.collected);
  }, [props.collected]);
  useEffect(() => {
    setDonated(props.donated);
  }, [props.donated]);

  const styles = useStyles();
  //
  // function updateDB(type, val) {
  //   // let name = props.item.Name.toLowerCase();
  //   // name = name.replace("'", "");
  //   // if(type === "collected") {
  //   //     firebase.db.collection('users').doc(userData.authUser.uid).update({[name]:[val,donated]});
  //   //
  //   // } else {
  //   //     if(type === "donated" && val) {
  //   //         firebase.db.collection('users').doc(userData.authUser.uid).update({[name]:[val,val]});
  //   //     } else {
  //   //         firebase.db.collection('users').doc(userData.authUser.uid).update({[name]:[collected,val]});
  //   //     }
  //   //
  //   // }
  // }

  function update(type) {
    // if(type === "collected") {
    //     updateDB("collected", !collected);
    //     setCollected(!collected);
    //
    // } else {
    //     updateDB("donated", !donated);
    //     setDonated(!donated);
    // }
  }

  let collections = (
    <div id="collections">
      <div>
        Donated
        <Checkbox
          icon={
            <Avatar className="off">
              <FontAwesomeIcon
                icon={faCheck}
                alt="Switch light mode"
                size="sm"
              />
            </Avatar>
          }
          checkedIcon={
            <Avatar className="on">
              <FontAwesomeIcon
                icon={faCheck}
                alt="Switch light mode"
                size="sm"
              />
            </Avatar>
          }
          checked={donated}
          onClick={() => update("donated")}
        />
      </div>
      <div>
        Has Fake?
        <Checkbox
          icon={
            <Avatar className="off">
              <FontAwesomeIcon
                icon={faPaintBrush}
                alt="Switch light mode"
                size="xs"
              />
            </Avatar>
          }
          checkedIcon={
            <Avatar className="on">
              <FontAwesomeIcon
                icon={faCheck}
                alt="Switch light mode"
                size="sm"
              />
            </Avatar>
          }
          checked={donated}
          onClick={() => update("donated")}
        />
      </div>
    </div>
  );
  return (
    <Card className={cx(styles.card, "art")} elevation={0}>
      <CardHeader
        title={item.name}
        disableTypography
        className={cx(styles.heading, "cardHeader")}
      />
      <CardContent className={cx(styles.subheader, "cardInfo")}>
        {userData ? <Divider /> : ""}
        {userData ? collections : ""}
      </CardContent>
    </Card>
  );
}

OtherItem.defaultProps = {
  collected: false,
  donated: false,
};

OtherItem.propTypes = {
  collected: PropTypes.bool,
  donated: PropTypes.bool,
};

export default OtherItem;
