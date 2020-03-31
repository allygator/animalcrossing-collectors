import React, {useContext, useState, useEffect} from 'react';
import {FirebaseContext} from './Firebase';
import UserContext from './UserContext';
import Header from './Header';
import Critters from './Critters';
import Button from '@material-ui/core/Button';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
// import {faLightbulb as lightOn} from '@fortawesome/free-solid-svg-icons';
// import {faLightbulb as lightOff} from '@fortawesome/free-regular-svg-icons';

function Main() {
    const firebase = useContext(FirebaseContext);
    const userData = useContext(UserContext);
    const [type, setType] = useState(0);
    // const [bugs, addBugs] = useState([]);
    // const [fish, addFish] = useState([]);
    const [mode, setMode] = useState(true);
    const [hidden, setHidden] = useState(false);
    const [collection, setCollection] = useState({});
    const toggle = () => setMode(!mode);

    useEffect(() => {
        if (userData && userData.authUser) {
            firebase.db.collection("users").doc(userData.authUser.uid).get().then(function(querySnapshot) {
                setCollection(querySnapshot.data());
            });
        }
    }, [userData, firebase.db]);

    // function handleChange(e) {
    //     setHidden(e.target.checked);
    // }

    return (<div className={mode
            ? "dark main"
            : "light main"}>
        <Header toggle={toggle} mode={mode}/>
        <div className={type !== 0
                ? "little info"
                : 'info'}>
            <h1>Welcome to AC:NH Critter Collector.</h1>
            <h2>Select one of the quick options for critter availability right now.</h2>
            <div id="quick">
                <Button variant="contained" onClick={() => setType(2)}>
                    <span className="reduce">Available&nbsp;</span>Bugs</Button>
                <Button variant="contained" onClick={() => setType(3)}>
                    <span className="reduce">Available&nbsp;</span>Fish</Button>
                <Button variant="contained" onClick={() => setType(1)}>All<span className="reduce">&nbsp;Available</span>
                </Button>
            </div>
        </div>
        {type !== 0 ? <Critters type={type} hidden={hidden} /> : ''}
    </div>);
}

// <button onClick={signout}>Logout</button>
// <Link to="/login">Login</Link>

export default Main;
