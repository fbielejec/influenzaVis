/**
 * @fbielejec
 */

function generateEmptyLayer(pointAttributes, axisAttributes) {

	var xlim = getObject(pointAttributes, "id", axisAttributes.xCoordinate).range;
	xlim = [ xlim[0] - 5, xlim[1] + 2 ];

	
	var ylim = getObject(pointAttributes, "id", axisAttributes.yCoordinate).range;
	ylim = [ ylim[0] - 0, ylim[1] + 0 ];
	
	var bounds = [ xlim, ylim ];

	// maxX = xlim[0];

	var hscale = height / (bounds[0][1] - bounds[0][0]);
	var vscale = width / (bounds[1][1] - bounds[1][0]);

	scale = (hscale < vscale) ? hscale : vscale;
	scale = scale * 150;

	// x axis (domain swapped because of reverse coordinate order)
	var xScale = d3.scale.linear().domain(ylim).nice().range([ 0, width ]);

	
	var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

	// add the x axis
//	g.append("g")
	xAxisLayer
	.attr("transform", "translate(0," + height + ")").call(xAxis);

	// x axis title
	g.append("text").attr("class", "x label").attr("text-anchor", "middle")
	.attr("x", width / 2).attr("y", height + margin.bottom - 10).style(
			"font-size", "18px") //
	.style({
		'stroke' : 'Black',
		'fill' : 'Black',
		'stroke-width' : '0.5px'
	}).text(capitalizeFirstLetter(axisAttributes.yCoordinate));
	
	
	// remove them 0's
	g.selectAll(".tick").filter(function(d) {
		return d === xScale.domain()[0];
	}).remove();

	// y axis (domain is swapped because of reverse coordinate order)
	var yScale = d3.scale.linear().domain(xlim).range([ height, 0 ]);

	var yAxis = d3.svg.axis().scale(yScale).orient("right");

	yAxisLayer.call(yAxis);

	// y axis title
	svg.append("text") //
	.attr("class", "y label") //
	.attr("text-anchor", "middle") //
	.attr(
			"transform",
			"translate(" + (0 + margin.left - 10) + "," + (height / 2)
					+ ")rotate(-90)") //
	.style("font-size", "18px") //
	.style({
		'stroke' : 'Black',
		'fill' : 'Black',
		'stroke-width' : '0.5px'
	}) //
	.text(capitalizeFirstLetter(axisAttributes.xCoordinate));
	
	// define null projection
	var zeroProjection = d3.geo.projection(function(x, y) {
		return [ x, y ];
	});

	var currentXDifference = zeroProjection([ 1, 1 ])[0]
			- zeroProjection([ 0, 0 ])[0];
	var currentYDifference = zeroProjection([ 1, 1 ])[1]
			- zeroProjection([ 0, 0 ])[1];

	scale = minScaleExtent * scale / currentXDifference;

	projection = zeroProjection.scale(scale);

	currentXDifference = zeroProjection([ 1, 1 ])[0]
			- zeroProjection([ 0, 0 ])[0];
	currentYDifference = zeroProjection([ 1, 1 ])[1]
			- zeroProjection([ 0, 0 ])[1];

	projection = zeroProjection.translate(
			[
					width / 2 + (bounds[1][0] + bounds[1][1]) / 2
							* currentYDifference,
					height / 2 + (bounds[0][0] + bounds[0][1]) / 2
							* currentXDifference ]).scale(scale);

}// END: generateEmptyLayer
