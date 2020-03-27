import React, {useState} from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { makeStyles } from '@material-ui/core/styles';
import ReactvisPlots from "../components/reactvis-plots";

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AppBar from "@material-ui/core/AppBar";
import StateSelector from "../components/us-region-selector";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    menuDropdown: {
        marginLeft: '20px'
    }
}));

const IndexPage = ({ data }) => {
    const classes = useStyles();

    const [regionOne,setRegionOne] = useState("US")
    const [regionTwo,setRegionTwo] = useState("US")
    return (
        <Layout>
            <SEO title="Home" />
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography className={classes.title} variant="h6" noWrap>
                                Compare Regions
                            </Typography>
                            <div className={classes.menuDropdown}>
                                Region One: <StateSelector region={regionOne} setRegion={setRegionOne}>Region One</StateSelector>
                            </div>
                            <div className={classes.menuDropdown}>
                                Region Two: <StateSelector region={regionTwo} setRegion={setRegionTwo}>Region Two</StateSelector>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <Grid item xs={12} sm={6}>
                        <Paper className={classes.paper}>
                            <ReactvisPlots region={"US"}/>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper className={classes.paper}>
                            <ReactvisPlots region={"WA"}/>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </Layout>
    )
}

export default IndexPage
