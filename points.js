/**
 * @fbielejec
 */

function generatePoints(data) {

	
	var colorAttribute = getObject(lineAttributes, "id",
	"antigenic2");
	
	var startColor = colorbrewer.YlOrRd[9][2];
	var endColor = colorbrewer.YlOrRd[9][7];
	
//	console.log(startColor);
//	console.log(endColor);
	
	var colorscale = d3.scale.linear().domain(colorAttribute.range)
	.range([startColor, endColor ]);
	
	
	svg.append("g")
	  .attr("class", "pointsLegend")
	.attr("transform", "translate(" + (width) + "," + (height/2) + ")");
	
	
	var legendLinear = d3.legend.color()
	  .shapeWidth(30)
	    .cells(5)
	     .title(capitalizeFirstLetter(colorAttribute.id))
	  .orient('vertical')
	  .scale(colorscale);

	svg.select(".pointsLegend")
	  .call(legendLinear);
	
	
	
	
	var points = pointsLayer.selectAll("circle").data(data).enter().append(
			"circle") //
	.attr("class", "point") //
	.attr("startTime", function(d) {

		return (d.startTime);

	}) //
	.attr(
			"cx",
			function(d) {

				var xy;
				var location = d.location;
				if (typeof location != 'undefined') {

					xy = projection([ location.coordinate.yCoordinate,
							location.coordinate.xCoordinate ]);

				} else {

					xy = projection([ d.coordinate.yCoordinate,
							d.coordinate.xCoordinate ]);

				}

				var cx = xy[0]; // lat
				return (cx);
			}) //
	.attr(
			"cy",
			function(d) {

				var xy;
				var location = d.location;
				if (typeof location != 'undefined') {

					xy = projection([ location.coordinate.yCoordinate,
							location.coordinate.xCoordinate ]);

				} else {

					xy = projection([ d.coordinate.yCoordinate,
							d.coordinate.xCoordinate ]);

				}

				var cy = xy[1]; // long
				return (cy);
			}) //
	.attr("r", 2.5) //
	.attr("fill", function(d) {
		
		return (colorscale(+d.attributes.antigenic2) );
		
		
	}) //
	.attr("stroke", "black");

	// dump attribute values into DOM
	points[0].forEach(function(d, i) {

		var thisPoint = d3.select(d);
		var properties = data[i].attributes;

		for ( var property in properties) {
			if (properties.hasOwnProperty(property)) {

				thisPoint.attr(property, properties[property]);

			}
		}// END: properties loop
	});

}// END: generatePoints
