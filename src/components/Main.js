import React, {useContext, useState, useEffect} from 'react';
import {FirebaseContext} from './Firebase';
import UserContext from './UserContext';
import Header from './Header';
import Critters from './Critters';
import Options from './Options';
import Loadingsvg from './svg/Loadingsvg';
import cx from 'clsx';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';

import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: grey[300]
        }
    }
});

var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
var hours = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12
];

var meridiamOptions = ["AM", "PM"];

function Main(props) {
    const firebase = useContext(FirebaseContext);
    const userData = useContext(UserContext);
    const [type, setType] = useState(0);
    const [lighting, setLight] = useState(true);
    const [hidden, setHidden] = useState(false);
    const [sphere, setSphere] = useState(true);
    const [loading, setLoading] = useState();
    const [picker, setPicker] = useState({month: 0, hour: 1, meridiam: 0});
    const [pickerSub, setSubmitted] = useState({month: 0, hour: 1, meridiam: 0});
    const [usePicker, setPickerUse] = useState(false);
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
        if (usePicker !== val) {
            setPickerUse(val);
        }
        setSubmitted({
            ...pickerSub,
            picker
        });
    };
    const toggle = () => setLight(!lighting);
    const hemisphere = () => {
        if (
            userData
            ?.authUser) {
            firebase.db.collection('users').doc(userData.authUser.uid).update({
                sphere: !sphere
            });
        }
        setSphere(!sphere)
    };

    const handleTimeChange = (event) => {
        const name = event.target.name;
        setPicker({
            ...picker,
            [name]: event.target.value
        });
    };
    useEffect(() => {
        if (
            userData
            ?.authUser) {
            let unsubscribe = firebase.db.collection('users').doc(userData.authUser.uid).onSnapshot(snapshot => {
                if (!snapshot.data().sphere) {} else {
                    if (sphere !== snapshot.data().sphere) {
                        setSphere(snapshot.data().sphere);
                    }
                }
            }, err => {
                console.log(err)
            })
            return() => unsubscribe();
        } else {
            return;
        }
    }, [firebase, userData, sphere]);

    function handleChange(e) {
        setHidden(e.target.checked);
    }
    // {type !== 0
    //         ? "little info"
    //         : 'info'}
    return (<ThemeProvider theme={theme}>
        <div className={cx('main', lighting && 'dark', !lighting && 'light', !type && 'centered')}>

            <Header toggle={toggle} lighting={lighting} size={!type} sphereUp={hemisphere} sphere={sphere}/>
            <div className={cx('info', !!type && "little")}>
                {
                    type !== 0
                        ? ''
                        : <h1>Welcome to AC:NH Critter Collector.</h1>
                }
                <p className={type !== 0
                        ? 'hidden'
                        : ''}>Use the globe to switch hemispheres.</p>
                    <p className={type !== 0
                        ? 'hidden'
                        : ''}>Use the quick options for critter availability right now.</p>
                <h3 className={userData
                        ? "reduce hidden"
                        : "reduce"}>Login to save what you have caught and donated.</h3>

                <div id="quick">
                    <Options setType={pickType} toggleLoading={toggleLoading} date={false} submit={submit}/> {
                        userData
                            ? <FormControlLabel control={<Checkbox type = "checkbox" id = "hide" checked = {
                                        hidden
                                    }
                                    onChange = {
                                        handleChange
                                    } />} label="Hide Donated"/>
                            : ''
                    }
                </div>
                <div id="specific">
                    <h3>Search specific month/hour:</h3>
                    <div id="specific-options">
                        <div id="dropdowns">
                        <FormControl className="specific-form">
                            <InputLabel id="month">Month</InputLabel>
                            <Select labelId="month" id="demo-simple-select" value={picker.month} name="month" onChange={handleTimeChange}>
                                {
                                    months.map((month, index) => {
                                        return <MenuItem value={index} key={month}>{month}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                        <FormControl className="specific-form">
                            <InputLabel id="hour">Hour</InputLabel>
                            <Select labelId="hour" id="demo-simple-select" value={picker.hour} onChange={handleTimeChange} name="hour">
                                {
                                    hours.map((hour) => {
                                        return <MenuItem value={hour} key={hour}>{hour}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                        <FormControl className="specific-form">
                            <InputLabel id="meridiam">Meridiam</InputLabel>
                            <Select labelId="meridiam" id="demo-simple-select" value={picker.meridiam} onChange={handleTimeChange} name="meridiam">
                                {
                                    meridiamOptions.map((thing, index) => {
                                        return <MenuItem value={index} key={thing}>{thing}</MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                        </div>
                        <Options type="specific" toggleLoading={toggleLoading} setType={pickType} date={true} submit={submit}/>
                    </div>
                </div>

            </div>
            {
                loading
                    ? <Loadingsvg/>
                    : ''
            }
            {
                type !== 0
                    ? usePicker
                        ? <Critters type={type} hidden={hidden} hemisphere={sphere} toggleLoading={toggleLoading} loading={loading} specific={picker}/>
                        : <Critters type={type} hidden={hidden} hemisphere={sphere} toggleLoading={toggleLoading} loading={loading}/>
                    : ''
            }
        </div>
    </ThemeProvider>);
}

export default Main;
