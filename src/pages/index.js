import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { makeStyles } from '@material-ui/core/styles';
import ReactvisPlots from "../components/reactvis-plots";

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

const IndexPage = ({ data }) => {
    const classes = useStyles();
    return (
        <Layout>
            <SEO title="Home" />
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Paper className={classes.paper}>
                            <ReactvisPlots initial_region={"US"}/>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper className={classes.paper}>
                            <ReactvisPlots initial_region={"WA"}/>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </Layout>
    )
}

export default IndexPage
