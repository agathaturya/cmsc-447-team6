import * as d3 from 'd3';
import CovidMap from './map/covid_map';
import React, { useState } from 'react';

function App() {

    //const [setData] = React.useState([]);
     const [mapData, setMapData] = React.useState([]);
     const [covidData, setCovidData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    //var all_data = new Array(2);
    //var covidData = new Map();
   
    var width = 960, height = 500;// 580*2,//500,
    //covid data
    React.useEffect(() => {
    //covid data
    d3.json("http://localhost:5000/get_us_data_by_date/2020-11-01/").then((d) => {
      setCovidData(d);

    d3.json("https://raw.githubusercontent.com/deldersveld/topojson/master/countries/united-states/us-albers-counties.json").then((d) => {
        setMapData(d);
   
        //all_data[0] = JSON.parse(JSON.stringify(d));
        setLoading(false);
    });

    });

   
    return () => undefined;
  }, []);


 return (
     <div className="App">
     <h2>COVID-19 cases</h2>
    <header className="App-header">
    {loading && <div>loading</div>}
    {!loading && <CovidMap mapData={mapData} covidData={covidData} width={width} height={height} />}
      </header>
     </div>
     );  

}	
export default App;   
