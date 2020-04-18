import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

function Options(props) {
    const options = ['Bugs', 'Fish', 'All'];

    return (<ButtonGroup size="medium" color="primary" variant="contained" aria-label="outlined primary button group">
        {
            options.map((option, index) => (
                <Button onClick={() => {
                    props.setType(index + 1);
                    props.toggleLoading(true);
                    props.date ? props.submit(true) : props.submit(false);
                }} key={option}>
                {
                    index === 2
                        ? ""
                        : (props.type ? '' : <span className="reduce">Available&nbsp;</span>)
                }
                {option}
                {
                    index === 2
                        ? (props.type ? '' : <span className="reduce">&nbsp;Available</span>)
                        : ''
                }
            </Button>))
        }
    </ButtonGroup>);
}

export default Options;
