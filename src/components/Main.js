import React, {useContext, useState} from 'react';
import UserContext from './UserContext';
import Header from './Header';
import Critters from './Critters';
import Button from '@material-ui/core/Button';
import cx from 'clsx';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

function Main() {
    const userData = useContext(UserContext);
    const [type, setType] = useState(0);
    const [lighting, setLight] = useState(true);
    const [hidden, setHidden] = useState(false);
    const [sphere, setSphere] = useState(true);
    const toggle = () => setLight(!lighting);
    const hemisphere = () => setSphere(!sphere);

    function handleChange(e) {
        setHidden(e.target.checked);
    }

    return (<div className={cx('main', lighting && 'dark', !lighting && 'light', !type && 'centered')}>
        <Header toggle={toggle} lighting={lighting} size={!type} sphereUp={hemisphere} sphere={sphere}/>
        <div className={type !== 0
                ? "little info"
                : 'info'}>
            {type !== 0 ? '' : <h1>Welcome to AC:NH Critter Collector.</h1>}
            <h2>Select one of the quick options for critter availability right now.</h2>
            <h3 className="reduce">Login to save what you have caught and donated.</h3>
            <div id="quick">
                <Button variant="contained" onClick={() => setType(2)}>
                    <span className="reduce">Available&nbsp;</span>Bugs</Button>
                <Button variant="contained" onClick={() => setType(3)}>
                    <span className="reduce">Available&nbsp;</span>Fish</Button>
                <Button variant="contained" onClick={() => setType(1)}>All<span className="reduce">&nbsp;Available</span>
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
        </div>
        {type !== 0 ? <Critters type={type} hidden={hidden} hemisphere={sphere}/> : ''}
    </div>);
}

export default Main;
