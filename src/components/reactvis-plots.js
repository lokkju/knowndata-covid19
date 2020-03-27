import React,  { useState, useEffect }  from "react"

import {timeParse,timeFormat} from "d3-time-format";
import { format } from "d3-format";
import {XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, Crosshair, makeVisFlexible} from 'react-vis';

import '../../node_modules/react-vis/dist/style.css';
import StateSelector from "./us-region-selector";

function InternalReactvisPlots ({region}) {
    const [crosshairValue, setCrosshairValue] = useState([]);
    const [data,setData] = useState([]);
    const [loaded,isLoaded] = useState(false);
    const [error,setError] = useState();
    const parseFormat = timeParse("%Y%m%d");
    const displayFormat = timeFormat("%Y-%m-%d");
    const FlexibleGraph = makeVisFlexible(XYPlot);

    useEffect( () => {
        let didCancel = false;
        let cturl = "https://covidtracking.com/api/us/daily";
        console.log(region);
        if(region !== "" && region !== "US") {
            cturl = "https://covidtracking.com/api/states/daily?state=" + region;
        }
        async function fetchMyAPI() {
            try {
                const response = await fetch(cturl);
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                const json = await response.json();
                console.log(json);
                if (!didCancel) { // Ignore if we started fetching something else
                    const d = [
                        json.map((n) => {return {"x": parseFormat(n.date), "y": n.total}}),
                        json.map((n) => {return {"x": parseFormat(n.date), "y": n.positive}}),
                        json.map((n) => {return {"x": parseFormat(n.date), "y": n.hospitalized}}),
                        json.map((n) => {return {"x": parseFormat(n.date), "y": n.death}}),
                        json.map((n) => {return {"x": parseFormat(n.date), "y": n.total/347000000}}),
                        json.map((n) => {return {"x": parseFormat(n.date), "y": n.positive/n.total}}),
                        json.map((n) => {return {"x": parseFormat(n.date), "y": n.hospitalized/n.total}}),
                        json.map((n) => {return {"x": parseFormat(n.date), "y": n.death/n.total}}),
                    ];
                    setData(d);
                    console.log(d);
                    isLoaded(true);
                }
            } catch (e) {
                setError(e)
                console.log(e);
            }
        }

        isLoaded(false);
        fetchMyAPI();
        return () => { didCancel = true; };
    }, [region]); // Only re-run the effect if count changes

    if (error) {
        return (<div><strong>Error:</strong><pre>{error}</pre></div>)
    } else if (loaded) {
        return (
            <div>
                <FlexibleGraph
                    onMouseLeave={() => setCrosshairValue([])}
                    height={300}
                    margin={{"bottom": 10, "top": 40}}
                    xType={"time"}
                >
                    <VerticalGridLines/>
                    <HorizontalGridLines/>
                    <XAxis
                        orientation={"top"}
                        tickFormat={tick => timeFormat("%m/%d")(tick)}
                    />
                    <YAxis
                        tickFormat={tick => format('.2s')(tick)}
                    />
                    <LineSeries
                        onNearestX={(value, {index}) => setCrosshairValue(data.map(d => d[index]))}
                        curve={'curveMonotoneX'}
                        data={data[0]}
                    />
                    <LineSeries
                        curve={'curveMonotoneX'}
                        data={data[1]}
                    />
                    <LineSeries
                        curve={'curveMonotoneX'}
                        data={data[2]}
                    />
                    <LineSeries
                        curve={'curveMonotoneX'}
                        data={data[3]}
                    />
                    <Crosshair values={crosshairValue}
                               titleFormat={(v) => {
                                   return {"title": "Date", "value": displayFormat(v[0].x)}
                               }}
                               itemsFormat={(v) => {
                                   return [
                                       {"title": "Total Tested", "value": v[0].y},
                                       {"title": "# Positive", "value": v[1].y},
                                       {"title": "# Hospitalized", "value": v[2].y},
                                       {"title": "# Deaths", "value": v[3].y},
                                   ]
                               }}
                    />
                </FlexibleGraph>
                <FlexibleGraph
                    onMouseLeave={() => setCrosshairValue([])}
                    height={150}
                    margin={{"bottom": 10, "top": 10}}
                    xType={"time"}
                    yDomain={[0,0.5]}
                >
                    <VerticalGridLines/>
                    <HorizontalGridLines/>
                    <YAxis
                        tickFormat={tick => format('.0%')(tick)}
                    />
                    <LineSeries
                        onNearestX={(value, {index}) => setCrosshairValue(data.map(d => d[index]))}
                        curve={'curveMonotoneX'}
                        data={data[5]}
                    />
                    <Crosshair values={crosshairValue}
                               titleFormat={(v) => {
                                   return {"title": "Date", "value": displayFormat(v[0].x)}
                               }}
                               itemsFormat={(v) => {
                                   return [
                                       {"title": "% Positive", "value": format('.2%')(v[5].y)},
                                   ]
                               }}
                    />
                </FlexibleGraph>
                <FlexibleGraph
                    onMouseLeave={() => setCrosshairValue([])}
                    height={150}
                    margin={{"top": 10}}
                    xType={"time"}
                    yDomain={[0,0.05]}
                >
                    <VerticalGridLines/>
                    <HorizontalGridLines/>
                    <XAxis
                        tickFormat={tick => timeFormat("%m/%d")(tick)}
                    />
                    <YAxis
                        tickFormat={tick => format('.1%')(tick)}
                    />
                    <LineSeries
                        onNearestX={(value, {index}) => setCrosshairValue(data.map(d => d[index]))}
                        curve={'curveMonotoneX'}
                        data={data[6]}
                    />
                    <LineSeries
                        curve={'curveMonotoneX'}
                        data={data[7]}
                    />
                    <Crosshair values={crosshairValue}
                               titleFormat={(v) => {
                                   return {"title": "Date", "value": displayFormat(v[0].x)}
                               }}
                               itemsFormat={(v) => {
                                   return [
                                       {"title": "% Hospitalized", "value": format('.2%')(v[6].y)},
                                       {"title": "% Deaths", "value": format('.2%')(v[7].y)},
                                   ]
                               }}
                    />
                </FlexibleGraph>

            </div>);
    } else {
        return (<div>Loading...</div>)
    }
}

function ReactvisPlots (initial_region) {
    const [region,setRegion] = useState("US")
    return (
        <div>
            <StateSelector region={region} setRegion={setRegion} />
            <InternalReactvisPlots region={region}/>
        </div>
    )
}
export default ReactvisPlots;