import React, {useContext, useEffect}  from 'react';
import {FirebaseContext} from './Firebase';

function Main() {
    const firebase = useContext(FirebaseContext);
    useEffect(() => {
        firebase.db.collection('bugs').where("Months.March", "==", true).where("Time.9", "==", true).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
            console.log(doc.data())
            });
        })
    }, [firebase]);

    let item = {
        "Time": {

            "0": false,
            "1": false,
            "2": false,
            "3": false,
            "4": true,
            "5": true,
            "6": true,
            "7": true,
            "8": true,
            "9": true,
            "10": true,
            "11": true,
            "12": true,
            "13": true,
            "14": true,
            "15": true,
            "16": true,
            "17": true,
            "18": true,
            "19": true,
            "20": false,
            "21": false,
            "22": false,
            "23": false
        },
            "Name": "Common Butterfly",
            "Months": {
            "January": true,
            "February": true,
            "March": true,
            "April": true,
            "May": true,
            "June": true,
            "July": false,
            "August": false,
            "September": true,
            "October": true,
            "November": true,
            "December": true},
            "Location": "Flying"
    }

    function add() {
        console.log(item["Name"].toLowerCase())
        firebase.db.collection('bugs').doc(item["Name"].toLowerCase()).set(item)
    }
  return (
      <div className="main">
      Hello
      <button onClick={add}>Add</button>
    </div>
  );
}

export default Main;
