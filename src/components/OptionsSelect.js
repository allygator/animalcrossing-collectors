import React, { useState, useEffect, useContext } from "react";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
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
    console.log(collection);
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
}

export default OptionsSelect;
