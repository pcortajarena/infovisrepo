//Width and height of map
//var width = 960;
//var height = 500;
var width = 1440,
    height = 750,
    active = d3.select(null),
    centered;


// D3 Projection
var projection = d3.geo.mercator()
				   .translate([width/2, height/2 + 100])    // translate to center of screen
				   .scale([200]);          // scale things down so see entire US

// Define path generator
var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection

// Define linear scale for output
var color = d3.scale.linear()
			  .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","#FF7057"]);

// var legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];

//Create SVG element and append map to the SVG
var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

      svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);

      var g = svg.append("g")
      .style("stroke-width", "1.5px");

// Append Div for tooltip to SVG
var div = d3.select("body")
		    .append("div")
    		.attr("class", "tooltip")
    		.style("opacity", 0);

// Load in my states data!
d3.csv("stateslived.csv", function(data) {
color.domain([0,1,2,3]); // setting the range of the input data

// Load GeoJSON data and merge with states data
d3.json("world.json", function(json) {

    // Loop through each state data value in the .csv file
    for (var i = 0; i < data.length; i++) {

        // Grab State Name
        var dataState = data[i].state;

        // Grab data value
        var dataValue = data[i].visited;

        // Find the corresponding state inside the GeoJSON
        for (var j = 0; j < json.features.length; j++)  {
            var jsonState = json.features[j].properties.name;

            if (dataState == jsonState) {

            // Copy the data value into the JSON
            json.features[j].properties.visited = dataValue;

            // Stop looking through the JSON
            break;
            }
        }
    }

    // Bind the data to the SVG and create one path per GeoJSON feature
    g.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "states")
        .on("click", clicked)
        .style("fill", function(d) {


        return "#eccc68";

    });

    function reset(){
      active.classed("active", false);
      active = d3.select(null);

      g.transition()
          .duration(750)
          .style("stroke-width", "1.5px")
          .attr("transform", "");
    }

    function clicked(d) {

    	if (active.node() === this) return reset();
      active.classed("active", false);
      active = d3.select(this).classed("active", true);

    	var bounds = path.bounds(d)
    		//       x-max          x-min
    		dx = bounds[1][0] - bounds[0][0],
    		//       y-max          y-min
    		dy = bounds[1][1] - bounds[0][1],

    		// Center x and center y
    		x = (bounds[0][0] + bounds[1][0]) / 2,
    		y = (bounds[0][1] + bounds[1][1]) / 2,

    		scale = .9 / Math.max(dx / width, dy / height),
    		translate = [width / 2 - scale * x, height / 2 - scale * y];

       g.transition()
           .duration(750)
           .style("stroke-width", 1.5 / scale + "px")
    			 .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
    }

    d3.json("us-photos-total.json", function(data){

        // only get the list of photo objects
        data = data["results"];
        console.log("JSON ::::::",data);

        g.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "circles")
            .attr("cx", function(d) {
            try {
                return projection([d["longitude"], d["latitude"]])[0];
            }
            catch(error) {}
            })
            .attr("cy", function(d) {
            try {
                return projection([d["longitude"], d["latitude"]])[1];
            }
            catch(error) {}
            })
            .attr("r", function(d) {
                return 3;
            })
    });
    
    var select = d3.select('body')
      .append('select')
      	.attr('class','dropdown')
        .on('change', onchange)

    var options = select
      .selectAll('option')
    	.data(data).enter()
    	.append('option')
    		.text(function (d) { return d; });
    //
    // function onchange() {
    // 	selectValue = d3.select('select').property('value')
    // 	d3.select('body')
    // 		.append('p')
    // 	console.log(selectValue)

});


});
