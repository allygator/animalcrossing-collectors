import React, {useContext, useState, useEffect} from 'react';
import {FirebaseContext} from './Firebase';
// import UserContext from './UserContext';
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
    // const userData = useContext(UserContext);
    const [critters, setCritters] = useState([])
    // const [collection, setCollection] = useState({});
    // let date = new Date();
    let currentDate = new Date();

    useEffect(() => {
        console.log(props.type);
        let date = new Date();
        let month = date.toLocaleString('default', {month: 'long'});
        let monthQuery = "Months.".concat(month);
        let timeQuery = "Time.".concat(date.getHours());
        var itemHolder = [];
        switch (props.type) {
            case 1:
                firebase.db.collection('bugs').where(monthQuery, "==", true).where(timeQuery, "==", true).get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        // console.log(doc.data().Name);
                        itemHolder.push(doc.data());
                    });
                }).then(function() {
                    firebase.db.collection('fish').where(monthQuery, "==", true).where(timeQuery, "==", true).get().then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            // console.log(doc.data().Name);
                            itemHolder.push(doc.data());
                        })
                    }).then(function() {
                        setCritters(itemHolder);
                    });
                });
                break;
            case 2:
                firebase.db.collection('bugs').where(monthQuery, "==", true).where(timeQuery, "==", true).get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        // console.log(doc.data().Name);
                        itemHolder.push(doc.data());
                    });
                }).then(function() {
                    setCritters(itemHolder);
                });
                break;
            case 3:
                firebase.db.collection('fish').where(monthQuery, "==", true).where(timeQuery, "==", true).get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        // console.log(doc.data().Name);
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
    useEffect(() => {
        console.log(critters)
    }, [critters]);
    return (
        <div className="available">
            {
                critters
                    ? (critters.map(function(item) {
                        // let name = item.Name.toLowerCase();
                        // if (userData) {
                        //     let collected = collection[name][0];
                        //     let donated = collection[name][1];
                        //     if (hidden) {
                        //         if (!collected) {
                        //             return <Item item={item} key={item.Name} currMonth={date.getMonth()} type="bug"/>;
                        //         } else {
                        //             return '';
                        //         }
                        //     } else {
                        //         return <Item item={item} key={item.Name} currMonth={date.getMonth()} type="bug" collected={collected} donated={donated}/>;
                        //     }
                        // } else {
                        //     return <Item item={item} key={item.Name} currMonth={date.getMonth()} type="bug"/>;
                        // }
                        //
                        return <Item item={item} key={item.Name} currMonth={currentDate.getMonth()} type={types[props.type]}/>
                    }))
                    : ""
            }
        </div>
    );
    //
    // function getCollection() {
    //     if (userData.authUser) {
    //         firebase.db.collection("users").doc(userData.authUser.uid).get().then(function(querySnapshot) {
    //             setCollection(querySnapshot.data());
    //         });
    //     };
    // }
    //
    // function getCritters(type, reset) {
    //     setShow(true);
    //     if (reset) {
    //         if (type === "fish") {
    //             addBugs([]);
    //         } else {
    //             addFish([]);
    //         }
    //     }
    // let month = date.toLocaleString('default', {month: 'long'});
    // let monthQuery = "Months.".concat(month);
    // let timeQuery = "Time.".concat(date.getHours());
    // var itemHolder = [];
    // firebase.db.collection(type).where(monthQuery, "==", true).where(timeQuery, "==", true).get().then(function(querySnapshot) {
    //     querySnapshot.forEach(function(doc) {
    //          console.log(doc.data().Name);
    //         itemHolder.push(doc.data());
    //     });
    // }).then(function() {
    //      console.log(itemHolder);
    //     if (type === "bugs") {
    //         addBugs(itemHolder);
    //     } else {
    //         addFish(itemHolder);
    //     }
    //
    // })
    // }
    //
    // function getAllCritters() {
    //     let dateNow = new Date();
    //     if (dateNow.getMonth() !== date.getMonth() || dateNow.getHours() !== date.getHours()) {
    //         getCritters("bugs", false);
    //         getCritters("fish", false);
    //     } else {
    //         if (!Object.keys(fish).length && Object.keys(bugs).length) {
    //             getCritters("fish", false);
    //         } else if (!Object.keys(bugs).length && Object.keys(fish).length) {
    //             getCritters("bugs", false);
    //         } else {
    //             getCritters("bugs", false);
    //             getCritters("fish", false);
    //         }
    //     }
    //
    // }
    //
    // function handleChange(e) {
    //     setHidden(e.target.checked);
    // }
    // return (
    //     <div className="available">
    //         {
    //             bugs
    //                 ? (bugs.map(function(item) {
    //                     let name = item.Name.toLowerCase();
    //                     if (userData) {
    //                         let collected = collection[name][0];
    //                         let donated = collection[name][1];
    //                         if (hidden) {
    //                             if (!collected) {
    //                                 return <Item item={item} key={item.Name} currMonth={date.getMonth()} type="bug"/>;
    //                             } else {
    //                                 return '';
    //                             }
    //                         } else {
    //                             return <Item item={item} key={item.Name} currMonth={date.getMonth()} type="bug" collected={collected} donated={donated}/>;
    //                         }
    //                     } else {
    //                         return <Item item={item} key={item.Name} currMonth={date.getMonth()} type="bug"/>;
    //                     }
    //
    //                 }))
    //                 : ""
    //         }
    //         {
    //             fish
    //                 ? (fish.map(function(item) {
    //                      console.log(item);
    //                     let name = item.Name.toLowerCase();
    //                     if (userData) {
    //                         let collected = collection[name][0];
    //                         let donated = collection[name][1];
    //                         if (hidden) {
    //                             console.log("hide collected");
    //                             if (!collected) {
    //                                 return <Item item={item} key={item.Name} currMonth={date.getMonth()} type="fish"/>;
    //                             } else {
    //                                 return '';
    //                             }
    //                         } else {
    //                             return <Item item={item} key={item.Name} currMonth={date.getMonth()} type="fish" collected={collected} donated={donated}/>;
    //                         }
    //                     } else {
    //                         return <Item item={item} key={item.Name} currMonth={date.getMonth()} type="fish"/>;
    //                     }
    //
    //                 }))
    //                 : ""
    //         }
    //     </div>);
}

// <button onClick={signout}>Logout</button>
// <Link to="/login">Login</Link>

export default Critters;
