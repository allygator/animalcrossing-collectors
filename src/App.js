import React, {useEffect, useContext, useState}  from 'react';
import './App.css';
import Login from './components/Login';
import Main from './components/Main';
import UserContext  from './components/UserContext';
import  { FirebaseContext } from './components/Firebase';
import  {BrowserRouter as Router, Route, Switch, } from 'react-router-dom';

function App() {
    const firebase = useContext(FirebaseContext);
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

      }, [firebase])
      //This function is passed to the context provider so that
      // down range children can update the context
      function userUpdate(data) {
        setContext({...state, authUser: data});
      };
  return (
    <Router>
      <UserContext.Provider value={state}>
          <Switch>
              <Route path='/' exact component={Main}/>
              <Route path='/login' component={Login}/>
          </Switch>

      </UserContext.Provider>
      </Router>
  );
}

export default App;
