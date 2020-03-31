import React, {useContext} from 'react';
import {FirebaseContext} from './Firebase';
import UserContext from './UserContext';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLightbulb as lightOn} from '@fortawesome/free-solid-svg-icons';
import {faLightbulb as lightOff} from '@fortawesome/free-regular-svg-icons';

function Header(props) {
    const firebase = useContext(FirebaseContext);
    const userData = useContext(UserContext);

    function signout() {
        firebase.doSignOut()
    };

    return (
        <div id="header">
            {
                userData
                    ? <Button variant="contained" onClick={signout} id="signout">signout</Button>
                    : <Link to='/login'><Button variant="contained" id="signin">Login</Button></Link>
            }
            <IconButton onClick={props.toggle} id="lights">
                <FontAwesomeIcon icon={props.mode
                        ? lightOff
                        : lightOn} title="Switch light mode" transform="up-3"/>
            </IconButton>
    </div>);
}

// <button onClick={signout}>Logout</button>
// <Link to="/login">Login</Link>

export default Header;
