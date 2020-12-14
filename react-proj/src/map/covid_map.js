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
function CovidMap({ mapData, covidData, width, height, prisonData }) {
  //console.log(mapData);
  console.log(prisonData);
  var covidDataDict = d3_collection.map(); //used to map fips --> [cases, deaths]
  var prisonDataDict = d3_collection.map();
  //canonical_facility_name: "Burruss Correctional Training Center"
  // county: "Monroe County"
  // date: "2020-03-31 00:00:00"
  // facility_type: "State Prisons"
  // fips: "13207"
  // pop_deaths: 0
  // pop_recovered: 0
  // pop_tested: 0
  // pop_tested_negative: 0
  // pop_tested_positive: "0"
  // source: ""http://www.gdc.ga.gov/content/cases"
  // staff_deaths: 0
  // staff_recovered: 0
  // staff_tested: 0
  // staff_tested_negative: 0
  // staff_tested_positive: "1"
  // state: "Georgia"
  // _id: "5fd4fdc038a64f76814e089e"

  var casesDomain = [1, 10, 100, 1000, 10000, 100000, 1000000]; //domain for cases choropleth colors
  casesColorScale = d3
    .scaleThreshold()
    .domain(casesDomain)
    .range(d3.schemeRdPu[8]); //colors used in map

  var deathsDomain = [20, 40, 60, 80, 100, 1000, 7000, 25000]; //domain for deaths choropleth colors
  deathsColorScale = d3
    .scaleThreshold()
    .domain(deathsDomain)
    .range(d3.schemeYlGnBu[9]);

  const ref = useRef();

  var projection = d3.geoAlbers().scale(width);
  var path = d3.geoPath().projection(projection);

  var showingCases = true;

  //tooltip callback
  var tooltip = d3Tip()
    .attr("class", "d3-tip")
    .html(function (event, d) {
      //this is shown on the tooltip
      var str = '<div style="text-align:center">';
      var date_string = "7/9/2020";
      var prison_info;
      if(prisonDataDict)
      prison_info = prisonDataDict.get(d.properties.state).get(date_string);
      console.log(prison_info);
      var prison_str = "";

      if (prison_info) {
        var prison_str = "</br>"+ "<b>" + d.properties.state + " Prisons </b><br/>";
        for (var x = 0; x < prison_info.length; x++) {
          var name = prison_info[x]["canonical_facility_name"].replace(
            /['"]+/g,
            ""
          );
          var cases = prison_info[x]["pop_tested_positive"];
          var deaths = prison_info[x]["pop_deaths"];
          if (!(cases == deaths && cases == 0)) {
            var curr_str =
              name + ": " + cases + " cases, " + deaths + " deaths  <br/>";
            prison_str += curr_str;
          }
        }
        console.log(prison_str);
      }
      try {
        str =
          "<b>" +
          d.properties.name +
          " " +
          d.properties.lsad +
          ", " +
          d.properties.state +
          ": </b> \n" +
          covidDataDict.get(d.properties.fips)[0].toLocaleString() +
          " cases, " +
          covidDataDict.get(d.properties.fips)[1].toLocaleString();
      } catch (error) {
        if (
          d.properties.state == "New York" &&
          (d.properties.name == "New York" ||
            d.properties.name == "Bronx" ||
            d.properties.name == "Queens" ||
            d.properties.name == "Kings" ||
            d.properties.name == "Richmond")
        ) {
          str =
            "New York" +
            " " +
            "City" +
            ", " +
            d.properties.state +
            ": \n" +
            covidDataDict.get("New York City")[0].toLocaleString() +
            " cases, " +
            covidDataDict.get("New York City")[1].toLocaleString() +
            " deaths";
        } else {
          str =
            d.properties.name +
            " " +
            d.properties.lsad +
            ", " +
            d.properties.state +
            " has no data. <br/>";
        }

        return str + prison_str;
      }
      if (d.deaths == 1) str += " death";
      else str += " deaths";

      return str + "</br>" + prison_str;
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

    //mapping fips to covid data for each county
    for (var x = 0; x < covidData.length; x++) {
      var i = covidData[x];

      i["cases"] = Number(i["cases"]);
      i["deaths"] = Number(i["deaths"]);
      //mapping fips to [cases, deaths]
      var fips = covidData[x]["fips"];
      fips = i["fips"].toString();

      //theres a mismatch between certain county names in the map and the NYT covid dataset
      //The NYT dataset puts the data for all NYC boroughs as 1 entry (New York City)
      //Shannon County, SD is listed as Oglala Lakota County in the NYT Dataset
      //Bedford City VA is independent from Bedford County VA and the NYT dataset doesn't reflect this
      //Wade Hampton Census Area, AK is listed as Kusilvak Census Area, AK in the NYT dataset
      if (i["county"] == "New York City") {
        covidDataDict.set("New York City", [i["cases"], i["deaths"]]);
      }

      //Bedford County/City
      else if (i["fips"] == "51019") {
        covidDataDict.set("51019", [i["cases"], i["deaths"]]); //fips of bedford county
        covidDataDict.set("51515", [i["cases"], i["deaths"]]); //fips of bedford city
      } else if (
        i["county"] == "Oglala Lakota" &&
        i["state"] == "South Dakota"
      ) {
        covidDataDict.set("46113", [i["cases"], i["deaths"]]); //fips of shannon county
      } else if (
        i["county"] == "Kusilvak Census Area" &&
        i["state"] == "Alaska"
      ) {
        covidDataDict.set("02270", [i["cases"], i["deaths"]]);
      } else {
        covidDataDict.set(fips, [i["cases"], i["deaths"]]);
      }
    }

    for (var x = 0; x < prisonData.length; x++) {
      var curr_entry = prisonData[x];
      //map by state
      //prisonDataDict format: state: {date: prison data entry}
      // console.log(prisonData[x])
      var state = prisonData[x]["state"];
      var date = new Date(prisonData[x]["date"]).toLocaleDateString();

      //entry for this state doesn't exist
      //this might be a bit pedantic
      if (prisonDataDict.has(state) == false) {
        // console.log(state, prisonDataDict.get(state))
        //inner dict maps date to cases
        var inner_dict = d3_collection.map();
        inner_dict.set(date, [curr_entry]);
        prisonDataDict.set(state, inner_dict);

        // console.log(state, prisonDataDict.get(state).get(date))
      } else {
        var state_dict = prisonDataDict.get(state);

        //there's an entry for this date
        if (state_dict.has(date) == true) {
          // updating the list for this date with prisonData[x]
          var entries_for_date = prisonDataDict.get(state).get(date);

          entries_for_date.push(curr_entry);

          //getting inner dictionary and updating list key for this date
          var inner_dict = prisonDataDict.get(state);
          inner_dict.set(date, entries_for_date);

          //finally, updating the dictionary for this state
          prisonDataDict.set(state, inner_dict);
        }

        //no entrys for this date
        else {
          var entries_for_date = [curr_entry];
          var inner_dict = prisonDataDict.get(state);
          inner_dict.set(date, entries_for_date);

          prisonDataDict.set(state, inner_dict);
        }
      }
      // if(prisonData[x]['county'] == "Unknown")
      //   console.log(prisonData[x])
    }

    console.log(prisonDataDict);
    console.log(prisonDataDict.size());
    svg = d3.select(ref.current);

    //zoom callback
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
        } catch (error) {
          //The map lists the boroughs of NYC seperatly, but the
          //NYT covid dataset lists it as 1 entry (NYC)
          if (
            d.properties.state == "New York" &&
            (d.properties.name == "New York" ||
              d.properties.name == "Bronx" ||
              d.properties.name == "Queens" ||
              d.properties.name == "Kings" ||
              d.properties.name == "Richmond")
          ) {
            d.cases = covidDataDict.get("New York City")[0];
            d.deaths = covidDataDict.get("New York City")[1];
          } else {
            //No data for this county
            // console.log(d)
            return "#666464";
          }
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

    //legend
    svg
      .append("g")
      .attr("class", "legendQuant")
      .attr("transform", "translate(900,20)");

    //legend callback
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
      .title("COVID-19 Cases")
      .scale(casesColorScale); //legend uses same colorscale as the map

    svg.select(".legendQuant").call(legend);

    svg.call(zoom);

    //callback for when map is clicked
    function clicked(d) {
      //toggle death counts
      if (showingCases) {
        d3.selectAll(".county")
          .attr("stroke", "transparent")
          .style("opacity", 0.9)
          .attr("fill", function (e) {
            try {
              e.cases = covidDataDict.get(e.properties.fips)[0];
              e.deaths = covidDataDict.get(e.properties.fips)[1];
            } catch (error) {
              try {
                if (
                  e.properties.state == "New York" &&
                  (e.properties.name == "New York" ||
                    e.properties.name == "Bronx" ||
                    e.properties.name == "Queens" ||
                    e.properties.name == "Kings" ||
                    e.properties.name == "Richmond")
                ) {
                  e.cases = covidDataDict.get("New York City")[0];
                  e.deaths = covidDataDict.get("New York City")[1];
                } else {
                  return "#666464";
                }
              } catch (error) {
                console.log(e);
              }
            }

            return deathsColorScale(e.deaths);
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
              // return `Less than ${values[1]}`
              return `Less than ${values[1]} deaths`;
            } else if (i === genLength - 1) {
              const values = generatedLabels[i].split(` ${labelDelimiter} `);
              return `${values[0]}+  deaths`;
            }
            return generatedLabels[i] + ` deaths`;
          })

          .title("COVID-19 Deaths")
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
              e.cases = covidDataDict.get(e.properties.fips)[0];
              e.deaths = covidDataDict.get(e.properties.fips)[1];
            } catch (error) {
              if (
                e.properties.state == "New York" &&
                (e.properties.name == "New York" ||
                  e.properties.name == "Bronx" ||
                  e.properties.name == "Queens" ||
                  e.properties.name == "Kings" ||
                  e.properties.name == "Richmond")
              ) {
                e.cases = covidDataDict.get("New York City")[0];
                e.deaths = covidDataDict.get("New York City")[1];
              } else {
                return "#666464";
              }
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
          .title("COVID-19 Cases")
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
