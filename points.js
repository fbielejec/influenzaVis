/**
 * @fbielejec
 */

d3.kodama
		.themeRegistry(
				'nodesTheme',
				{
					frame : {
						padding : '4px',
						background : 'linear-gradient(to top, rgb(177, 68, 68) 0%, rgb(188, 95, 95) 90%)',
						'font-family' : '"Helvetica Neue", Helvetica, Arial, sans-serif',
						'border' : '1px solid rgb(57, 208, 204)',
						color : 'rgb(245,240,220)',
						'border-radius' : '4px',
						'font-size' : '12px',
						'box-shadow' : '0px 1px 3px rgba(0,20,40,.5)'
					},
					title : {
						'text-align' : 'center',
						'padding' : '4px'
					},
					item_title : {
						'text-align' : 'right',
						'color' : 'rgb(220,200,120)'
					},
					item_value : {
						'padding' : '1px 2px 1px 10px',
						'color' : 'rgb(234, 224, 184)'
					}
				});

function generatePoints(data, pointAttributes) {

//	console.log(pointAttributes);
	
	// color
	var colorAttribute = getObject(lineAttributes, "id",
	"lineage");
	
//	var startColor = colorbrewer.YlOrRd[9][2];
//	var endColor = colorbrewer.YlOrRd[9][7];
	
//	console.log(startColor);
//	console.log(endColor);

	
	var h1cols = [ "#CD322E", "#D6D6E2", "#2481BA", "#89A24C", "#835B9C" ]; //= colorbrewer.Dark2[8]
	var colorscale = d3.scale.ordinal().range( h1cols ).domain(colorAttribute.domain);


	// size
	var sizeAttribute = getObject(pointAttributes, "id",
	"antigenic3");
	
	var sizeScale = d3.scale.linear().domain(sizeAttribute.range)
	.range([7, 1 ]);	
	
	
	
	svg.append("g")
	  .attr("class", "pointsSizeLegend")
	.attr("transform", "translate(" + (width + 20) + "," + (height/2 + 110) + ")");
	
	var legendSize = d3.legend.size()
	  .scale(sizeScale)
	  .shape('circle')
	  .shapePadding(15)
	  .labelOffset(20)
	  .orient('vertical')
	  .title(capitalizeFirstLetter(sizeAttribute.id));

	svg.select(".pointsSizeLegend")
	  .call(legendSize);
	
	
	
	
	
	
	
	
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
	.attr("r", function(d) {
		
		return(sizeScale(+d.attributes.antigenic3));
		
	}) //
	.attr("fill", function(d) {
		
		return (colorscale(d.attributes.lineage) );
		
		
	}) //
	.attr("stroke", "black") //
	.attr("opacity", 1.0)
	.on('mouseover', function(d) {

		var point = d3.select(this);
		point.attr('stroke', 'white');

	}) //
	.on('mouseout', function(d, i) {

		var point = d3.select(this);
//		point.attr('stroke', '#fff');
		point.attr('stroke', "black");
		
	}) //
	.call(d3.kodama.tooltip().format(function(d, i) {

		return {
			title : d.attributes.nodeName,
			items : [ {
				title : 'Antigenic1',
				value : (d.attributes.antigenic1).toFixed(2)
			}, //
			{
				title : 'Antigenic2',
				value : (d.attributes.antigenic2).toFixed(2)
			},
			{
				title : 'Antigenic3',
				value : (d.attributes.antigenic3).toFixed(2)
			}
			
			]
		};

	}) //
	.theme('nodesTheme'));
	
	// dump attribute values into DOM
//	points[0].forEach(function(d, i) {
//
//		var thisPoint = d3.select(d);
//		var properties = data[i].attributes;
//
//		for ( var property in properties) {
//			if (properties.hasOwnProperty(property)) {
//
//				thisPoint.attr(property, properties[property]);
//
//			}
//		}// END: properties loop
//	});

}// END: generatePoints
