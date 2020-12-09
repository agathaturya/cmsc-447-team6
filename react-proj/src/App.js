import * as d3 from 'd3';
import CovidMap from './map/covid_map';
import React, { useState } from 'react';

function App() {
      const options = {
             keys: [
                'county',
                'state'
             ],
             includeScore: true
     };
    const [query, updateQuery] = useState('');
    const [queryT, updateQueryT] = useState('');
    const [mapData, setMapData] = React.useState([]);
    const [covidData, setCovidData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    console.log('data', covidData);
    console.log('length', covidData.length);
    console.log('query', query);
    var county = query;
    for(var i = 0; i < covidData.length; i++){
	if(covidData[i].county == query  && covidData[i].state == queryT){
                //found it
                document.getElementById("CO").innerHTML = "COUNTY: " + query;
                document.getElementById("ST").innerHTML = "STATE: " + covidData[i].state;
                document.getElementById("CS").innerHTML = "CASES: " + covidData[i].cases;
                document.getElementById("DT").innerHTML = "DEATHS: " + covidData[i].deaths;
                document.getElementById("DA").innerHTML = "DATE: " + covidData[i].date;
        }



    }
   
    function handleOnSearch({ currentTarget }) {
	updateQuery(currentTarget.value);
    }
    function handleOnSearchT({ currentTarget }) {
        updateQueryT(currentTarget.value);
    }
    var width = 960*1.15 , height = 500*1.15;// 580*2,//500,
    //covid data
    React.useEffect(() => {
    //covid data
    d3.json("http://localhost:5000/get_us_data_by_date/2020-12-01/").then((d) => {
      setCovidData(d);

    d3.json("https://raw.githubusercontent.com/deldersveld/topojson/master/countries/united-states/us-albers-counties.json").then((d) => {
        setMapData(d);
        setLoading(false);
    });


    });

    return () => undefined;
  }, []);

 return (
    <>
     <div className="App">
         <h1>COVID-19 Cases on 12/01/2020</h1>
         <h2>Click to Toggle between Cases and Deaths, Hover to see specific county information</h2>
    <header className="App-header">
    {loading && <div>loading</div>}
    {!loading && <CovidMap mapData={mapData} covidData={covidData} width={width} height={height} />}
      </header>
     </div>
     <h1 style={{color: 'red'}}>COVID-19 DATABASE</h1>
     <aside>
          <form className = "search">
                <label><strong>SEARCH(</strong><strong style={{color:'black'}}>COUNTY</strong><strong>) </strong></label>
                <input type="text" value={query} onChange={handleOnSearch}/><br></br><br></br>
          </form>
        </aside>
     <aside>
          <form className = "search">
		<label><strong>SEARCH(</strong><strong style={{color:'orange'}}>STATE</strong><strong>) </strong></label>
                <input type="text" value={queryT} onChange={handleOnSearchT}/><br></br><br></br>
          </form>
        </aside>

     <div>
	<strong  id="CO" style={{color: 'black'}}>COUNTY:</strong><br></br><br></br>
	<strong  id="ST" style={{color: 'orange'}}>STATE:</strong><br></br><br></br>
	<strong  id="CS" style={{color: 'green'}}>CASES:</strong><br></br><br></br>
        <strong  id="DT" style={{color: 'red'}}>DEATHS:</strong><br></br><br></br>
	<strong  id="DA" style={{color: 'blue'}}>DATE:</strong><br></br><br></br>
        </div>
     
   </>
);
}
export default App;
