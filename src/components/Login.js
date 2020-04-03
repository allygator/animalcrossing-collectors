import React, {useContext, useState, useEffect} from 'react';
import critters from '../critters'
import {FirebaseContext} from './Firebase';
// import UserContext from './UserContext';
import GoogleButton from 'react-google-button';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import {Redirect} from 'react-router-dom';

function Login() {
    const firebase = useContext(FirebaseContext);
    // const userData = useContext(UserContext);
    const [user, setUser] = useState('');
    const [newUser, setNewUser] = useState({email: null, password: null});
    const [returnUser, setReturnUser] = useState({email: null, password: null});
    const [hemisphere, setSphere] = useState("northern");
    const [total, setTotal] = useState(critters);

    const handleChangeIn = name => event => {
        console.log(event.target.value);
        setReturnUser({
            ...returnUser,
            [name]: event.target.value
        });
    };
    const handleChangeUp = name => event => {
        console.log(event.target.value);
        setNewUser({
            ...newUser,
            [name]: event.target.value
        });
    };

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
        firebase.doSignInWithEmailAndPassword(email, pass).catch(error => {
            console.log(error);
        });
    }

    function signUp(email, pass) {
        console.log(total);
        firebase.doCreateUserWithEmailAndPassword(email, pass).then(authUser => {
            if (authUser.additionalUserInfo.isNewUser) {
                if (firebase) {
                    firebase.db.collection("users").doc(authUser.user.uid).set(total);
                }
            }
        }).catch(error => {
            console.log(error);
        });
    }

    let display = <div id="login-container">
        <div className="user-fields">
            <h2>New User?</h2>
            <FormControl component="fieldset">
                <FormLabel component="legend">Select your in-game hemisphere</FormLabel>
                <RadioGroup aria-label="Hemisphere" name="Hemisphere" value={hemisphere} onChange={handleChange}>
                    <FormControlLabel value="northern" control={<Radio />} label="Northern"/>
                    <FormControlLabel value="southern" control={<Radio />} label="Southern"/>
                </RadioGroup>
            </FormControl>
            <div className="inputs">
                <TextField id="new-email" label="Email" type="email" autoComplete="email" margin="normal" onChange={handleChangeUp("email")}/>
                <TextField id="new-password" label="Password" type="password" autoComplete="current-password" onChange={handleChangeUp("password")} margin="normal"/>
            </div>
            <Button variant="contained" onClick={() => signUp(newUser.email, newUser.password)}>Sign Up</Button>
            <p>Or</p>
            <GoogleButton type="light" onClick={gSignin} label='Sign up with Google'/>
        </div>
        <div id="divider"></div>
        <div className="user-fields">
            <h2>Returning User?</h2>
            <div className="inputs">
                <TextField id="return-email" label="Email" type="email" autoComplete="email" margin="normal" onChange={handleChangeIn("email")}/>
                <TextField id="return-password" label="Password" type="password" autoComplete="current-password" margin="normal" onChange={handleChangeIn("password")}/>
            </div>
            <Button variant="contained" onClick={() => signIn(returnUser.email, returnUser.password)}>Sign In</Button>
            <p>Or</p>
            <GoogleButton type="light" onClick={gSignin}/>
        </div>
    </div>

    return (<div className="login">
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
