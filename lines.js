/**
 * @fbielejec
 */

function generateLines(data, points) {

	var colorAttribute = getObject(lineAttributes, "id",
			"lineage");
	
//	var startColor = colorbrewer.Paired[12][0];
//	var endColor = colorbrewer.Paired[12][3];

//	2009_pandemic_1A	#CD322E
//	human_seasonal_H1	#D6D6E2
//	classical_swine_1A	#2481BA
//	eurasian_avian-like_1C	#89A24C
//	human_seasonal_H1-like_1B	#835B9C
//	2009_pandemic_1A_human	#E38886
	
	
	var h1cols = [ "#CD322E", "#D6D6E2", "#2481BA", "#89A24C", "#835B9C" ]; //= colorbrewer.Dark2[8]
	var colorscale = d3.scale.ordinal().range( h1cols ).domain(colorAttribute.domain);
	
//	var colorscale = d3.scale.linear().domain(colorAttribute.range)
//	.range([startColor, endColor ]);

	svg.append("g")
	  .attr("class", "linesLegend")
	.attr("transform", "translate(" + (width + 20 ) + "," + (0 + 70) + ")");
	
	
	var legendLinear = d3.legend.color()
//	  .shapeWidth(30)
	.shapeRadius(5)
	.shapePadding(10)
	   .shape('circle')
	    .cells(5)
	  .orient('vertical')
	    .title(capitalizeFirstLetter(colorAttribute.id))
	  .scale(colorscale);

	svg.select(".linesLegend")
	  .call(legendLinear);
	
	
	var opacityAttribute = getObject(lineAttributes, "id",
	"height");
	
	var opacityscale = d3.scale.linear().domain(opacityAttribute.range)
	.range([0.5, 1 ]);	
	
	var lines = linesLayer
			.selectAll("path")
			.data(data)
			.enter()
			.append("path")
			//
			.attr("class", "line")
			//
			.attr(
					"d",
					function(d, i) {

						var line = d;

						var startPointId = line.startPointId;
						var startPoint = getObject(points, "id", startPointId);
						line['startPoint'] = startPoint;

						var startCoordinate;
						var startLocation = startPoint.location;
						if (typeof startLocation != 'undefined') {

							startCoordinate = startLocation.coordinate;

						} else {

							startCoordinate = startPoint.coordinate;

						}
						// line['startCoordinate'] = startCoordinate;

						var endPointId = line.endPointId;
						var endPoint = getObject(points, "id", endPointId);
						line['endPoint'] = endPoint;

						var endCoordinate;
						var endLocation = endPoint.location;
						if (typeof startLocation != 'undefined') {

							endCoordinate = endLocation.coordinate;

						} else {

							endCoordinate = endPoint.coordinate;

						}
						// line['endCoordinate'] = endCoordinate;

						// line bend
						var curvature;
						var startTime = line.startTime;
						if (typeof startTime != "undefined") {

							curvature = 0;//scale(formDate(line.startTime));

						} else {
							curvature = 0;//lineMaxCurvature;
							
						}

						var startLatitude = startCoordinate.xCoordinate;
						var startLongitude = startCoordinate.yCoordinate;

						var endLatitude = endCoordinate.xCoordinate;
						var endLongitude = endCoordinate.yCoordinate;

						var sourceXY = projection([ startLongitude,
								startLatitude ]);
						var targetXY = projection([ endLongitude, endLatitude ]);

						var sourceX = sourceXY[0]; // lat
						var sourceY = sourceXY[1]; // long

						var targetX = targetXY[0];
						var targetY = targetXY[1];

						var dx = targetX - sourceX;
						var dy = targetY - sourceY;
						var dr = 0;

//						line['targetX'] = targetX;
//						line['targetY'] = targetY;
//						line['sourceX'] = sourceX;
//						line['sourceY'] = sourceY;

						var bearing = "M" + sourceX + "," + sourceY + "A" + dr
									+ "," + dr + " 0 0,1 " + targetX + ","
									+ targetY;


						return (bearing);

					})
			//
			.attr("fill", "none")
			//
			.attr("stroke-width", lineWidth + "px")
			//
			.attr("stroke-linejoin", "round")
			//
			.attr("stroke", function(d) {
				return (colorscale(d.attributes.lineage) );
			})
			//
			.attr("startTime", function(d) {
				return (d.startTime);
			})
			//
			.attr("endTime", function(d) {
				return (d.endTime);
			})
			//
			.attr("stroke-dasharray", function(d) {

				var totalLength = d3.select(this).node().getTotalLength();
				return (totalLength + " " + totalLength);
			})
			//
			.attr("stroke-dashoffset", 0)
			//
			.attr("opacity",  function(d) {

				return (opacityscale(+d.attributes.height));
			});
//			.on('mouseover', function(d) {
//
//				var line = d3.select(this);
//				line.classed("hover", true);
//
//				// bring line to the front
////				this.parentNode.parentNode.appendChild(this.parentNode);
//
//			})
//			//
//			.on('mouseout', function(d, i) {
//
//				var line = d3.select(this);
//				line.classed("hover", false);
//
//			})
//			.call(
//					d3.kodama
//							.tooltip()
//							.format(
//									function(d, i) {
//
//										return {
//											// title : "FOO",
//											items : [
//													{
//														title : 'From',
//														value : typeof (d.startPoint.location) == 'undefined' ? (d3
//																.round(
//																		d.startPoint.coordinate.xCoordinate,
//																		2)
//																+ ', ' + d3
//																.round(
//																		d.startPoint.coordinate.yCoordinate,
//																		2))
//																: d.startPoint.location.id
//													},
//													{
//														title : 'To',
//														value : typeof (d.endPoint.location) == 'undefined' ? (d3
//																.round(
//																		d.endPoint.coordinate.xCoordinate,
//																		2)
//																+ ', ' + d3
//																.round(
//																		d.endPoint.coordinate.yCoordinate,
//																		2))
//																: d.endPoint.location.id
//													} ]
//										};
//
//									}).theme('linesTheme')
//
//			);

	// dump attribute values into DOM
//	lines[0].forEach(function(d, i) {
//
//		var thisLine = d3.select(d);
//		var properties = data[i].attributes;
//
//		for ( var property in properties) {
//			if (properties.hasOwnProperty(property)) {
//
//				thisLine.attr(property, properties[property]);
//
//			}
//		}// END: properties loop
//	});

	
	
	
}// END: generateLines