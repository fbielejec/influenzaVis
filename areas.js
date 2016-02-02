/**
 * @fbielejec
 */

function generateAreas(data) {

	var areas = areasLayer.selectAll("area").data(data).enter().append(
			"polygon") //
	.attr("class", "area") //
	.attr("startTime", function(d) {

		return (d.startTime);

	}) //
	.attr("points", function(d) {

		var polygon = d.polygon;
		return polygon.coordinates.map(function(d) {

			xy = projection([ d.yCoordinate, d.xCoordinate ]);

			return [ xy[0], // lat
			xy[1] // long
			].join(",");

		}).join(" ");
	}) //
	.attr("fill", "brown") //
//	.attr("stroke", "#fff") //
	.attr("stroke-width", "0.5px") //
	.attr("fill-opacity", 0.03) //
	.attr("visibility", "visible") //
//	.on('mouseover', function(d) {
//
//		var area = d3.select(this);
//		area.attr('stroke', '#000');
//
//	}) //
//	.on('mouseout', function(d, i) {
//
//		var area = d3.select(this);
////		area.attr('stroke', '#fff');
//		area.attr('stroke', null);
//
//	}) //
//	.call(d3.kodama.tooltip().format(function(d, i) {
//
//		return {
//			// title : d.location.id,
//			items : [ {
//				title : 'Date',
//				value : d.startTime
//			} ]
//		};
//
//	}) //
//	.theme('countsTheme'))
	;


}// END: generateAreas