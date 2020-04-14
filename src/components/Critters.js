import React, {useContext, useState, useEffect} from 'react';
import {FirebaseContext} from './Firebase';
import UserContext from './UserContext';
import Item from './Item';
import Loadingsvg from './svg/Loadingsvg';
import cx from 'clsx';
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
    // console.log(props);
    const firebase = useContext(FirebaseContext);
    const userData = useContext(UserContext);
    const [critters, setCritters] = useState([])
    const [collection, setCollection] = useState({});
    let currentDate = new Date();

    //Get what the user has already collected/donated
    useEffect(() => {
        if (
            userData
            ?.authUser) {
            let unsubscribe = firebase.db.collection('users').doc(userData.authUser.uid).onSnapshot(doc => {
                setCollection(doc.data());
            }, err => {
                console.log(err)
            })
            return() => unsubscribe();
        } else {
            return;
        }
    }, [firebase, userData]);

    //Get specific critter data based on what the user selected
    useEffect(() => {
        let date = new Date();
        if (props.specific) {
            date.setMonth(props.specific.month);
            if (props.specific.meridiam) {
                date.setHours(props.specific.hour + 12);
            } else {
                date.setHours(props.specific.hour);
            }
        }
        let loc = "Months.";
        if (!props.hemisphere) {
            loc = "Southern.";
        }
        let month = date.toLocaleString('default', {month: 'long'});
        let monthQuery = loc + month;
        let timeQuery = "Time.".concat(date.getHours());
        props.toggleLoading(false);
        var itemHolder = [];
        switch (props.type) {
                //User selected "all critters"
            case 3:
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
                        props.toggleLoading(false);
                    });
                });
                break;
                //User selected "bugs"
            case 1:
                firebase.db.collection('bugs').where(monthQuery, "==", true).where(timeQuery, "==", true).get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        itemHolder.push(doc.data());
                    });
                }).then(function() {
                    setCritters(itemHolder);
                    props.toggleLoading(false);
                });
                break;
                //User selected "fish"
            case 2:
                firebase.db.collection('fish').where(monthQuery, "==", true).where(timeQuery, "==", true).get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        itemHolder.push(doc.data());
                    });
                }).then(function() {
                    setCritters(itemHolder);
                    props.toggleLoading(false);
                });
                break;
            default:
                break;
        }
    }, [props, firebase.db]);

    return (<div className="content">

        {
            props.hemisphere
                ? <h3>Northern Hemisphere</h3>
                : <h3>Southern Hemisphere</h3>
        }
        {
            userData
                ? <h3 id="full">Marking donated will automatically mark collected as well</h3>
                : ''
        }
        {
            props.loading
                ? <Loadingsvg/>
                : ''
        }
        <div className={cx("available", props.loading && 'hidden')}>
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
                                    return <Item item={item} key={item.Name} currMonth={currentDate.getMonth()} type={types[props.type]} collected={collected} ignore={!props.specific}/>;
                                } else {
                                    return '';
                                }
                            } else {
                                return <Item item={item} key={item.Name} currMonth={currentDate.getMonth()} type={types[props.type]} collected={collected} donated={donated} ignore={!props.specific}/>;
                            }
                        } else {
                            return <Item item={item} key={item.Name} currMonth={currentDate.getMonth()} type={types[props.type]} ignore={!props.specific}/>;
                        }
                    }))
                    : ""
            }
        </div>
    </div>);
}

export default Critters;
