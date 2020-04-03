import React, {useContext, useState} from 'react';
import critters from '../critters'
import {FirebaseContext} from './Firebase';
// import UserContext from './UserContext';
import GoogleButton from 'react-google-button';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Redirect} from 'react-router-dom';

function Login() {
    const firebase = useContext(FirebaseContext);
    // const userData = useContext(UserContext);
    const [user, setUser] = useState('');
    const [newUser, setNewUser] = useState({email:null, password:null});
    const [returnUser, setReturnUser] = useState({email:null, password:null})

    const handleChangeIn = name => event => {
        console.log(event.target.value);
        setReturnUser({ ...returnUser, [name]: event.target.value });
    };
    const handleChangeUp = name => event => {
        console.log(event.target.value);
        setNewUser({ ...newUser, [name]: event.target.value });
    };

    function gSignin() {
        firebase.doSignInWithGoogle().then(authUser => {
            setUser(authUser.user);
            if(authUser.additionalUserInfo.isNewUser && firebase) {
                firebase.db.collection('users').doc(authUser.user.uid).set(critters);
            }
        }).catch(error => {
            console.log(error);
        });
    };

    function signIn(email, pass) {
        firebase
      .doSignInWithEmailAndPassword(email, pass)
      .catch(error => {
        console.log(error);
      });
    }

    function signUp(email, pass) {
        firebase
      .doCreateUserWithEmailAndPassword(email, pass).then(authUser => {
    if (authUser.additionalUserInfo.isNewUser) {
        if (firebase) {
            firebase.db.collection("users").doc(authUser.user.uid).set({bank: 0, admin: false, name: ''});
        }
    }
}).catch(error => {
    console.log(error);
});
    }

    let display = <div id="login-container">
        <div className="user-fields">
            <h2>New User?</h2>
            <div className="inputs">
            <TextField
                id="new-email"
                label="Email"
                type="email"
                autoComplete="email"
                margin="normal"
                onChange={handleChangeUp("email")}
            />
            <TextField
              id="new-password"
              label="Password"
              type="password"
              autoComplete="current-password"
              onChange={handleChangeUp("password")}
              margin="normal"
            />
        </div>
        <Button onClick={() => signUp(newUser.email, newUser.password)}>Sign Up</Button>
        <p>Or</p>
            <GoogleButton type="light" onClick={gSignin} label='Sign up with Google'/>
        </div>
        <div id="divider"></div>
        <div className="user-fields"><h2>Returning User?</h2>
        <div className="inputs">
            <TextField
                  id="return-email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  margin="normal"
                  onChange={handleChangeIn("email")}
                />
            <TextField
              id="return-password"
              label="Password"
              type="password"
              autoComplete="current-password"
              margin="normal"
              onChange={handleChangeIn("password")}
            />
        </div>
        <Button onClick={() => signIn(returnUser.email, returnUser.password)}>Sign In</Button>
        <p>Or</p>
            <GoogleButton type="light" onClick={gSignin} />
        </div>
    </div>

    return (<div className="login">
    <h1>Login to track your Animal Crossing critter collection</h1>
        {
            user
                ? <Redirect
                        to={{
                        pathname: "/"
                      }}
                    />
                : display
        }
    </div>);
}

export default Login;
