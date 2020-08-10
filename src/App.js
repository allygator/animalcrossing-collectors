<<<<<<< Updated upstream
import React, {useEffect, useContext, useState}  from 'react';
import './App.scss';
import Login from './components/Login';
import Main from './components/Main';
import Loading from './components/Loading';
import UserContext  from './components/UserContext';
import  { FirebaseContext } from './components/Firebase';
import  {BrowserRouter as Router, Route, Switch, } from 'react-router-dom';

function App() {
    const firebase = useContext(FirebaseContext);
=======
import React, { useEffect, useContext, useState, createContext } from "react";
import "./App.scss";
import Login from "./components/Login";
import Main from "./components/Maincopy";
import Other from "./components/Other";
import Loading from "./components/Loading";
import UserContext from "./components/UserContext";
import Constants from "./components/Constants";
import { FirebaseContext } from "./components/Firebase";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  const firebase = useContext(FirebaseContext);
  // eslint-disable-next-line
  const [user, setUser] = useState("");
  const [state, setContext] = useState({
    authUser: user,
    updateUser: userUpdate,
  });

  const [constants, setContents] = useState({
    options: [
      "Bugs",
      "Fish",
      "Diving",
      "Paintings",
      "Statues",
      "Fossils",
      "Songs",
    ],
    filters: ["value", "location", "size (fish only)", "alpha"],
  });

  //onAuthStateChanged provided by the firebase api creates a listener
  // that updates the authUser object based on any changes
  useEffect(() => {
    firebase.auth.onAuthStateChanged((authUser) => {
      authUser
        ? setContext({ ...state, authUser: authUser })
        : setContext(null);
    });
>>>>>>> Stashed changes
    // eslint-disable-next-line
      const [user, setUser] = useState('');
      const [state, setContext] = useState({authUser: user, updateUser: userUpdate});

      //onAuthStateChanged provided by the firebase api creates a listener
      // that updates the authUser object based on any changes
      useEffect(() => {
          firebase.auth.onAuthStateChanged(authUser => {
              authUser
                  ? setContext({...state, authUser: authUser})
                  : setContext(null)
          });
          // eslint-disable-next-line
      }, [firebase])
      //This function is passed to the context provider so that
      // down range children can update the context
      function userUpdate(data) {
        setContext({...state, authUser: data});
      };
  return (
    <Router>
      <UserContext.Provider value={state}>
<<<<<<< Updated upstream
          <Switch>

              <Route path='/login'><Login /></Route>
              <Route path='/loading'><Loading /></Route>
              <Route path='/' exact><Main /></Route>
          </Switch>

=======
        <Constants.Provider value={constants}>
          <Switch>
            <Route path="/other">
              <Other />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/loading">
              <Loading />
            </Route>
            <Route path="/" exact>
              <Main />
            </Route>
          </Switch>
        </Constants.Provider>
>>>>>>> Stashed changes
      </UserContext.Provider>
      </Router>
  );
}

export default App;
