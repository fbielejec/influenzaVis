/**
 * @fbielejec
 */

function generateEmptyLayer(pointAttributes, axisAttributes) {

	var xlim = getObject(pointAttributes, "id", axisAttributes.xCoordinate).range;
//	xlim = [ xlim[0] - 2, xlim[1] + 2 ];

//	https://stackoverflow.com/questions/31202802/how-to-use-the-same-scale-on-the-y-as-the-x-but-smaller-because-of-the-size-diff
	
	var ylim = getObject(pointAttributes, "id", axisAttributes.yCoordinate).range;
	ylim = [ ylim[0] - 2, ylim[1] + 2 ];
	
	var bounds = [ xlim, ylim ];

	// maxX = xlim[0];

	var hscale = height / (bounds[0][1] - bounds[0][0]);
	var vscale = width / (bounds[1][1] - bounds[1][0]);

	scale = (hscale < vscale) ? hscale : vscale;
	scale = scale * 150;

	// x axis (domain swapped because of reverse coordinate order)
	var xScale = d3.scale.linear().domain(ylim).nice().range([ 0, width ]);

	
	var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
    .innerTickSize(-height)
    .outerTickSize(0)
	;

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
	var yScale = d3.scale.linear().domain(ylim).nice().range([ height, 0 ]);

	var yAxis = d3.svg.axis().scale(yScale).orient("left")
	.innerTickSize(-width)
    .outerTickSize(0)
	;

	yAxisLayer.call(yAxis);

	// y axis title
	g.append("text") //
	.attr("class", "y label") //
	.attr("text-anchor", "middle") //
//	.attr("x", 0).attr("y", width / 2)
//	.attr("transform","rotate(-90)")
	.attr(
			"transform",
			"translate(" + ( 40 ) + "," + (height / 2)
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

	
	
//	try this instead of graticules
//	http://bl.ocks.org/hunzy/11110940
	
	// graticules
//	var graticule = d3.geo.graticule();
//	
//	path = d3.geo.path().projection(projection);
//
//	svg.append("path").datum(graticule).attr("class", "graticule").attr("d",
//			path);
//	
//	// apply inline style
//	svg.selectAll('.graticule').style({
//		'stroke' : '#bbb',
//		'fill' : 'none',
//		'stroke-width' : '.5px',
//			'stroke-opacity' : '.5'
//	});
	
	
//	svg.selectAll('text')
//	.data(graticule.lines())
//		.enter().append("text")
//		.text(function(d) {
//				if ((d.coordinates[0][0] == d.coordinates[1][0]) && (d.coordinates[0][0] % 30 == 0)) {return (d.coordinates[0][0]);}
//				else if (d.coordinates[0][1] == d.coordinates[1][1]) {return (d.coordinates[0][1]);}
//			})
//		.attr("class","label")
//		.attr("style", function(d) { return (d.coordinates[0][1] == d.coordinates[1][1]) ? "text-anchor: end" : "text-anchor: middle"; })
//		.attr("dx", function(d) { return (d.coordinates[0][1] == d.coordinates[1][1]) ? -10 : 0; })
//		.attr("dy", function(d) { return (d.coordinates[0][1] == d.coordinates[1][1]) ? 4 : 10; })
//		.attr('transform', function(d) {
//			return ('translate(' + projection(d.coordinates[0])[0] + ',' + projection(d.coordinates[0])[1] + ')');
//		});
	
}// END: generateEmptyLayer
