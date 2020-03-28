import React, {useContext, useState, useEffect}  from 'react';
import {FirebaseContext} from './Firebase';
import UserContext from './UserContext';
import Item from './LoginItem';
// import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb as lightOn} from '@fortawesome/free-solid-svg-icons';
import { faLightbulb as lightOff } from '@fortawesome/free-regular-svg-icons';

function Main() {
    const firebase = useContext(FirebaseContext);
    const userData = useContext(UserContext);
    const [bugs,addBugs] = useState([]);
    const [fish,addFish] = useState([]);
    const [showData,setShow] = useState(false);
    const [mode,setMode] = useState(true);
    const [hidden,setHidden] = useState(false);
    const [collection, setCollection] = useState({});
    const toggle = () => setMode(!mode);
    let date = new Date();

    useEffect(() => {
        if(userData) {
            if(userData.authUser) {
                firebase.db.collection("users").doc(userData.authUser.uid).get().then(function(querySnapshot) {
                    setCollection(querySnapshot.data());
                });
            }
        }

    }, [userData, firebase.db]);

    // useEffect(() => {
    //     console.log(collection)
    // }, [collection]);

    function getCritters(type, reset) {
        setShow(true);
        if(reset) {
            if(type==="fish") {
                addBugs([]);
            } else {
                addFish([]);
            }
        }
        let month = date.toLocaleString('default', { month: 'long' });
        let monthQuery = "Months.".concat(month);
        let timeQuery = "Time.".concat(date.getHours());
        var itemHolder = [];
        firebase.db.collection(type).where(monthQuery, "==", true).where(timeQuery, "==", true).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
            // console.log(doc.data().Name);
            itemHolder.push(doc.data());
            });
        }).then(function() {
            // console.log(itemHolder);
            if(type==="bugs") {
                addBugs(itemHolder);
            } else {
                addFish(itemHolder);
            }

        })
    }

    function getAllCritters() {
        let dateNow = new Date();
        if(dateNow.getMonth() !== date.getMonth() || dateNow.getHours() !== date.getHours()) {
            getCritters("bugs", false);
            getCritters("fish", false);
        } else {
            if(!Object.keys(fish).length && Object.keys(bugs).length) {
                getCritters("fish", false);
            } else if(!Object.keys(bugs).length && Object.keys(fish).length) {
                getCritters("bugs", false);
            } else {
                getCritters("bugs", false);
                getCritters("fish", false);
            }
        }

    }

    function handleChange(e) {
        setHidden(e.target.checked);
    }

    function signout() {
        firebase.doSignOut()
    };

  return (
      <div className={mode ? "dark main" : "light main"}>
          <div id="header">
              {userData? <Button variant="contained" onClick={signout} id="signout">signout</Button> : ''}
              <IconButton onClick={toggle} id="lights">
                  <FontAwesomeIcon icon={mode ? lightOff : lightOn} title="Switch light mode" transform="up-3"/>
              </IconButton>
          </div>
      <div className={showData ? "little" : ''}><h1>Welcome to AC:NH Critter Collector.</h1> <h2>Select one of the quick options below for critter availability right now.</h2></div>

      <div id="quick">
      <Button variant="contained" onClick={() => getCritters("bugs", true)}>Available Bugs</Button>
      <Button variant="contained" onClick={() => getCritters("fish", true)}>Available Fish</Button>
      <Button variant="contained" onClick={() => getAllCritters()}>All Available</Button>
      {userData? <FormControlLabel
        control={
          <Checkbox type="checkbox" id="hide" checked={hidden} onChange={handleChange}/>} label="Hide Collected" /> : ''}
      </div>



      <div className="available">
          {bugs ? (bugs.map(function(item) {
              let name = item.Name.toLowerCase();
              if(userData) {
                  let collected = collection[name][0];
                  let donated = collection[name][1];
                  if(hidden) {
                      if(!collected) {
                          return <Item item={item} key={item.Name} currMonth={date.getMonth()} type="bug"/>;
                      } else {
                          return '';
                      }
                  } else {
                      return <Item item={item} key={item.Name} currMonth={date.getMonth()} type="bug" collected={collected} donated={donated}/>;
                  }
              } else {
                  return <Item item={item} key={item.Name} currMonth={date.getMonth()} type="bug"/>;
              }


          })) : ""}
          {fish ? (fish.map(function(item) {
              // console.log(item);
              let name = item.Name.toLowerCase();
              if(userData) {
                  let collected = collection[name][0];
                  let donated = collection[name][1];
                  if(hidden) {
                      console.log("hide collected");
                      if(!collected) {
                          return <Item item={item} key={item.Name} currMonth={date.getMonth()} type="fish"/>;
                      } else {
                          return '';
                      }
                  } else {
                      return <Item item={item} key={item.Name} currMonth={date.getMonth()} type="fish" collected={collected} donated={donated}/>;
                  }
              } else {
                  return <Item item={item} key={item.Name} currMonth={date.getMonth()} type="fish"/>;
              }

          })) : ""}
      </div>
    </div>
  );
}

// <button onClick={signout}>Logout</button>
// <Link to="/login">Login</Link>

export default Main;
