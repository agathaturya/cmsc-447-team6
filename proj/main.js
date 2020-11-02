var width = 960,//700*2,//960,
	height = 500,// 580*2,//500,
	centered;
    var legendWidth = 40;
    var legendHeight = 100;
    var projection = d3.geoAlbers()
	.scale( 1000 );
//	.rotate( [76.6413,0] )
//	.center( [0, 39.0458] )
//	.translate( [width/2,height/2] );
    var path = d3.geoPath()
	.projection(projection);
    var minCases, maxCases, minDeaths, maxDeaths;
    var covidData = d3.map();
    var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);
    var group = svg.append('g')
    var files = ["http://localhost:5000/get_us_data_by_date/2020-06-20/", "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/united-states/us-albers-counties.json"];
    var promises = [
	d3.json(files[1]),
	d3.json(files[0], function(d) {
        
	})
    ];
    var colorScale;
    var sumCases = 0;
    var sumDeaths = 0;
    var avgCases, avgDeaths;
    //execute requests
    Promise.all(promises).then(ready);
    
    //requests for data done, fufilled or not
    function ready(data,  error) {
	
	console.log(data);
	minDeaths = Number(data[1][0]['deaths'])
	maxDeaths = Number(data[1][0]['deaths'])
	minCases = Number(data[1][0]['cases'])
	maxCases = Number(data[1][0]['cases'])
	console.log(minCases, maxCases, minDeaths, maxDeaths)

	
	
	
	var count = 0;
	//mapping county name to # of cases
	//also, getting min, max, and avg
	for(x=0; x<data[1].length; x++){
	    //sum+=val;
	    i = data[1][x]
	    //console.log(i, i['cases'], i['deaths'])
	    i['cases'] = Number(i['cases']);
	    i['deaths'] = Number(i['deaths']);
	    sumCases += i['cases']
	    sumDeaths += i['deaths']
	    count++;
	    
	    covidData.set(i['fips'], [i['cases'], i['deaths']]);
	    if(i['cases'] < minCases)
		minCases = i['cases']
	    if(i['cases'] > maxCases){
		maxCases = i['cases']
		console.log(i)
	    }
	    if(i['deaths'] < minDeaths)
                minDeaths = i['deaths']
            if(i['deaths'] > maxDeaths)
                maxDeaths = i['deaths']
	    
	    
	}
	


	avgCases = Math.round(sumCases/count);
	avgDeaths = Math.round(sumDeaths/count);
	console.log(sumCases, sumDeaths, avgCases, avgDeaths)
	
	
	//color scale
	//color #1 is min. cases
	//color #2 is min. cases + avg cases
	//color #3 is avg. cases
	//color #4 is max. cases + avg cases
	//color #5 is max. cases
	var domain = [minCases, minCases+avgCases, Math.round((minCases+avgCases)/2), avgCases, Math.round((maxCases+avgCases)/2), maxCases];
	var otherDomain = [0,10,100,1000,10000,100000,1000000]
	domain = domain.sort(function(a, b){return a-b})
	console.log(domain)


	colorScale = d3.scaleThreshold()
	    .domain(otherDomain)
	    .range(d3.schemeRdPu[7]);


	
	//mouse over function
	//other counties will be more opaque
	//and this county will be less opaque
	let mouseOver = function(d) {
            d3.selectAll(".county")
                .transition()
                  .duration(200)
                .style("opacity", .5)
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1)
                .style("stroke", "black")

	    
            tooltipLabel.text(d.properties.name + " " + d.properties.lsad + ": " + d.cases +  " cases"); 
            tooltip.style('display', 'block');
	    
	    	 
	    console.log(tooltip);
	    console.log(d.properties.name, d.properties.lsad, d.cases, "cases");
        };					
        
		
        let mouseLeave = function(d) {
            d3.selectAll(".county")
                .transition()
                .duration(200)
                .style("opacity", .8)
            d3.select(this)
                .transition()
                .duration(200)
                .style("stroke", "transparent")

	    tooltip.style('display', 'block');   
	    
	};
	
	var svgContainer = d3.select('#my_dataviz');
	var other_svg = svgContainer.append('svg')
	//tooltips
	//var tooltip = svgContainer
         //   .append('div')
           // .attr('class', 'tooltip');
	var tooltip = d3.select("body")
	    .append("div")
	    .attr("class", "tooltip");
    var tooltipLabel =   tooltip.append('div')
             .attr('class', 'label');

	var mousemove = function(d) {
	    //.html("The exact value of<br>this cell is: " + d.value)
	    
	  }
	svg.selectAll("path")
	    .attr("id", "state_fips")
	    .data(topojson.feature(data[0], data[0].objects.collection).features.filter(
		function(d) {
		    return d.properties.state_fips == d.properties.state_fips ; }))
	    .enter()
	    .append("path")
	    .attr("d", path)
	    .attr("stroke","white")
	    .attr("fill",
		  function(d) {
		      
		      if (covidData.get(d['properties']['fips'])){
			  d.cases = covidData.get(d['properties']['fips'])[0]
			  d.deaths = covidData.get(d['properties']['fips'])[1]
		      }
		      else{
			  d.cases = 0
			  d.deaths = 0
		      }			 
		      		      
		      return colorScale(d.cases);
		      
		
		  })
	    .on("mouseover", mouseOver )
	    .on("mouseleave", mouseLeave )
	    .on("mousemove", mousemove)
	    .attr("class", "county")
	    .style("stroke", "transparent")
	    .style("opacity", .9);
	
	
	

	//legend
	svg.append("g")
	    .attr("class", "legendQuant")
	    .attr("transform", "translate(20,20)");
	
	var legend = d3.legendColor()
	    .labelFormat(d3.format(".0f"))
	    .labels(d3.legendHelpers.thresholdLabels)
	    .scale(colorScale);

	svg.select(".legendQuant")
	    .call(legend);  
		
    }
