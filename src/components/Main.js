import React, {useContext, useState, useEffect} from 'react';
import {FirebaseContext} from './Firebase';
import UserContext from './UserContext';
import Item from './Item';
// import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLightbulb as lightOn} from '@fortawesome/free-solid-svg-icons';
import {faLightbulb as lightOff} from '@fortawesome/free-regular-svg-icons';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons';

function Main() {
    const firebase = useContext(FirebaseContext);
    const userData = useContext(UserContext);
    const [bugs, addBugs] = useState([]);
    const [fish, addFish] = useState([]);
    const [showData, setShow] = useState(false);
    const [mode, setMode] = useState(true);
    const [hidden, setHidden] = useState(false);
    const [collection, setCollection] = useState({});
    const toggle = () => setMode(!mode);
    const [timing, setTiming] = React.useState({month: 0, hour: 1, meridiem: 0});
    const [expanded, setExpanded] = React.useState(false);
    let date = new Date();

    const handleTimeChange = event => {
        setTiming({
            ...timing,
            [event.target.name]: event.target.value
        });
        console.log(event.target.name);
    };
    const handlePanelChange = panel => (event, isExpanded) => {
        setExpanded(
            isExpanded
            ? panel
            : false);
    };
    useEffect(() => {
        console.log(timing)
    }, [timing]);

    useEffect(() => {
        if (userData) {
            if (userData.authUser) {
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
        if (reset) {
            if (type === "fish") {
                addBugs([]);
            } else {
                addFish([]);
            }
        }
        let month = date.toLocaleString('default', {month: 'long'});
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
            itemHolder.sort((a, b) => b.Value - a.Value);
            if (type === "bugs") {
                addBugs(itemHolder);
            } else {
                addFish(itemHolder);
            }

        })
    }

    function getAllCritters() {
        let dateNow = new Date();
        if (dateNow.getMonth() !== date.getMonth() || dateNow.getHours() !== date.getHours()) {
            getCritters("bugs", false);
            getCritters("fish", false);
        } else {
            if (!Object.keys(fish).length && Object.keys(bugs).length) {
                getCritters("fish", false);
            } else if (!Object.keys(bugs).length && Object.keys(fish).length) {
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

    function sort(type) {
        [...fish].sort((a, b) => {
            return b.age - a.age;
        });
    }

    function submit() {}

    return (<div className={mode
            ? "dark main"
            : "light main"}>
        <div id="pulldown" className={showData ? "" : "hidden"}>

            <input type="checkbox" id="pulldown-checkbox"/>
            <label htmlFor="pulldown-checkbox" className="pulldown-label">
                <span id="label-words">Options</span>
                <span className="menu-arrow"><FontAwesomeIcon icon={faChevronDown} title="Switch light mode" transform="up-3"/></span>
            </label>
            <div id="options" className="options">
                <div className="menu">
                    <div id="quick">
                <Button variant="contained" onClick={() => getCritters("bugs", true)}>
                    <span className="reduce">Available&nbsp;</span>Bugs</Button>
                <Button variant="contained" onClick={() => getCritters("fish", true)}>
                    <span className="reduce">Available&nbsp;</span>Fish</Button>
                <Button variant="contained" onClick={() => getAllCritters()}>All<span className="reduce">&nbsp;Available</span>
                </Button>
                </div>
                <div id="time-select">
                    <p>Or pick a specific and month</p>
                            <FormControl>
                                <InputLabel id="month">Month</InputLabel>
                                <Select labelId="month" id="month-select" value={timing.month} name="month" onChange={handleTimeChange}>
                                    <MenuItem value={0}>January</MenuItem>
                                    <MenuItem value={1}>February</MenuItem>
                                    <MenuItem value={2}>March</MenuItem>
                                    <MenuItem value={3}>April</MenuItem>
                                    <MenuItem value={4}>May</MenuItem>
                                    <MenuItem value={5}>June</MenuItem>
                                    <MenuItem value={6}>July</MenuItem>
                                    <MenuItem value={7}>August</MenuItem>
                                    <MenuItem value={8}>September</MenuItem>
                                    <MenuItem value={9}>October</MenuItem>
                                    <MenuItem value={10}>November</MenuItem>
                                    <MenuItem value={11}>December</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel id="hour">Hour</InputLabel>
                                <Select labelId="hour" id="hour-select" value={timing.hour} name="hour" onChange={handleTimeChange}>
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={6}>6</MenuItem>
                                    <MenuItem value={7}>7</MenuItem>
                                    <MenuItem value={8}>8</MenuItem>
                                    <MenuItem value={9}>9</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={11}>11</MenuItem>
                                    <MenuItem value={12}>12</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel id="meridiem-label">AM/PM</InputLabel>
                                <Select labelId="meridiem-label" id="meridiem" name="meridiem" value={timing.meridiem} onChange={handleTimeChange}>
                                    <MenuItem value={0}>AM</MenuItem>
                                    <MenuItem value={1}>PM</MenuItem>
                                </Select>
                            </FormControl>
                </div>
                {
                    userData
                        ? <FormControlLabel control={<Checkbox type = "checkbox" id = "hide" checked = {
                                    hidden
                                }
                                onChange = {
                                    handleChange
                                } />} label="Hide Collected"/>
                        : ''
                }
            </div>
            </div>
        </div>
        <div id="header">
            {
                userData
                    ? <Button variant="contained" onClick={signout} id="signout">signout</Button>
                    : ''
            }
            <IconButton onClick={toggle} id="lights">
                <FontAwesomeIcon icon={mode
                        ? lightOff
                        : lightOn} title="Switch light mode" transform="up-3"/>
            </IconButton>
        </div>
        <div className={showData
                ? "little"
                : ''}>
            <div className="intro">
                <h1>Welcome to AC:NH Critter Collector.</h1>
                <h2>Select one of the quick options below for critter availability right now.</h2>
                <h3>Current time: {date.toLocaleString('default', {month: 'long'})}
                    &nbsp;at {date.getHours() % 12}
                    {
                        date.getHours() > 12
                            ? "PM"
                            : "AM"
                    }</h3>
            </div>

            <div id="quick">
                <Button variant="contained" onClick={() => getCritters("bugs", true)}>
                    <span className="reduce">Available&nbsp;</span>Bugs</Button>
                <Button variant="contained" onClick={() => getCritters("fish", true)}>
                    <span className="reduce">Available&nbsp;</span>Fish</Button>
                <Button variant="contained" onClick={() => getAllCritters()}>All<span className="reduce">&nbsp;Available</span>
                </Button>
                {
                    userData
                        ? <FormControlLabel control={<Checkbox type = "checkbox" id = "hide" checked = {
                                    hidden
                                }
                                onChange = {
                                    handleChange
                                } />} label="Hide Collected"/>
                        : ''
                }
            </div>
            <div id="time-select">
                        <FormControl>
                            <InputLabel id="month">Month</InputLabel>
                            <Select labelId="month" id="month-select" value={timing.month} name="month" onChange={handleTimeChange}>
                                <MenuItem value={0}>January</MenuItem>
                                <MenuItem value={1}>February</MenuItem>
                                <MenuItem value={2}>March</MenuItem>
                                <MenuItem value={3}>April</MenuItem>
                                <MenuItem value={4}>May</MenuItem>
                                <MenuItem value={5}>June</MenuItem>
                                <MenuItem value={6}>July</MenuItem>
                                <MenuItem value={7}>August</MenuItem>
                                <MenuItem value={8}>September</MenuItem>
                                <MenuItem value={9}>October</MenuItem>
                                <MenuItem value={10}>November</MenuItem>
                                <MenuItem value={11}>December</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="hour">Hour</InputLabel>
                            <Select labelId="hour" id="hour-select" value={timing.hour} name="hour" onChange={handleTimeChange}>
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={6}>6</MenuItem>
                                <MenuItem value={7}>7</MenuItem>
                                <MenuItem value={8}>8</MenuItem>
                                <MenuItem value={9}>9</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={11}>11</MenuItem>
                                <MenuItem value={12}>12</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="meridiem-label">AM/PM</InputLabel>
                            <Select labelId="meridiem-label" id="meridiem" name="meridiem" value={timing.meridiem} onChange={handleTimeChange}>
                                <MenuItem value={0}>AM</MenuItem>
                                <MenuItem value={1}>PM</MenuItem>
                            </Select>
                        </FormControl>
            </div>
            <div id="sort">
                        <FormControl>
                            <InputLabel id="month">Month</InputLabel>
                            <Select labelId="month" id="month-select" value={timing.month} name="month" onChange={handleTimeChange}>
                                <MenuItem value={0}>January</MenuItem>
                                <MenuItem value={1}>February</MenuItem>
                                <MenuItem value={2}>March</MenuItem>
                                <MenuItem value={3}>April</MenuItem>
                                <MenuItem value={4}>May</MenuItem>
                                <MenuItem value={5}>June</MenuItem>
                                <MenuItem value={6}>July</MenuItem>
                                <MenuItem value={7}>August</MenuItem>
                                <MenuItem value={8}>September</MenuItem>
                                <MenuItem value={9}>October</MenuItem>
                                <MenuItem value={10}>November</MenuItem>
                                <MenuItem value={11}>December</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="hour">Hour</InputLabel>
                            <Select labelId="hour" id="hour-select" value={timing.hour} name="hour" onChange={handleTimeChange}>
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={6}>6</MenuItem>
                                <MenuItem value={7}>7</MenuItem>
                                <MenuItem value={8}>8</MenuItem>
                                <MenuItem value={9}>9</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={11}>11</MenuItem>
                                <MenuItem value={12}>12</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="meridiem-label">AM/PM</InputLabel>
                            <Select labelId="meridiem-label" id="meridiem" name="meridiem" value={timing.meridiem} onChange={handleTimeChange}>
                                <MenuItem value={0}>AM</MenuItem>
                                <MenuItem value={1}>PM</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="contained" onClick={submit}>Submit</Button>
            </div>
        </div>

        <div className="available">
            {
                bugs
                    ? (bugs.map(function(item) {
                        let name = item.Name.toLowerCase();
                        if (userData) {
                            let collected = collection[name][0];
                            let donated = collection[name][1];
                            if (hidden) {
                                if (!collected) {
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

                    }))
                    : ""
            }
            {
                fish
                    ? (fish.map(function(item) {
                        // console.log(item);
                        let name = item.Name.toLowerCase();
                        if (userData) {
                            let collected = collection[name][0];
                            let donated = collection[name][1];
                            if (hidden) {
                                console.log("hide collected");
                                if (!collected) {
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

                    }))
                    : ""
            }
        </div>
    </div>);
}
// <Button variant="contained" onClick={submit}>Submit</Button>

// <button onClick={signout}>Logout</button>
// <Link to="/login">Login</Link>

export default Main;
