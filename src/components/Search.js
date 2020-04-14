import React, {useContext, useState} from 'react';
import UserContext from './UserContext';
import Options from './Options';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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

function Search(props) {
    console.log(props)
    const userData = useContext(UserContext);
    const [hidden, setHidden] = useState(false);
    const [picker, setPicker] = useState({month: 0, hour: 1, meridiam: 0});
    const handleTimeChange = (event) => {
        const name = event.target.name;
        setPicker({
            ...picker,
            [name]: event.target.value
        });
    };
    function handleChange(e) {
        setHidden(e.target.checked);
    }
    return (<div className="search">
        <div id="quick">
            <Options setType={props.setType} toggle={props.toggle} date={false} submit={props.submit}/> {
                userData
                    ? <FormControlLabel control={<Checkbox type = "checkbox" id = "hide" checked = {
                                props.hidden
                            }
                            onChange = {(e) =>
                                props.toggle("hidden", e.target.checked)

                            } />} label="Hide Donated"/>
                    : ''
            }
        </div>
        <div id="specific">
            <h3>
                <span className={props.type !== 0
                        ? "hidden"
                        : ''}>Search&nbsp;</span>
                {
                    props.type !== 0
                        ? "S"
                        : 's'
                }pecific month/hour:</h3>
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
                <Options type="specific" toggle={props.toggle} setType={props.setType} date={true} submit={props.submit}/>
            </div>
        </div>
    </div>);
}

export default Search;
