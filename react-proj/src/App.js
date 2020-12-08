import * as d3 from 'd3';
import CovidMap from './map/covid_map';
import React, { useState } from 'react';

function App() {

    const [mapData, setMapData] = React.useState([]);// map data
    const [covidData, setCovidData] = React.useState([]);//covid data
    const [loading, setLoading] = React.useState(true);


   
    var width = 960*1.15 , height = 500*1.15;// 580*2,//500,
    

    //load covid data before rendering page
    React.useEffect(() => {
    //covid data from a specific data
    d3.json("http://localhost:5000/get_us_data_by_date/2020-12-01/").then((d) => {
      setCovidData(d);

    //map data
    d3.json("https://raw.githubusercontent.com/deldersveld/topojson/master/countries/united-states/us-albers-counties.json").then((d) => {
        setMapData(d);
        setLoading(false);
    });

    });

   
    return () => undefined;
  }, []);


 return (
     <div className="App">
	 <h1>COVID-19 Cases on 12/01/2020</h1>
	 <h2>Click to Toggle between Cases and Deaths, Hover to see specific county information</h2>
    <header className="App-header">
    {loading && <div>loading</div>}
    {!loading && <CovidMap mapData={mapData} covidData={covidData} width={width} height={height} />}
      </header>
     </div>
     );  

}	
export default App;   
