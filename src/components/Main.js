import React, {useContext, useState, useEffect} from 'react';
import {FirebaseContext} from './Firebase';
import UserContext from './UserContext';
import Header from './Header';
import Critters from './Critters';
import Button from '@material-ui/core/Button';
import cx from 'clsx';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

function Main(props) {
    const firebase = useContext(FirebaseContext);
    const userData = useContext(UserContext);
    const [type, setType] = useState(0);
    const [lighting, setLight] = useState(true);
    const [hidden, setHidden] = useState(false);
    const [sphere, setSphere] = useState(true);
    const [loading, setLoading] = useState();
    const toggleLoading = (direction) =>  {
        setLoading(direction);
    };
    const toggle = () => setLight(!lighting);
    const hemisphere = () => {
        if(userData?.authUser) {
            firebase.db.collection('users').doc(userData.authUser.uid).update({sphere: !sphere});
        }
        setSphere(!sphere)
    };

    useEffect(() => {
        if(userData?.authUser) {
            let unsubscribe = firebase.db.collection('users').doc(userData.authUser.uid).onSnapshot(snapshot => {
                if(!snapshot.data().sphere) {
                } else {
                    if(sphere !== snapshot.data().sphere) {
                        setSphere(snapshot.data().sphere);
                    }
                }
            }, err => { console.log(err) })
                return () => unsubscribe();
        } else {
            return;
        }
    }, [firebase, userData, sphere]);

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
            <h3 className={userData ? "reduce hidden" : "reduce"}>Login to save what you have caught and donated.</h3>
            <div id="quick">
                <Button variant="contained" onClick={() => {setType(2); toggleLoading(true);}}>
                    <span className="reduce">Available&nbsp;</span>Bugs</Button>
                <Button variant="contained" onClick={() => {setType(3); toggleLoading(true);}}>
                    <span className="reduce">Available&nbsp;</span>Fish</Button>
                <Button variant="contained" onClick={() => {setType(1); toggleLoading(true);}}>All<span className="reduce">&nbsp;Available</span>
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
        {type !== 0 ? <Critters type={type} hidden={hidden} hemisphere={sphere} toggleLoading={toggleLoading} loading={loading}/> : ''}
    </div>);
}

export default Main;
