import React, {useContext, useState} from 'react';
import critters from '../critters'
import {FirebaseContext} from './Firebase';
// import UserContext from './UserContext';
import GoogleButton from 'react-google-button';
import {Redirect} from 'react-router-dom';

function Login() {
    const firebase = useContext(FirebaseContext);
    // const userData = useContext(UserContext);
    const [user, setUser] = useState('');

    function signin() {
        firebase.doSignInWithGoogle().then(authUser => {
            setUser(authUser.user);
            if(authUser.additionalUserInfo.isNewUser && firebase) {
                firebase.db.collection('users').doc(authUser.user.uid).set(critters);
            }
        }).catch(error => {
            console.log(error);
        });
    };

    return (<div className="login">

        {
            user
                ? <Redirect
                        to={{
                        pathname: "/"
                      }}
                    />
                : <GoogleButton type="light" onClick={signin} />
        }
    </div>);
}

export default Login;
