import React from "react";
import { makeStyles } from '@material-ui/core/styles';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from "@material-ui/core/InputLabel";
import states from "states-us/dist";

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function StateSelector ({region,setRegion}) {
    const classes = useStyles();

    const handleChange = event => {
        setRegion(event.target.value);
    };

    const listItems = states.map((s) => <MenuItem key={s.abbreviation} value={s.abbreviation}>{s.name}</MenuItem>)

        return (
        <FormControl className={classes.formControl}>
            <InputLabel id="region-select-label">Region</InputLabel>
            <Select
                labelId="region-select-label"
                id="region-select"
                value={region}
                onChange={handleChange}
            >
                <MenuItem key={"US"} value="US">Entire United States</MenuItem>
                {listItems}
            </Select>
        </FormControl>
    )
}
