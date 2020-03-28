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

    // useEffect(() => {
    //     let unsubscribe = firebase.auth.onAuthStateChanged(authUser => {
    //         // console.log(firebase.auth.currentUser);
    //         authUser ? setUser(authUser) : setUser(null);
    //     });
    //     return () => unsubscribe();
    // }, [firebase.auth])


    // useEffect(() => {
    //     userData.updateUser({authUser: user });
    //     console.log(userData);
    //     console.log(user);
    // }, [])

    const googleLogin = <GoogleButton type="light" onClick={signin} />;


    return (<div className="login">

        {
            user
                ? <Redirect
                        to={{
                        pathname: "/"
                      }}
                    />
                : googleLogin
        }
    </div>);
}

export default Login;
