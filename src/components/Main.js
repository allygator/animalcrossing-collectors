import React, { useContext, useState, useEffect } from "react";
import { FirebaseContext } from "./Firebase";
import UserContext from "./UserContext";
import Header from "./Header";
import Intro from "./Intro";
import Critters from "./Critters";
import Options from "./Options";
import Date from "./Date";
import Loadingsvg from "./svg/Loadingsvg";
import cx from "clsx";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp as lightOn } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown as lightOff } from "@fortawesome/free-solid-svg-icons";
import { useSwipeable } from "react-swipeable";

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";

const theme = createMuiTheme({
	palette: {
		primary: {
			main: grey[300],
		},
	},
});

var filterOptions = ["value", "location", "size (fish only)", "alpha"];

function Main(props) {
	const firebase = useContext(FirebaseContext);
	const userData = useContext(UserContext);
	const [type, setType] = useState([]);
	const [typeSub, setTypeSumbitted] = useState([]);
	const [submitted, setSubmitted] = useState(false);
	const [lighting, setLight] = useState(true);
	const [hideDonated, setDonated] = useState(false);
	const [showWholeMonth, setWholeMonth] = useState(false);
	const [monthSub, setMonthSub] = useState(false);
	const [sphere, setSphere] = useState(true);
	const [mobileMenu, showMenu] = useState(false);
	const [picker, setPicker] = useState({ month: 0, hour: 1, meridiem: 0 });
	const [pickerSub, setPickerSubmitted] = useState(false);
	const [usePicker, setPickerUse] = useState(false);
	const [loading, setLoading] = useState();

	const toggleLoading = (val) => {
		if (val) {
			setLoading(val);
		} else {
			setTimeout(() => {
				setLoading(val);
			}, 1000);
		}
	};

	const toggle = () => setLight(!lighting);
	const hemisphere = () => {
		if (userData?.authUser) {
			firebase.db.collection("users").doc(userData.authUser.uid).update({
				sphere: !sphere,
			});
		}
		setSphere(!sphere);
	};
	function reset() {
		setDonated(false);
		setPicker({ month: 0, hour: 1, meridiem: 0 });
		setSubmitted(false);
		setPickerUse(false);
		showMenu(false);
	}

	function handleDonated(e) {
		setDonated(e.target.checked);
	}
	function showDate(e) {
		setPickerUse(e.target.checked);
	}
	function handleMonth(e) {
		setWholeMonth(e.target.checked);
	}

	function move(val) {
		if (val) {
			showMenu(val);
		} else {
			showMenu(!mobileMenu);
		}
	}

	function setChoice(val) {
		setType(val);
	}

	function setSubmittedValues() {
		if (
			typeSub !== type ||
			(pickerSub !== picker && usePicker) ||
			monthSub !== showWholeMonth
		) {
			if (usePicker) {
				setPickerSubmitted(picker);
			}
			setTypeSumbitted(type);
			setSubmitted(true);
			setMonthSub(showWholeMonth);
			toggleLoading(true);
		}
	}

	const handlers = useSwipeable({
		onSwipedUp: () => move(false),
		onSwipedDown: () => move(true),
		preventDefaultTouchmoveEvent: true,
	});

	return (
		<ThemeProvider theme={theme}>
			<div
				className={cx(
					"main",
					lighting && "dark",
					!lighting && "light",
					!submitted && "centered"
				)}
			>
				<Header
					toggle={toggle}
					lighting={lighting}
					sphereUp={hemisphere}
					sphere={sphere}
					reset={reset}
				/>
				<div
					className={cx("info", submitted && "little", mobileMenu && "show")}
					{...handlers}
				>
					{!submitted && <Intro />}
					<div id="quick">
						<Options setChoices={setChoice} />
						{userData?.authUser ? (
							<FormControlLabel
								control={
									<Checkbox
										type="checkbox"
										id="hide-checkbox"
										checked={hideDonated}
										onChange={handleDonated}
									/>
								}
								label="Hide Donated"
							/>
						) : (
							""
						)}
						<FormControlLabel
							control={
								<Checkbox
									type="checkbox"
									id="month-checkbox"
									checked={showWholeMonth}
									onChange={handleMonth}
								/>
							}
							label="Show all month"
						/>
						<FormControlLabel
							control={
								<Checkbox
									type="checkbox"
									id="specific-checkbox"
									checked={usePicker}
									onChange={showDate}
								/>
							}
							label="Select month/hour"
						/>
						{usePicker ? <Date picker={picker} setPicker={setPicker} /> : ""}
						<Button variant="contained" onClick={() => setSubmittedValues()}>
							Search
						</Button>
					</div>
					<FontAwesomeIcon
						icon={mobileMenu ? lightOn : lightOff}
						title="test"
						transform="up-3"
						onClick={() => move()}
						id="menuButton"
					/>
				</div>
				{loading ? <Loadingsvg /> : ""}
				{submitted && (
					<Critters
						hidden={hideDonated}
						hemisphere={sphere}
						toggleLoading={toggleLoading}
						loading={loading}
						specific={pickerSub}
						type={typeSub}
						showMonth={monthSub}
					/>
				)}
			</div>
		</ThemeProvider>
	);
}

export default Main;
