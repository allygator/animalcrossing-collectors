import React, { useEffect, useContext, useState } from "react";
import "./App.scss";
import Login from "./components/Login";
import Main from "./components/Main";
import Loading from "./components/Loading";
import LoadingSplash from "./components/LoadingSplash";
import UserContext from "./components/UserContext";
import { FirebaseContext } from "./components/Firebase";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
	const firebase = useContext(FirebaseContext);
	const [state, setContext] = useState({
		authUser: "",
		updateUser: userUpdate,
	});
	const [loading, setLoading] = useState(true);

	//onAuthStateChanged provided by the firebase api creates a listener
	// that updates the authUser object based on any changes
	useEffect(() => {
		firebase.auth.onAuthStateChanged((authUser) => {
			test(authUser);
		});
		// eslint-disable-next-line
	}, [firebase]);

	function test(authUser) {
		if (authUser) {
			setTimeout(() => {
				setLoading(false);
			}, 1250);
			setContext({ ...state, authUser: authUser });
		} else {
			setTimeout(() => {
				setLoading(false);
			}, 1250);
			setContext({ ...state, authUser: "" });
		}
	}

	// useEffect(() => {
	//   console.log(loading);
	// }, [loading])

	//This function is passed to the context provider so that
	// down range children can update the context
	function userUpdate(data) {
		setContext({ ...state, authUser: data });
	}
	if (loading) {
		return <LoadingSplash />;
	} else {
		return (
			<UserContext.Provider value={state}>
				<Router>
					<Switch>
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
				</Router>
			</UserContext.Provider>
		);
	}
}

export default App;
