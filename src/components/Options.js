import React, { useState, useEffect, useContext } from "react";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";

<<<<<<< Updated upstream
function Options(props) {
  const options = ["Bugs", "Fish", "Both"];

  return (
    <ButtonGroup
      size="medium"
      color="primary"
      variant="contained"
      aria-label="outlined primary button group"
    >
      {options.map((option, index) => (
        <Button
          onClick={() => {
            if (props.type !== index + 1) {
              props.setType(index + 1);
              props.toggleLoading(true);
              props.date ? props.submit(true) : props.submit(false);
            }
          }}
          key={option}
        >
          {index === 2 ? (
            ""
          ) : props.type ? (
            ""
          ) : (
            <span className="reduce">Available&nbsp;</span>
          )}
          {option}
          {index === 2 ? (
            props.type ? (
              ""
            ) : (
              <span className="reduce">&nbsp;Available</span>
            )
          ) : (
            ""
          )}
        </Button>
      ))}
    </ButtonGroup>
  );
=======
import Constants from "./Constants";

function OptionsSelect(props) {
  const constants = useContext(Constants);
  const [collection, setCollection] = useState({});
  const handleChange = (event) => {
    setCollection({
      ...collection,
      [event.target.name]: event.target.checked,
    });
  };
  useEffect(() => {
    let tempObj = {};
    constants.options.map((option, index) => {
      tempObj = { ...tempObj, [option]: index < 2 };
    });
    setCollection(tempObj);
  }, [constants]);
  if (Object.keys(collection).length > 0) {
    return (
      <FormControl component="fieldset">
        <FormLabel component="legend">Select Collection(s)</FormLabel>
        <FormGroup>
          {constants.options.map((option, index) => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox
                  checked={collection[option]}
                  onChange={handleChange}
                  name={option}
                  key={option}
                />
              }
              label={option}
            />
          ))}
        </FormGroup>
        <FormHelperText>Select any number of collections</FormHelperText>
      </FormControl>
    );
  } else {
    return <div>Loading...</div>;
  }
>>>>>>> Stashed changes
}

export default OptionsSelect;
