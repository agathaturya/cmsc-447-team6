import * as d3 from "d3";
import React, { useRef, useEffect } from "react";
import * as topojson from "topojson-client";
var d3_map = require('d3-collection');

function CovidMap({ mapData, covidData, width, height }) {

  var covidDataDict = d3_map.map();
  var domain = [0, 10, 100, 1000, 10000, 100000, 1000000]; //domain for choropleth colors
  var colorScale = d3.scaleThreshold().domain(domain).range(d3.schemeRdPu[7]);


  const ref = useRef();

  var projection = d3.geoAlbers().scale(1000);
  var path = d3.geoPath().projection(projection);

  useEffect(() => {
    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height);
  }, []);

  useEffect(() => {
    draw();
  }, [mapData]);

  const draw = () => {
    // console.log()
    console.log(covidData)
    for (var x = 0; x < covidData.length; x++) {
      var i = covidData[x];

      i["cases"] = Number(i["cases"]);
      i["deaths"] = Number(i["deaths"]);
      //mapping fips to [cases, deaths]
      var fips = covidData[x]["fips"];
      fips = i["fips"].toString();

      covidDataDict.set(fips, [i["cases"], i["deaths"]]);

    }

    console.log(covidDataDict);
    console.log(covidDataDict.size())
    console.log(covidData.length)
    const svg = d3.select(ref.current);
    svg
      .selectAll("path")
      .attr("id", "state_fips")
      .data(
        topojson
          .feature(mapData, mapData.objects.collection)
          .features.filter(function (d) {
            //want to display all states
            return true;
          })
      )
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", "white")
      .attr("fill", function (d) {

        //this function fills each county
        var fips = d["properties"]["fips"];

            try{

             d.cases = covidDataDict.get(fips)[0];
             d.deaths = covidDataDict.get(fips)[1];

         }
         //no entry for this county
         //todo: maybe specify that if this region is empty, we have no data
         catch(e){
            console.log(d)
            console.error(e)
            d.cases = 0;
            d.deaths = 0;
            
         }

        return colorScale(d.cases);
      })
      //.on("mouseover", mouseOver )
      // .on("mouseleave", mouseLeave )
      // .on("mousemove", mousemove)
      .attr("class", "county")
      .style("stroke", "transparent")
      .style("opacity", 0.9);
  };

  return (
    <div className="CovidMap">
      <svg ref={ref}></svg>
    </div>
  );
}

export default CovidMap;
