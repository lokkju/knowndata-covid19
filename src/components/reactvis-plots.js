import React,  { useState, useEffect }  from "react"

import {timeParse,timeFormat} from "d3-time-format";
import { format } from "d3-format";
import {XYPlot, LineSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis, Crosshair, ChartLabel} from 'react-vis';

import '../../node_modules/react-vis/dist/style.css';

function ReactvisPlots ({cturl}) {
    const [crosshairValue, setCrosshairValue] = useState([]);
    const [data,setData] = useState([]);
    const [loaded,isLoaded] = useState(false);
    const [error,setError] = useState();
    const parseFormat = timeParse("%Y%m%d");
    const displayFormat = timeFormat("%Y-%m-%d");


    useEffect( () => {
        let didCancel = false;

        async function fetchMyAPI() {
            try {
                const response = await fetch(cturl);
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                const json = await response.json();
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
            } catch (error) {
                console.log(error);
            }
        }

        isLoaded(false);
        fetchMyAPI();
        return () => { didCancel = true; };
    }, [cturl]); // Only re-run the effect if count changes

    if (loaded) {
        return (
            <div>
                <XYPlot
                    onMouseLeave={() => setCrosshairValue([])}
                    width={450}
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
                </XYPlot>
                <XYPlot
                    onMouseLeave={() => setCrosshairValue([])}
                    width={450}
                    height={150}
                    margin={{"bottom": 10, "top": 10}}
                    xType={"time"}
                    yDomain={[0,0.2]}
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
                </XYPlot>
                <XYPlot
                    onMouseLeave={() => setCrosshairValue([])}
                    width={450}
                    height={150}
                    margin={{"top": 10}}
                    xType={"time"}
                    yDomain={[0,0.03]}
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
                </XYPlot>

            </div>);
    } else {
        return (<div>Loading...</div>)
    }
}

export default ReactvisPlots;