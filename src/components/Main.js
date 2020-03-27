import React, {useContext, useState, useEffect}  from 'react';
import {FirebaseContext} from './Firebase';
import UserContext from './UserContext';
import Item from './Item';
import {Link} from 'react-router-dom';

function Main() {
    const firebase = useContext(FirebaseContext);
    const userData = useContext(UserContext);
    const [bugs,addBugs] = useState([]);
    const [fish,addFish] = useState([]);
    let date = new Date();

    function getCritters(type, reset) {
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
        if(!Object.keys(fish).length && Object.keys(bugs).length) {
            getCritters("fish", false);
        } else if(!Object.keys(bugs).length && Object.keys(fish).length) {
            getCritters("bugs", false);
        } else {
            getCritters("bugs", false);
            getCritters("fish", false);
        }

        // getCritters("fish", false);
    }

    // function signout() {
    //     firebase.doSignOut()
    // };

  return (
      <div className="main">
      Hello

      <button onClick={() => getCritters("bugs", true)}>Available Bugs</button>
      <button onClick={() => getCritters("fish", true)}>Available Fish</button>
      <button onClick={() => getAllCritters()}>All Available</button>
      <div className="available">
          {bugs ? (bugs.map(function(item) {
              // console.log(item);
                  return <Item item={item} key={item.Name} currMonth={date.getMonth()} type="bug"/>;
          })) : ""}
          {fish ? (fish.map(function(item) {
              // console.log(item);
                  return <Item item={item} key={item.Name} currMonth={date.getMonth()} type="fish"/>;
          })) : ""}
      </div>
    </div>
  );
}

// <button onClick={signout}>Logout</button>
// <Link to="/login">Login</Link>

export default Main;
