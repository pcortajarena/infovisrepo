var width = 1440,
    height = 750,
    active = d3.select(null);

var circR = 3;

var projection = d3.geoMercator()
				   .translate([width/2, height/2 + 100])    // translate to center of screen
				   .scale(230);          // scale things down so see entire US

// Define path generator
var path = d3.geoPath(projection);  // tell path generator to use albersUsa projection

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


var tip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Load GeoJSON data
d3.json("world.json").then(function(json) {

    // Bind the data to the SVG and create one path per GeoJSON feature
    g.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "worldmap")
        .on("click", areaClicked)
        .on('mouseover', areaMouseover)
        .on('mousemove', areaMousemove)
        .on('mouseleave', areaMouseleave)

    function reset(){
      active.classed("active", false);
      active = d3.select(null);

      g.transition()
          .duration(750)
          .style("stroke-width", "1.5px")
          .attr("transform", "");
    }

    function areaMouseover(d) {
        area = d3.select(this);
        area.classed("worldmap-active", true);
    }

    function areaMousemove(d) {
        tip.html("<span><strong>Location:</strong></span> <span style='color:white'>" + d.properties.name + "</span>")
        .style("opacity", 0.9)
        .style("left", (d3.event.pageX + 50) + "px")
        .style("top", d3.event.pageY + "px");
    }

    function areaMouseleave(d) {
        area = d3.select(this);
        area.classed("worldmap-active", false);
        tip.style("opacity", 0);
    }

    function circleClicked(d){
        console.log(d)
    }

});

