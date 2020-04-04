import React, {useContext, useState, useEffect} from 'react';
import critters from '../critters'
import {FirebaseContext} from './Firebase';
import UserContext from './UserContext';
import GoogleButton from 'react-google-button';
import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import {Redirect, Link} from 'react-router-dom';

const BrownRadio = withStyles({
  root: {
    "&$checked": {
      color: "#68403C"
    }
  },
  checked: {}
})(props => <Radio color="default" {...props} />);


function Login() {
    const firebase = useContext(FirebaseContext);
    const userData = useContext(UserContext);
    const [user, setUser] = useState('');
    const [newUser, setNewUser] = useState({email: null, password: null});
    const [returnUser, setReturnUser] = useState({email: null, password: null});
    const [hemisphere, setSphere] = useState("northern");
    const [total, setTotal] = useState(critters);
    const [error, setError] = useState({newEmail: false, newPass: false, returnEmail: false, returnPass: false, message: ''});

    const handleChangeIn = name => event => {
        if(error.returnEmail || error.returnPass) {
            reset();
        }
        setReturnUser({
            ...returnUser,
            [name]: event.target.value
        });
    };
    const handleChangeUp = name => event => {
        if(error.newEmail || error.newPass) {
            reset();
        }
        setNewUser({
            ...newUser,
            [name]: event.target.value
        });
    };

    function reset() {
        setError({newEmail: false, newPass: false, returnEmail: false, returnPass: false, message: ''});
    }

    useEffect(() => {
        if (hemisphere === "northern") {
            setTotal(t => ({
                ...t,
                "sphere": true
            }));
        } else {
            setTotal(t => ({
                ...t,
                "sphere": false
            }));
        }

    }, [hemisphere]);

    useEffect(() => {
        if(userData?.authUser) {
            setUser(userData);
        }
    }, [userData]);

    const handleChange = (event) => {
        setSphere(event.target.value);
    };

    function gSignin() {
        firebase.doSignInWithGoogle().then(authUser => {
            setUser(authUser.user);
            if (authUser.additionalUserInfo.isNewUser && firebase) {
                firebase.db.collection('users').doc(authUser.user.uid).set(total);
            }
        }).catch(error => {
            console.log(error);
        });
    };

    function signIn(email, pass) {
        try {
                firebase.doSignInWithEmailAndPassword(email, pass);
        } catch(err) {
            errorHandler('in', err);
        }
    }

    function signUp(email, pass) {
        try {
            firebase.doCreateUserWithEmailAndPassword(email, pass).then(authUser => {
                if (authUser.additionalUserInfo.isNewUser) {
                    if (firebase) {
                        firebase.db.collection("users").doc(authUser.user.uid).set(total);
                    }
                }
            }).catch(err => {
                errorHandler('up', err);
            });
        } catch(err) {
            errorHandler('up', err);
        }
    }

    function errorHandler(type, err) {
        let email;
        let pass;
        if(type === 'up') {
            email = 'newEmail';
            pass = 'newPass'
        } else {
            email = 'returnEmail';
            pass = 'returnPass';
        }
        switch (err.code) {
            case "auth/argument-error":
                switch (err.message) {
                    case 'createUserWithEmailAndPassword failed: First argument "email" must be a valid string.':
                        setError({...error, [email]: true, message: 'Please enter an email address'});
                        break;
                    case 'createUserWithEmailAndPassword failed: Second argument "password" must be a valid string.':
                        setError({...error, [pass]: true, message: 'Please enter a password'});
                        break;
                    case 'signInWithEmailAndPassword failed: First argument "email" must be a valid string.':
                        setError({...error, [email]: true, message: 'Please enter an email address'});
                        break;
                    case 'signInWithEmailAndPassword failed: Second argument "password" must be a valid string.':
                        setError({...error, [pass]: true, message: 'Please enter a password'});
                        break;
                    default:
                        break;
                }
                break;
            case "auth/invalid-email":
                setError({...error, [email]: true, message: 'Invalid email. Format: an@example.com'});
                break;
            case "auth/weak-password":
                setError({...error, [pass]: true, message: 'Password should be at least 6 characters'});
                break;
            case "auth/email-already-in-use":
                setError({...error, [email]: true, message: 'Looks like you have already signed up, please sign in.'});
                break;
            default:
                break;
        }
    }

    let display = <div id="login-container">
        <div className="user-fields">
            <h2>New User?</h2>
            <FormControl component="fieldset">
                <FormLabel component="legend">Select your in-game hemisphere</FormLabel>
                <RadioGroup aria-label="Hemisphere" name="Hemisphere" value={hemisphere} onChange={handleChange}>
                    <FormControlLabel value="northern" control={<BrownRadio />} label="Northern"/>
                    <FormControlLabel value="southern" control={<BrownRadio />} label="Southern"/>
                </RadioGroup>
            </FormControl>
            <div className="inputs">
                <TextField id="new-email" label="Email" type="email" autoComplete="email" margin="normal" onChange={handleChangeUp("email")} error={error.newEmail}/>
                <p id="newEmail" className={error.newEmail ? "error" : "hidden"}>{error.message}</p>
                <TextField id="new-password" label="Password" type="password" autoComplete="current-password" onChange={handleChangeUp("password")} margin="normal"  error={error.newPass}/>
                <p id="newEmail" className={error.newPass ? "error" : "hidden"}>{error.message}</p>
            </div>
            <Button variant="contained" onClick={() => signUp(newUser.email, newUser.password)}>Sign Up</Button>
            <p>Or</p>
            <GoogleButton type="light" onClick={gSignin} label='Sign up with Google'/>
        </div>
        <div id="divider"></div>
        <div className="user-fields">
            <h2>Returning User?</h2>
            <div className="inputs">
                <TextField id="return-email" label="Email" type="email" autoComplete="email" margin="normal" onChange={handleChangeIn("email")} error={error.returnEmail}/>
                <p id="returnEmail" className={error.returnEmail ? "error" : "hidden"}>{error.message}</p>
                <TextField id="return-password" label="Password" type="password" autoComplete="current-password" margin="normal" onChange={handleChangeIn("password")} error={error.returnPass}/>
                <p id="returnPass" className={error.returnPass ? "error" : "hidden"}>{error.message}</p>
            </div>
            <Button variant="contained" onClick={() => signIn(returnUser.email, returnUser.password)}>Sign In</Button>
            <p>Or</p>
            <GoogleButton type="light" onClick={gSignin}/>
        </div>
    </div>

    return (<div className="login">
        <div id="header"><Link to='/'><Button variant="contained">Home</Button></Link></div>
        <h1>Login to track your Animal Crossing critter collection</h1>
        {
            user
                ? <Redirect to={{
                            pathname: "/"
                        }}/>
                : display
        }
    </div>);
}

export default Login;
