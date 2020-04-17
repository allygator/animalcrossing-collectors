import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

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

function Date(props) {
    const handleTimeChange = (event) => {
        const name = event.target.name;
        props.setPicker({
            ...props.picker,
            [name]: event.target.value
        });
    };
    return (<div id="specific">
        <div id="specific-options">
            <div id="dropdowns">
                <FormControl className="specific-form">
                    <InputLabel id="month">Month</InputLabel>
                    <Select labelId="month" id="demo-simple-select" value={props.picker.month} name="month" onChange={handleTimeChange}>
                        {
                            months.map((month, index) => {
                                return <MenuItem value={index} key={month}>{month}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
                <FormControl className="specific-form">
                    <InputLabel id="hour">Hour</InputLabel>
                    <Select labelId="hour" id="demo-simple-select" value={props.picker.hour} onChange={handleTimeChange} name="hour">
                        {
                            hours.map((hour) => {
                                return <MenuItem value={hour} key={hour}>{hour}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
                <FormControl className="specific-form">
                    <InputLabel id="meridiam">Meridiam</InputLabel>
                    <Select labelId="meridiam" id="demo-simple-select" value={props.picker.meridiam} onChange={handleTimeChange} name="meridiam">
                        {
                            meridiamOptions.map((thing, index) => {
                                return <MenuItem value={index} key={thing}>{thing}</MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
            </div>
        </div>
    </div>);
}

export default Date;
