import React, {useEffect, useContext, useState}  from 'react';
import './App.scss';
import Login from './components/Login';
import Main from './components/Main';
import UserContext  from './components/UserContext';
import  { FirebaseContext } from './components/Firebase';
import  {BrowserRouter as Router, Route, Switch, } from 'react-router-dom';

function App() {
    const firebase = useContext(FirebaseContext);
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
          <Switch>

              <Route path='/login'><Login /></Route>
              <Route path='/bugs'><Main thing="test"/></Route>
              <Route path='/' exact><Main /></Route>
          </Switch>

      </UserContext.Provider>
      </Router>
  );
}

export default App;
