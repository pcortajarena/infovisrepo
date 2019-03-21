var width = 1440,
    height = 750,
    active = d3.select(null);

var circR = 1;

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


var country_tip = d3.select("body")
    .append("div")
    .attr("class", "country-tooltip")
    .style("opacity", 0);

var circle_tip = d3.select("body")
    .append("div")
    .attr("class", "circle-tooltip")
    .style("opacity", 0);

d3.select('#remove-networks').on("click", function(){
    d3.selectAll('line').remove();
});

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
        country_tip.html("<span><strong>Location:</strong></span> <span style='color:white'>" + d.properties.name + "</span>")
        .style("opacity", 0.9)
        .style("left", (d3.event.pageX + 50) + "px")
        .style("top", d3.event.pageY + "px");
    }

    function areaMouseleave(d) {
        area = d3.select(this);
        area.classed("worldmap-active", false);
        country_tip.style("opacity", 0);
    }

    function areaClicked(d) {

    	if (active.node() === this) return reset();
      active.classed("active", false);
      active = d3.select(this).classed("active", true);

      var x_translation = 0
	  var scale_translation = 0.5
	  var y_translation = 0

	  if (d.properties.name == 'Canada'){
		x_translation = 150
		scale_translation = 1.0
	  } else if (d.properties.name == 'Russia'){
		x_translation = 300
		scale_translation = 1.8
	  } else if (d.properties.name == 'Alaska'){
		x_translation = -600
		scale_translation = 3.5
	  } else if (d.properties.name == 'France'){
		 x_translation = 100
		 scale_translation = 3.5
		 y_translation = -92
	  }

  	var bounds = path.bounds(d),
  		//       x-max          x-min
  		dx = bounds[1][0] - bounds[0][0],
  		//       y-max          y-min
  		dy = bounds[1][1] - bounds[0][1],

  		// Center x and center y
  		x = (bounds[0][0] + bounds[1][0]) / 2 + x_translation,
  		y = (bounds[0][1] + bounds[1][1]) / 2 + y_translation,

  		scale = scale_translation / Math.max(dx / width, dy / height),
          translate = [width / 2 - scale * x, height / 2 - scale * y];

     g.transition()
         .duration(750)
         .style("stroke-width", 1.0 / scale + "px")
  			 .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
    }

    d3.json("shortNUS.json").then(function(data){

        // only get the list of photo objects
        data = data["photos"]
        // console.log("JSON ::::::",data);

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
            .attr("r", circR)
            .on("click", circleClicked)
            .on("mouseover", circleMouseover)
            .on("mouseleave", circleMouseleave)

        function circleClicked(d){

            d3.select(this).style('fill', 'blue');
            reset();

            d3.json('/infovisrepo/data/edges_copy.json').then(function(data2){
                for (var k in data2[d.id]){
                    myline = g.append("line")
                        .attr('class', 'network')
                        .attr("id", d.id)
                        .style("stroke", "blue")
                        .style("stroke-opacity", .5)
                        .attr("x1", projection([d["longitude"], d["latitude"]])[0])
                        .attr("y1", projection([d["longitude"], d["latitude"]])[1])
                        .attr("x2", projection([data2[d.id][k][1], data2[d.id][k][0]])[0])
                        .attr("y2", projection([data2[d.id][k][1], data2[d.id][k][0]])[1])
                }
            });

        }

        function circleMouseover(d){
            var sel = d3.select(this);
            // sel.raise().each(pulse);

            img = d.url;
            username = d.username;
            title = d.title;
            labels = d.labels;
            views = d.views;
            date = d.date;
            page = d.photopage_url;


            circle_tip.html(
                "<div class='circle-tooltip-container'>" +
                    "<div class='circle-tooltip-right'>" +
                        "<p class='circle-tooltip-title'><strong>" + title + "</strong></p>" +
                        "<p class='circle-tooltip-text'>Username: " + username + "</p>" +
                        "<p class='circle-tooltip-text'> Labels: " + labels + "</p>" +
                        "<p class='circle-tooltip-text'> Timestamp: " + date + "</p>" +
                        "<p class='circle-tooltip-text'>" + views + " views </p>" +
                        // "<span><strong>Photo page:</strong></span> <span style='color:black'><a href="+ page +"> Visit flickr </a></span><br/>" +
                    "</div>" +
                    "<div class='circle-tooltip-left'><img class='circle-tooltip-img' src=" + img + "></div>" +
                "</div>"
                )
            .style("opacity", 1.0)
            .style("left", (d3.event.pageX + 50) + "px")
            .style("top", d3.event.pageY + "px");
        }

        function circleMouseleave(d){
            var sel = d3.select(this);
            sel.each(pulseStop);
            circle_tip.style("opacity", 0);
        }

        function filterCircles(label){
            console.log("FilterCircles");
            g.selectAll("circle")
            .classed("circles-active", function(d) {
                console.log(label);
                if(d.labels.includes(label)){
                    return true;
                }

                return false;
            })
            .classed("circles-hidden", function(d) {
                if((parseInt(d.date.substring(5,7))>=Math.min(sliderRange.value()[0],sliderRange.value()[1])) && (parseInt(d.date.substring(5,7))<=Math.max(sliderRange.value()[0],sliderRange.value()[1]))){
                    return false;
                }

                return true;
            });
        }


        function pulse() {
            var circle = d3.select(this);
            r = circR;
            stroke = 2;

            circle
            .attr('r', r)
            .attr("stroke-width", 0)
            .attr("stroke-opacity", 0.5)
            .transition()
            .ease(d3.easeSin)
            .duration(450)
            .attr('r', 1.5 * r)

            .transition()
            .ease(d3.easeLinear)
            .duration(550)
            .attr('r', r)
            .attr("stroke-width", stroke)
            .attr("stroke-opacity", 0.25)

            .transition()
            .duration(600)
            .attr("stroke-width", 2 * stroke)
            .attr("stroke-opacity", 0.0)
            .on("end", pulse);
        };

        function pulseStop(){
            var circle = d3.select(this);
            circle.transition().duration(200)
            .attr("r", circR)
            .attr("stroke-width", 0)
            .attr("stroke-opacity", 0);
        }

        const format = d3.format(",d");
        const width_sunburst = 250;
        const radius = width_sunburst / 6;

        var filterLabel = "All data"

        const arc = d3.arc()
                .startAngle(d => d.x0)
                .endAngle(d => d.x1)
                .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
                .padRadius(radius * 1.5)
                .innerRadius(d => d.y0 * radius)
                .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

        const partition = data => {
            const root = d3.hierarchy(data)
                    .sum(d => d.value)
                    .sort((a, b) => b.value - a.value);
            return d3.partition()
                    .size([2 * Math.PI, root.height + 1])
                    (root);
        }

        d3.json("labels.json").then(data => {
            const root = partition(data);
            const color = d3.scaleOrdinal().range(d3.quantize(d3.interpolateRainbow, data.children.length + 1));

            root.each(d => d.current = d);

            const svg = d3.select("#partitionSVG")
                    .style("font", "6px sans-serif");

            const g = svg.append("g")
                    .attr("transform", `translate(${width_sunburst / 2},${width_sunburst / 2})`);

        	text = svg.append('text')
        	  .text('All data')
        	  .attr('dy','0.35em')
        	  .attr('transform', 'translate(125,123)')
        	  .style("text-anchor", "middle")

            const path = g.append("g")
                    .selectAll("path")
                    .data(root.descendants().slice())
                    .join("path")
                    .attr("fill", d => {
                        while (d.depth > 1)
                            d = d.parent;
                        return color(d.data.name);
                    })
                    .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
                    .attr("d", d => arc(d.current));

            path.filter(d => d)
                    .style("cursor", "pointer")
                    .on("click", clicked);

            path.append("title")
                    .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

            const label = g.append("g")
                    .attr("pointer-events", "none")
                    .attr("text-anchor", "middle")
                    .style("user-select", "none")
                    .selectAll("text")
                    .data(root.descendants().slice())
                    .join("text")
                    .attr("dy", "0.35em")
                    .attr("fill-opacity", d => +labelVisible(d.current))
                    .attr("transform", d => labelTransform(d.current))
                    .text(d => d.data.name);


            const parent = g.append("circle")
                    .datum(root)
                    .attr("r", radius)
                    .attr("fill", "none")
                    .attr("pointer-events", "all")
                    .on("click", clicked);

            function clicked(p) {
                parent.datum(p.parent || root);

                root.each(d => d.target = {
                        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                        y0: Math.max(0, d.y0 - p.depth),
                        y1: Math.max(0, d.y1 - p.depth)
                    });

                const t = g.transition().duration(750);

                // Transition the data on all arcs, even the ones that aren’t visible,
                // so that if this transition is interrupted, entering arcs will start
                // the next transition from the desired position.

        		// last layer
        		if (p.children == undefined){
        			path.transition(t)
        					.tween("data", d => {
        						const i = d3.interpolate(d.current, d.target);
        						return t => d.current = i(t);
        					})
        					.attrTween("d", d => () => arc(d.current));

        			label.filter(function (d) {
        				return +this.getAttribute("fill-opacity") || labelVisible(d.target);
                }).transition(t)
                        .attr("fill-opacity", d => +labelVisible(d.target))
                        .attrTween("transform", d => () => labelTransform(d.current));
        		} else {
        			path.transition(t)
        					.tween("data", d => {
        						const i = d3.interpolate(d.current, d.target);
        						return t => d.current = i(t);
        					})
        					.filter(function (d) {
        						return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        					})

        					.attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
        					.attrTween("d", d => () => arc(d.current));

        			label.filter(function (d) {
        				return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        			}).transition(t)
        					.attr("fill-opacity", d => +labelVisible(d.target))
        					.attrTween("transform", d => () => labelTransform(d.current));
        				}
        			text.text(p.data.name)
        			filterLabel = p.data.name
              if (p.depth > 1 || (p.depth > 2 && p.data.name == "Nature")){
                filterCircles(filterLabel)
              } else if (p.depth == 0) {
                filterCircles(filterLabel)
              }
            }

            function arcVisible(d) {
                return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
            }

            function labelVisible(d) {
                return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
            }

            function labelTransform(d) {
                const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
                const y = (d.y0 + d.y1) / 2 * radius;
                return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
            }
        })

		// Slider
		var slider_data = [1,2,3,4,5,6,7,8,9,10,11,12]
		var tickLabels = ['jan','feb','mar','apr','may','jun','jul','aug','sept','oct','nov','dec']

		// Range
		var sliderRange = d3
			.sliderBottom()
			.width(400)
			.min(d3.min(slider_data))
			.max(d3.max(slider_data))
			.tickFormat(function(d,i){ return tickLabels[i] })
			.step(1)
			.default([1,12])
			.fill('#2196f3')
			.on('onchange', val => {
			filterCircles(filterLabel);
			});


		var gRange = d3
			.select('body')
			.append('svg')
            .attr('id', 'slider')
			.attr('width', 1500)
			.attr('height', 100)
			.append('g')
			.attr('transform', 'translate(500,30)');


		 gRange.call(sliderRange);
    });
});
