import React, {useContext, useState, useEffect} from 'react';
import {FirebaseContext} from './Firebase';
import UserContext from './UserContext';
import Item from './Item';
// import Header from './Header';
//  import {Link} from 'react-router-dom';
// import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
// import {faLightbulb as lightOn} from '@fortawesome/free-solid-svg-icons';
// import {faLightbulb as lightOff} from '@fortawesome/free-regular-svg-icons';

var types = ['', 'all', 'bugs', 'fish'];

function Critters(props) {
    const firebase = useContext(FirebaseContext);
    const userData = useContext(UserContext);
    const [critters, setCritters] = useState([])
    const [collection, setCollection] = useState({});
    let currentDate = new Date();

    //Get what the user has already collected/donated
    useEffect(() => {
        if(userData && userData.authUser) {
            let unsubscribe = firebase.db.collection('users').doc(userData.authUser.uid).onSnapshot(doc => {
                // console.log("got data");
                setCollection(doc.data());
            }, err => { console.log(err) })
            return () => unsubscribe();
        } else {
            return;
        }
    }, [firebase, userData]);

    //Get specific critter data based on what the user selected
    useEffect(() => {
        let date = new Date();
        let month = date.toLocaleString('default', {month: 'long'});
        let monthQuery = "Months.".concat(month);
        let timeQuery = "Time.".concat(date.getHours());
        var itemHolder = [];
        switch (props.type) {
            //User selected "all critters"
            case 1:
                firebase.db.collection('bugs').where(monthQuery, "==", true).where(timeQuery, "==", true).get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        itemHolder.push(doc.data());
                    });
                }).then(function() {
                    firebase.db.collection('fish').where(monthQuery, "==", true).where(timeQuery, "==", true).get().then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            itemHolder.push(doc.data());
                        })
                    }).then(function() {
                        setCritters(itemHolder);
                    });
                });
                break;
            //User selected "bugs"
            case 2:
                firebase.db.collection('bugs').where(monthQuery, "==", true).where(timeQuery, "==", true).get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        itemHolder.push(doc.data());
                    });
                }).then(function() {
                    setCritters(itemHolder);
                });
                break;
            //User selected "fish"
            case 3:
                firebase.db.collection('fish').where(monthQuery, "==", true).where(timeQuery, "==", true).get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        itemHolder.push(doc.data());
                    });
                }).then(function() {
                    setCritters(itemHolder);
                });
                break;
            default:
                break;
        }
    }, [props, firebase.db]);

    return (
        <div className="content">
            {userData ? <p id="full">Checking donated will automatically check collected as well</p> : ''}
            <div className="available">
            {
                critters
                    ? (critters.map(function(item) {
                        let name = item.Name.toLowerCase();
                        name = name.replace("'", "");
                        let collected;
                        let donated;
                        if (userData) {
                            collected = collection[name][0];
                            donated = collection[name][1];
                            if (props.hidden) {
                                if (!donated) {
                                    return <Item item={item} key={item.Name} currMonth={currentDate.getMonth()}  type={types[props.type]} collected={collected}/>;
                                } else {
                                    return '';
                                }
                            } else {
                                return <Item item={item} key={item.Name} currMonth={currentDate.getMonth()}  type={types[props.type]} collected={collected} donated={donated}/>;
                            }
                        } else {
                            return <Item item={item} key={item.Name} currMonth={currentDate.getMonth()}  type={types[props.type]}/>;
                        }
                    }))
                    : ""
            }
            </div>
        </div>
    );
}

export default Critters;
