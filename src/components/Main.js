import React, {useContext, useState, useEffect} from 'react';
import {FirebaseContext} from './Firebase';
import UserContext from './UserContext';
import Header from './Header';
import Critters from './Critters';
import Button from '@material-ui/core/Button';
import cx from 'clsx';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';

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

function Main(props) {
    const firebase = useContext(FirebaseContext);
    const userData = useContext(UserContext);
    const [type, setType] = useState(0);
    const [lighting, setLight] = useState(true);
    const [hidden, setHidden] = useState(false);
    const [sphere, setSphere] = useState(true);
    const [loading, setLoading] = useState();
    const [month, setMonth] = useState('');
    const toggleLoading = (direction) => {
        setLoading(direction);
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

    let hours = [1];

    return (<div className={cx('main', lighting && 'dark', !lighting && 'light', !type && 'centered')}>

        <Header toggle={toggle} lighting={lighting} size={!type} sphereUp={hemisphere} sphere={sphere}/>
        <div className={type !== 0
                ? "little info"
                : 'info'}>
            {
                type !== 0
                    ? ''
                    : <h1>Welcome to AC:NH Critter Collector.</h1>
            }
            <h2 className={type !== 0
                    ? 'hidden'
                    : ''}>Select one of the quick options for critter availability right now.</h2>
            <h3 className={userData
                    ? "reduce hidden"
                    : "reduce"}>Login to save what you have caught and donated.</h3>
            <p className={type !== 0
                    ? 'hidden'
                    : ''}>Click the globe at the top to switch hemispheres.</p>
            <div id="quick">
                <Button variant="contained" onClick={() => {
                        setType(2);
                        toggleLoading(true);
                    }}>
                    <span className="reduce">Available&nbsp;</span>Bugs</Button>
                <Button variant="contained" onClick={() => {
                        setType(3);
                        toggleLoading(true);
                    }}>
                    <span className="reduce">Available&nbsp;</span>Fish</Button>
                <Button variant="contained" onClick={() => {
                        setType(1);
                        toggleLoading(true);
                    }}>All<span className="reduce">&nbsp;Available</span>
                </Button>
                {
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
            <div>
                <h3>Search specific month/hour:</h3>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Month</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" value={month}>
                        {
                            months.map((month, index) => {
                                return <MenuItem value={index} key={month}>{month}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Hour</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" value={month}>
                        {
                            hours.map((hour) => {
                                return <MenuItem value={hour} key={hour}>{hour}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Meridiam</InputLabel>
                    <Select labelId="demo-simple-select-label" id="demo-simple-select" value={month}>
                        {
                            months.map((month, index) => {
                                return <MenuItem value={index} key={month}>{month}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
            </div>
        </div>
        {
            type !== 0
                ? <Critters type={type} hidden={hidden} hemisphere={sphere} toggleLoading={toggleLoading} loading={loading}/>
                : ''
        }
    </div>);
}

export default Main;
