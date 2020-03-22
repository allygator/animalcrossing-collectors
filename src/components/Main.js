import React, {useContext, useEffect}  from 'react';
import {FirebaseContext} from './Firebase';

function Main() {
    const firebase = useContext(FirebaseContext);
    // useEffect(() => {
    //     firebase.db.collection('bugs').where("Price", "==", "Unknown").get().then(function(querySnapshot) {
    //         querySnapshot.forEach(function(doc) {
    //         console.log(doc.data())
    //         });
    //     })
    // }, [firebase]);

    function getCritters() {
        let date = new Date();
        let month = date.toLocaleString('default', { month: 'long' });
        let monthQuery = "Months.".concat(month);
        let timeQuery = "Time.".concat(date.getHours());
        firebase.db.collection('bugs').where(monthQuery, "==", true).where(timeQuery, "==", true).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
            console.log(doc.data().Name)
            });
        })
    }

  return (
      <div className="main">
      Hello
      <button onClick={getCritters}>Get Bugs</button>
    </div>
  );
}

export default Main;
