import * as d3 from "d3";
import React, { useRef, useEffect, useState } from "react";
import * as topojson from "topojson-client";
import "./styles.css";
import * as d3Z from "d3-zoom";
import d3Selection from "d3-selection";
import d3Scale from "d3-scale";
import d3Tip from "d3-tip";


var d3_collection = require("d3-collection");
var d3_legend = require("d3-svg-legend");
var svg;
var g;
var casesColorScale;
var deathsColorScale;


var legend;

//mapData has boundaries and county info
//covidData has covid data for each fips
//width and height used for size of svg
function CovidMap({ mapData, covidData, width, height }) {
  console.log(mapData);
  var covidDataDict = d3_collection.map(); //used to map fips --> [cases, deaths]

  var casesDomain = [1, 10, 100, 1000, 10000, 100000, 1000000]; //domain for cases choropleth colors
  casesColorScale = d3
    .scaleThreshold()
    .domain(casesDomain)
    .range(d3.schemeRdPu[7]); //colors used in map

  var deathsDomain = [1,20, 40, 60, 80, 100,1000,7000]; //domain for deaths choropleth colors
  deathsColorScale = d3
    .scaleThreshold()
    .domain(deathsDomain)
    .range(d3.schemeYlGnBu[9]);

  const ref = useRef();

  var projection = d3.geoAlbers().scale(width);
  var path = d3.geoPath().projection(projection);

  var showingCases = true;

  var tooltip = d3Tip()
    .attr("class", "d3-tip")

    .html(function (event, d) {
      //this is shown on the tooltip
      var str = "";

      try {
        str =
          d.properties.name +
          " " +
          d.properties.lsad +
          ", " +
          d.properties.state +
          ": \n" +
          covidDataDict.get(d.properties.fips)[0].toLocaleString() +
          " cases, " +
          covidDataDict.get(d.properties.fips)[1].toLocaleString();
      } catch (e) {
        str =
          d.properties.name +
          " " +
          d.properties.lsad +
          ", " +
          d.properties.state +
          " \n" +
          " has no data.";
        return str;
      }
      if (d.deaths == 1) str += " death";
      else str += " deaths";

      return str;
    });

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

    //maping fips to covid data for each county
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

    const zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", function (event) {
        svg.selectAll("path").attr("transform", event.transform);
      });

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

        try {
          d.cases = covidDataDict.get(fips)[0];
          d.deaths = covidDataDict.get(fips)[1];
        } catch (e) {
         
          d.cases = 0;
          d.deaths = 0;
          return "#666464"
        }

        return casesColorScale(d.cases);
      })

      .attr("class", "county")
      .style("stroke", "transparent")
      .style("opacity", 0.9)
      .on("mouseleave", tooltip.hide)
      .on("mouseover", tooltip.show)
      .on("click", clicked)
      .call(tooltip);

    svg
      .append("g")
      .attr("class", "legendQuant")
      .attr("transform", "translate(900,20)");

   
    legend = d3_legend
      .legendColor()
      .labelFormat(d3.format(",.0f"))
      //.labels(d3_legend.legendHelpers.thresholdLabels)
      .labels(function ({ i, genLength, generatedLabels, labelDelimiter }) {
        if (i === 0) {
          const values = generatedLabels[i].split(` ${labelDelimiter} `);
          return `0  cases`;
        } else if (i === genLength - 1) {
          const values = generatedLabels[i].split(` ${labelDelimiter} `);
          return `${values[0]}+  cases`;
        }
        return generatedLabels[i] + ` cases`;
      })
      .title("Covid-19 Cases")
      .scale(casesColorScale); //legend uses same colorscale as the map

    svg.select(".legendQuant").call(legend);

    svg.call(zoom);

    function clicked(d) {

      //toggle death counts
      if (showingCases) {
        d3.selectAll(".county")
          .attr("stroke", "transparent")
          .style("opacity", 0.9)
          .attr("fill", function (e) {
            try {
              console.log(e);
              e.cases = covidDataDict.get(e.properties.fips)[0];
              e.deaths = covidDataDict.get(e.properties.fips)[1];
            } catch (e) {

              e.cases = 0;
              e.deaths = 0;
              return "#666464"
            }

            return deathsColorScale(e.deaths);
          })
          .style("stroke", "transparent")
          .style("opacity", 0.9);


        //updating legend
        legend = d3_legend
          .legendColor()
          .labelFormat(d3.format(",.0f"))
          //.labels(d3_legend.legendHelpers.thresholdLabels + " deaths")
          .labels(function ({ i, genLength, generatedLabels, labelDelimiter }) {
            if (i === 0) {
              const values = generatedLabels[i].split(` ${labelDelimiter} `);
              return `0  deaths`;
            } else if (i === genLength - 1) {
              const values = generatedLabels[i].split(` ${labelDelimiter} `);
              return `${values[0]}+  deaths`;
            }
            return generatedLabels[i] + ` deaths`;
          })

          .title("Covid-19 Deaths")
          .scale(deathsColorScale); //legend uses same colorscale as the map

        svg.select(".legendQuant").call(legend);
        showingCases = false;
      } 

      //toggling case counts
      else {
        d3.selectAll(".county")
          .attr("stroke", "transparent")
          .style("opacity", 0.9)
          .attr("fill", function (e) {
            try {
              console.log(e);
              e.cases = covidDataDict.get(e.properties.fips)[0];
              e.deaths = covidDataDict.get(e.properties.fips)[1];
            } catch (e) {
              e.cases = 0;
              e.deaths = 0;
              return "#666464"
            }

            return casesColorScale(e.cases);
          })
          .style("stroke", "transparent")
          .style("opacity", 0.9);
      

        //updating legend
        legend = d3_legend
          .legendColor()
          .labelFormat(d3.format(",.0f"))
          .labels(function ({ i, genLength, generatedLabels, labelDelimiter }) {
            if (i === 0) {
              const values = generatedLabels[i].split(` ${labelDelimiter} `);
              return `0  cases`;
            } else if (i === genLength - 1) {
              const values = generatedLabels[i].split(` ${labelDelimiter} `);
              return `${values[0]}+  cases`;
            }
            return generatedLabels[i] + ` cases`;
          })
          .title("Covid-19 Cases")
          .scale(casesColorScale); //legend uses same colorscale as the map

        svg.select(".legendQuant").call(legend);

        showingCases = true;
      }
    }
  };

  return (
    <div className="CovidMap">
      <svg ref={ref}></svg>
    </div>
  );
}

export default CovidMap;
