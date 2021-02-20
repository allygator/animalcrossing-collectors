import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
	formControl: {
		minWidth: 235,
		// maxWidth: 300,
	},
	chips: {
		display: "flex",
		flexWrap: "wrap",
	},
	chip: {
		margin: 2,
	},
}));

function Options(props) {
	const classes = useStyles();
	// const options = ["Bugs", "Fish", "Deep-sea", "Fossils", "Art", "Songs"];
	const options = ["Bugs", "Fish", "Deep-sea"];
	const [choice, setChoice] = useState(["Bugs", "Fish"]);

	const handleChange = (event) => {
		setChoice(event.target.value);
	};

	useEffect(() => {
		props.setChoices(choice);
	}, [choice]);

	return (
		<FormControl className={classes.formControl}>
			<InputLabel id="options-label">Select collections to track</InputLabel>
			<Select
				labelId="options-label"
				id="options-select"
				multiple
				value={choice}
				onChange={handleChange}
				input={<Input id="select-multiple-chip" />}
				renderValue={(selected) => (
					<div className={classes.chips}>
						{selected.map((value) => (
							<Chip key={value} label={value} className={classes.chip} />
						))}
					</div>
				)}
			>
				{options.map((option) => (
					<MenuItem key={option} value={option}>
						{option}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}

export default Options;
