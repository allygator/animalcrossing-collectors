import React, {useContext, useState}  from 'react';
import {FirebaseContext} from './Firebase';
import Item from './Item';

function Main() {
    const firebase = useContext(FirebaseContext);
    const [bugs,addBugs] = useState([]);
    const [fish,addFish] = useState([]);
    // useEffect(() => {
    //     firebase.db.collection('bugs').where("Price", "==", "Unknown").get().then(function(querySnapshot) {
    //         querySnapshot.forEach(function(doc) {
    //         console.log(doc.data())
    //         });
    //     })
    // }, [firebase]);

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

export default Main;
