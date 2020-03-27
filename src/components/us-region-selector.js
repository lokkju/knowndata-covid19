import React from "react";
import { makeStyles } from '@material-ui/core/styles';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import states from "states-us/dist";
import {fade} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    select: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        marginRight: theme.spacing(2),
        marginLeft: 0,
        minWidth: '250px',
        height: '40px'
    },
}));

export default function StateSelector ({region,setRegion,children}) {
    const classes = useStyles();

    const handleChange = event => {
        setRegion(event.target.value);
    };

    const listItems = states.map((s) => <MenuItem key={s.abbreviation} value={s.abbreviation}>{s.name}</MenuItem>)

        return (
            <Select
                className={classes.select}
                labelId="region-select-label"
                id="region-select"
                value={region}
                onChange={handleChange}
                variant='outlined'
            >
                <MenuItem key={"US"} value="US">Entire United States</MenuItem>
                {listItems}
            </Select>
    )
}
