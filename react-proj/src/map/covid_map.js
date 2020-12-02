import * as d3 from "d3";
import React, { useRef, useEffect } from "react";
import * as topojson from "topojson-client";
import './styles.css';
import * as d3Z from 'd3-zoom';
import d3Selection from 'd3-selection';
import d3Scale from 'd3-scale';
import d3Tip from "d3-tip";

var d3_collection = require('d3-collection');

var svg;
var g;

//mapData has boundaries and county info
//covidData has covid data for each fips
//width and height used for size of svg
function CovidMap({ mapData, covidData, width, height }) {
console.log(mapData)
  var covidDataDict = d3_collection.map();//used to map fips --> [cases, deaths]
  var domain = [0, 10, 100, 1000, 10000, 100000, 1000000]; //domain for choropleth colors
  var colorScale = d3.scaleThreshold().domain(domain).range(d3.schemeRdPu[7]);//colors used in map

  const ref = useRef();

  var projection = d3.geoAlbers().scale(width);
  var path = d3.geoPath().projection(projection);


  var tooltip = d3Tip().attr('class', 'd3-tip')
// .rootElement(function(){
//         return document.getElementById('root');
//       })
  .html(function(event, d) {
    // console.log(d.properties.name)
    //   console.log(d.properties.lsad)
    // console.log(d.properties.state)

    var str = d.properties.name + " " + d.properties.lsad + ", " + d.properties.state + ": \n" 
            + d.cases.toLocaleString() + " cases, " + d.deaths.toLocaleString();

    if(d.deaths == 1)
      str += " death"
    else
        str+= " deaths"
   
  //  console.log(str)
    //d.cases
    //d.deaths
  //  console.log(d)
    return str;

  })

  useEffect(() => {
    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height);
  }, []);

  useEffect(() => {
    draw();
  }, [mapData]);

//this callback draws the map
  const draw = () => {
    //console.log(covidData)
    for (var x = 0; x < covidData.length; x++) {
      var i = covidData[x];

      i["cases"] = Number(i["cases"]);
      i["deaths"] = Number(i["deaths"]);
      //mapping fips to [cases, deaths]
      var fips = covidData[x]["fips"];
      fips = i["fips"].toString();

      covidDataDict.set(fips, [i["cases"], i["deaths"]]);

    }


    svg = d3.select(ref.current);
   // g = svg.append("g");


    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .extent([[0, 0], [width, height]])
      .on('zoom', function(event) {
          svg.selectAll('path')
           .attr('transform', event.transform);


});
    
//    .data(topojson.feature(us, us.objects.collection).features)


    //filling in each county
    svg
      .selectAll("path")
      .attr("id", "state_fips")
      .data(topojson.feature(mapData, mapData.objects.collection).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", "white")
      .attr("fill", function (d) {
        var fips = d["properties"]["fips"];

            try{

             d.cases = covidDataDict.get(fips)[0];
             d.deaths = covidDataDict.get(fips)[1];

         }
         //no covid data for this county
         //TODO: specify somewhere that this region has no covid data
         catch(e){
            d.cases = 0;
            d.deaths = 0;
            
         }
        return colorScale(d.cases);
      })

      .attr("class", "county")
      .style("stroke", "transparent")
      .style("opacity", 0.9)
        .on("mouseleave", tooltip.hide)
        .on("mouseover", tooltip.show)
      .on("click", clicked)
    .call(tooltip)
      

      svg.call(zoom);
      
      // svg.append("path")
      // .datum(topojson.mesh(mapData, mapData.objects.collection).features( (a, b) => a !== b))
      // .attr("fill", "none")
      // .attr("stroke", "white")
      // .attr("stroke-linejoin", "round")
      // .attr("d", path);

      function clicked(d){
            
  
      }



  };




  return (
    <div className="CovidMap">
      <svg ref={ref}></svg>

    </div>

  );
}

export default CovidMap;
