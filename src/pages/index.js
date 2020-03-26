import React from "react"
import { graphql } from "gatsby";

//import { Link } from "gatsby"
import { Link } from "gatsby-theme-material-ui";
import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Plotly from 'plotly.js-basic-dist'
import {timeParse} from "d3-time-format";

// customizable method: use your own `Plotly` object
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

export const query = graphql`
query {
  allTimeSeriesCsv {
    edges {
      node {
        date
        deaths
        positive
        tested
        time
        seconds_since_Epoch
      }
    }
  }
}
`;


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));


function SimpleTabs({ data }) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const epochFormat = timeParse("%s");

    var global_data = data.allTimeSeriesCsv.edges;
    var dates = global_data.map(function(node){ return epochFormat(node.node.seconds_since_Epoch)});
    var tested = global_data.map(function(node){ return node.node.tested});
    var ifr = global_data.map(function(node){ return node.node.deaths/node.node.positive});
    var tfr = global_data.map(function(node){ return node.node.deaths/node.node.tested});
    var ir = global_data.map(function(node){ return node.node.positive/node.node.tested});
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="Item One" {...a11yProps(0)} />
                    <Tab label="Item Two" {...a11yProps(1)} />
                    <Tab label="Item Three" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Plot
                    data={[
                        {
                            x: dates,
                            y: tested,
                            yaxis: 'y2',
                            mode: "scatter",
                            fill: "tozeroy",
                            name: "Tested"
                        },
                        {
                            x: dates,
                            y: ir,
                            mode: "lines+markers",
                            name: "% Positive"
                        },
                        {
                            x: dates,
                            y: tfr,
                            mode: "lines+markers",
                            name: "% fatal"
                        },

                    ]}
                    layout={{
                        title: 'COVID-19 Positives and Fatalities as a Percentage of People Tested',
                        hovermode: 'closest',
                        xaxis: {
                            tickformat: '%Y-%m-%d %H:%M',
                            "showspikes": true,
                            "spikemode": "across",
                            "spikedash": "solid",
                            "spikecolor": "#000000",
                            "spikethickness": 1
                        },
                        yaxis: {
                            title: '',
                            tickformat: '0.2%',
                            range: [0,1]
                        },
                        yaxis2: {
                            title: 'Total Tested',
                            overlaying: 'y',
                            side: 'right',
                        }
                    }}
                    width={"900px"}
                    height={"700px"}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
                Item Three
            </TabPanel>
        </div>
    );
}

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
      <SimpleTabs data={data} />
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
