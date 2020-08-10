import React, { useContext, useState, useEffect } from "react";

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

import { FirebaseContext } from "./Firebase";
import UserContext from "./UserContext";
import Header from "./Header";
import Critters from "./Critters";
import Options from "./Options";
import Date from "./Date";
import Constants from "./Constants";
import Loadingsvg from "./svg/Loadingsvg";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey[300],
    },
  },
});

var filterOptions = ["value", "location", "size (fish only)", "alpha"];

function Main(props) {
  const constants = useContext(Constants);
  const firebase = useContext(FirebaseContext);
  const userData = useContext(UserContext);
  const [type, setType] = useState([]);
  const [lighting, setLight] = useState(true);
  const [hideDonated, setDonated] = useState(false);
  const [sphere, setSphere] = useState(true);
  const [loading, setLoading] = useState();
  const [picker, setPicker] = useState({ month: 0, hour: 1, meridiem: 0 });
  const [pickerSub, setSubmitted] = useState();
  const [usePicker, setPickerUse] = useState(false);
  const [mobileMenu, showMenu] = useState(false);
  const [sort, setSort] = useState(3);
  const toggleLoading = (val) => {
    if (val) {
      setLoading(val);
    } else {
      setTimeout(() => {
        setLoading(val);
      }, 1000);
    }
  };
  const pickType = (val) => {
    setType(val);
  };
  const submit = (val) => {
    if (val) {
      setSubmitted({
        ...pickerSub,
        month: picker.month,
        hour: picker.hour,
        meridiem: picker.meridiem,
      });
    } else {
      setSubmitted();
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

  useEffect(() => {
    if (userData?.authUser) {
      let unsubscribe = firebase.db
        .collection("users")
        .doc(userData.authUser.uid)
        .onSnapshot(
          (snapshot) => {
            if (!snapshot.data().sphere) {
            } else {
              if (sphere !== snapshot.data().sphere) {
                setSphere(snapshot.data().sphere);
              }
            }
          },
          (err) => {
            console.log(err);
          }
        );
      return () => unsubscribe();
    } else {
      return;
    }
  }, [firebase, userData, sphere]);
  useEffect(() => {
    if (Object.keys(constants?.options).length > 0) {
      let tempArr = new Array(constants.options.length);
      console.log(tempArr);
      for (let i = 0; i < constants.options.length; i++) {
        if (i < 2) tempArr[i] = true;
        else tempArr[i] = false;
      }
      console.log(tempArr);
      setType(tempArr);
    }
  }, [constants.options]);

  useEffect(() => {
    console.log(type);
  }, [type]);

  function handleChange(e) {
    setDonated(e.target.checked);
  }

  function showDate(e) {
    setPickerUse(e.target.checked);
  }

  function move(val) {
    if (val) {
      showMenu(val);
    } else {
      showMenu(!mobileMenu);
    }
  }
  const handlers = useSwipeable({
    onSwipedUp: () => move(false),
    onSwipedDown: () => move(true),
    preventDefaultTouchmoveEvent: true,
  });

  function reset() {
    setType(0);
    setDonated(false);
    setPicker({ month: 0, hour: 1, meridiem: 0 });
    setSubmitted();
    setPickerUse(false);
    showMenu(false);
  }

  function updateSortVal(e) {
    setSort(e.target.value);
    // sortFunc(e.target.value);
  }

  return (
    <ThemeProvider theme={theme}>
      <div
        className={cx(
          "main",
          lighting && "dark",
          !lighting && "light",
          !type && "centered"
        )}
      >
        <Header
          toggle={toggle}
          lighting={lighting}
          size={!type}
          sphereUp={hemisphere}
          sphere={sphere}
          reset={reset}
        />
        <div
          className={cx("info", !!type && "little", mobileMenu && "show")}
          {...handlers}
        >
          {type !== 0 ? "" : <h1>Welcome to AC:NH Critter Collector.</h1>}
          <p className={type !== 0 ? "hidden" : ""}>
            Use the globe to switch hemispheres.
          </p>
          <p className={type !== 0 ? "hidden" : ""}>
            By default the buttons will display the currently available critters
            in your timezone. If your game is not in your timezone, check the
            box and use the specific month/time selectors{" "}
          </p>
          <h3 className={userData ? "reduce hidden" : "reduce"}>
            Login to save what you have caught and donated.
          </h3>

          <div id="quick">
            <Options
              setType={pickType}
              toggleLoading={toggleLoading}
              submit={submit}
              type={type}
            />
            <Button
              variant="contained"
              onClick={() => {
                if (type === 4) {
                } else {
                  setType(4);
                  toggleLoading(true);
                }
              }}
              id="monthButton"
            >
              Search<span className="reduce">&nbsp;Collections</span>
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setType(4);
                toggleLoading(true);
              }}
              id="monthButton"
            >
              <span className="reduce">All&nbsp;</span> Month
            </Button>

            {userData ? (
              <FormControlLabel
                control={
                  <Checkbox
                    type="checkbox"
                    id="hide"
                    checked={hideDonated}
                    onChange={handleChange}
                  />
                }
                label="Hide Donated"
              />
            ) : (
              ""
            )}
          </div>
          {type !== 0 ? (
            <div id="sort">
              <FormControl>
                <InputLabel id="sortLabel">Sort Order</InputLabel>
                <Select
                  labelId="sortLabel"
                  value={sort}
                  name="filter"
                  onChange={updateSortVal}
                >
                  {filterOptions.map((option, index) => {
                    return (
                      <MenuItem
                        value={index}
                        key={option}
                        disabled={type === 1 && index === 2}
                      >
                        {option}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          ) : (
            ""
          )}
          <FormControlLabel
            control={
              <Checkbox
                type="checkbox"
                id="specific-checkbox"
                checked={usePicker}
                onChange={showDate}
              />
            }
            label="Use specific month/hour"
          />
          {usePicker ? (
            <Date
              picker={picker}
              setPicker={setPicker}
              toggleLoading={toggleLoading}
              loading={loading}
              pickType={pickType}
              submit={submit}
            />
          ) : (
            ""
          )}

          <FontAwesomeIcon
            icon={mobileMenu ? lightOn : lightOff}
            title="test"
            transform="up-3"
            onClick={() => move()}
            id="menuButton"
          />
        </div>
        {loading ? <Loadingsvg /> : ""}
        {type !== 0 ? (
          <Critters
            type={type}
            hidden={hideDonated}
            hemisphere={sphere}
            toggleLoading={toggleLoading}
            loading={loading}
            specific={pickerSub}
            sort={sort}
          />
        ) : (
          ""
        )}
      </div>
    </ThemeProvider>
  );
}

export default Main;
