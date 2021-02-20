import React, { useContext } from "react";
import { FirebaseContext } from "./Firebase";
import UserContext from "./UserContext";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb as lightOn } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as lightOff } from "@fortawesome/free-regular-svg-icons";
import { faGlobeAmericas as north } from "@fortawesome/free-solid-svg-icons";
import { faGlobeAsia as south } from "@fortawesome/free-solid-svg-icons";

function Header(props) {
	const firebase = useContext(FirebaseContext);
	const userData = useContext(UserContext);

	function signout() {
		firebase.doSignOut();
	}

	return (
		<div id="header">
			<Link to="/">
				<h1 className={props.size ? "hidden" : ""} onClick={props.reset}>
					AC:NH Critter Collector
				</h1>
			</Link>
			<div id="buttons">
				<IconButton onClick={props.toggle} className="button-icons">
					<FontAwesomeIcon
						icon={props.lighting ? lightOff : lightOn}
						title="Switch light mode"
						transform="up-3"
					/>
				</IconButton>
				<IconButton onClick={props.sphereUp} className="button-icons">
					<FontAwesomeIcon
						icon={props.sphere ? north : south}
						title={
							props.sphere
								? "Switch to Southern Hemisphere"
								: "Switch to Northern Hemisphere"
						}
						transform="up-3"
					/>
				</IconButton>
				{userData?.authUser ? (
					<Button variant="contained" onClick={signout} id="signout">
						signout
					</Button>
				) : (
					<Link to="/login">
						<Button variant="contained" id="signin">
							Login
						</Button>
					</Link>
				)}
			</div>
		</div>
	);
}

export default Header;
