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

    function getCritters(type) {
        let date = new Date();
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
        getCritters("bugs");
        getCritters("fish");
    }

    function signout() {
        firebase.doSignOut()
    };

  return (
      <div className="main">
      Hello

      <button onClick={() => getCritters("bugs")}>Get Bugs</button>
      <button onClick={() => getCritters("fish")}>Get Fish</button>
      <button onClick={() => getAllCritters()}>Get all critters</button>
      <div className="available">
          {bugs ? (bugs.map(function(item) {
              // console.log(item);
                  return <Item item={item} key={item.Name} type="bug"/>;
          })) : ""}
          {fish ? (fish.map(function(item) {
              // console.log(item);
                  return <Item item={item} key={item.Name} type="fish"/>;
          })) : ""}
      </div>
    </div>
  );
}

// <button onClick={signout}>Logout</button>
// <Link to="/login">Login</Link>

export default Main;
