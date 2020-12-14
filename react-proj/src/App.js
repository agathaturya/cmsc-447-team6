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
    const [queryD, updateQueryD] = useState('');
    const [mapData, setMapData] = React.useState([]);
    const [prisonData, setPrisonData] = React.useState([]);
    const [covidData, setCovidData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [loadingT, setLoadingT] = React.useState(true);
    const [covidDataU, setCovidDataU] = React.useState([]);

    console.log('data', covidData);
    console.log('length', covidData.length);
    console.log('query', query);
    console.log('queryD', queryD);
    var county = query;
    var datee = queryD;
    var trimmedDate;
    for(var i = 0; i < covidDataU.length; i++){
	var trimmedDate = covidDataU[i].date.substring(0, 10);
	if(covidDataU[i].county == query  && covidDataU[i].state == queryT && trimmedDate == queryD){
                document.getElementById("CO").innerHTML = "COUNTY: " + query;
                document.getElementById("ST").innerHTML = "STATE: " + covidDataU[i].state;
                document.getElementById("CS").innerHTML = "CASES: " + covidDataU[i].cases;
                document.getElementById("DT").innerHTML = "DEATHS: " + covidDataU[i].deaths;
                document.getElementById("DA").innerHTML = "DATE: " + trimmedDate;
        }
    }
    function handleOnSearch({ currentTarget }) {
	updateQuery(currentTarget.value);
    }
    function handleOnSearchT({ currentTarget }) {
        updateQueryT(currentTarget.value);
    }
    function handleOnSearchD({ currentTarget }) {
        updateQueryD(currentTarget.value);
    }

    var width = 960*1.15 , height = 500*1.15;// 580*2,//500,
    //covid data
    React.useEffect(() => {
    //covid data
    

    d3.json("http://localhost:5000/get_us_data_by_date/2020-12-04/").then((d) => {
      setCovidData(d);

    d3.json("https://raw.githubusercontent.com/deldersveld/topojson/master/countries/united-states/us-albers-counties.json").then((d) => {
        setMapData(d);

     d3.json("http://localhost:5000/get_prison_covid_data/").then((d) =>{
	setPrisonData(d)
	setLoading(false);
    
    d3.json("http://localhost:5000/get_us_data/").then((d) => {
      setCovidDataU(d);
      setLoadingT(false);
    });
    });

    });
    });

    return () => undefined;
  }, []);

 return (
   <>
     <div className="App">
         <h1>COVID-19 Cases on 12/04/2020</h1>
         <h2>Click to Toggle between Cases and Deaths, Hover to see specific county information. Zoom in/out with your trackpad/mouse wheel</h2>
    <header className="App-header">
    {loading && <div>loading</div>}
   {!loading && <CovidMap mapData={mapData} covidData={covidData} width={width} height={height} prisonData={prisonData}/>}
      </header>
     </div>
     <h1 style={{color: 'red'}}>COVID-19 DATABASE</h1>
     <h2>Enter County, State, and Date(YY-MM-DD) for specific county information</h2>
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

    <aside>
          <form className = "search">
                <label><strong>SEARCH(</strong><strong style={{color:'blue'}}>DATE (YYYY-MM-DD)</strong><strong>) </strong></label>
                <input type="text" value={queryD} onChange={handleOnSearchD}/><br></br><br></br>
          </form>
        </aside>

     {loadingT ? (
        "Loading...(1 minute or so)"
      ) : (
     <div>
	<strong  id="CO" style={{color: 'black'}}>COUNTY:</strong><br></br><br></br>
	<strong  id="ST" style={{color: 'orange'}}>STATE:</strong><br></br><br></br>
	<strong  id="CS" style={{color: 'green'}}>CASES:</strong><br></br><br></br>
        <strong  id="DT" style={{color: 'red'}}>DEATHS:</strong><br></br><br></br>
	<strong  id="DA" style={{color: 'blue'}}>DATE:</strong><br></br><br></br>
	
     </div>
     )}
     
   </>
);
}
export default App;
