import React, {useContext} from 'react';
import {FirebaseContext} from './Firebase';
import UserContext from './UserContext';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLightbulb as lightOn} from '@fortawesome/free-solid-svg-icons';
import {faLightbulb as lightOff} from '@fortawesome/free-regular-svg-icons';
import {faGlobeAmericas as north} from '@fortawesome/free-solid-svg-icons';
import {faGlobeAsia as south} from '@fortawesome/free-solid-svg-icons';

function Header(props) {
    const firebase = useContext(FirebaseContext);
    const userData = useContext(UserContext);

    function signout() {
        firebase.doSignOut()
    };

    return (
        <div id="header">
            {!props.size ? <h1>AC:NH Critter Collector</h1> : ''}
            <div id="buttons">
            <IconButton onClick={props.toggle} id="button-icons">
                <FontAwesomeIcon icon={props.lighting
                        ? lightOff
                        : lightOn} title="Switch light mode" transform="up-3"/>
            </IconButton>
            <IconButton onClick={props.sphereUp} id="button-icons">
                <FontAwesomeIcon icon={props.sphere
                        ? north
                        : south} title={props.sphere ? 'Switch to Southern Hemisphere' : 'Switch to Northern Hemisphere'}  transform="up-3"/>
            </IconButton>
            {
                userData
                    ? <Button variant="contained" onClick={signout} id="signout">signout</Button>
                    : <Link to='/login'><Button variant="contained" id="signin">Login</Button></Link>
            }
            </div>
    </div>);
}

// <button onClick={signout}>Logout</button>
// <Link to="/login">Login</Link>

export default Header;
