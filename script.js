/**
 * @fbielejec
 */

// ---GLOBAL DEFINES---//

var lineAttributes;
var pointAttributes; 

//var projection;

var margin = {
	top : 20,
	right : 50,
	bottom : 10,
	left : 200,
};

var padding  = {
		left: 10,
		right : 10
};

var width = 1100 - margin.left - margin.right;
var height = 900 - margin.top - margin.bottom;

var minScaleExtent = 1;//0.7;
var maxScaleExtent = 5;
//var sliderStartValue;
//var sliderEndValue;
var lineWidth = 2;


//time slider
var playing = false;
var processID;
var currentSliderValue;
var sliderInterval;
var sliderStartValue;
var sliderEndValue;
var timeSlider;
var timeScale;
var currentDateDisplay ;
var dateFormat;


var zoom = d3.behavior.zoom().scaleExtent([ minScaleExtent, maxScaleExtent ])
		.center([ width / 2, height / 2 ]).size([ width, height ]).on("zoom",
				move);

var svg = d3.select("#container").append('svg') //
.attr("width", width + margin.left + margin.right) //
.attr("height", height + margin.top + margin.bottom) //
.call(zoom);

var g = svg.append("g");

var xAxisLayer = g.append("g").attr("class", "x axis");
var yAxisLayer = g.append("g").attr("class", "y axis");

var areasLayer = g.append("g").attr("class", "areasLayer");
var linesLayer = g.append("g").attr("class", "linesLayer");
var pointsLayer = g.append("g").attr("class", "pointsLayer");

// ---FUNCTIONS---//

function move() {

	var t = d3.event.translate;
	var s = d3.event.scale;
	var h = height / 4;

	t[0] = Math
			.min((width / height) * (s - 1), Math.max(width * (1 - s), t[0]));

	t[1] = Math.min(h * (s - 1) + h * s, Math.max(height * (1 - s) - h * s,
			t[1]));

	zoom.translate(t);
	g.attr("transform", "translate(" + t + ")scale(" + s + ")");

	// fit the paths to the zoom level
	// d3.selectAll(".country").attr("stroke-width", 1.0 / s);
	// d3.selectAll(".line").attr("stroke-width", lineWidth / s);
	// d3.selectAll(".point").attr("stroke-width", 1.0 / s);

}// END: move

d3.json("data/global_swine.H1.json", function ready(error, json) {

	lineAttributes = json.lineAttributes;
    pointAttributes = json.pointAttributes;
	
    console.log(pointAttributes);
    
	var timeline = json.timeLine;
	generateTime(timeline);

	initializeTimeSlider(timeSlider, timeScale, currentDateDisplay,
			dateFormat);

	// put slider at the end of timeLine, everything painted
	timeSlider.value(sliderEndValue);

	updateDateDisplay(sliderEndValue, timeScale, currentDateDisplay,
			dateFormat);
	
	var pointAttributes = json.pointAttributes;
	var axisAttributes = json.axisAttributes;
	generateEmptyLayer(pointAttributes, axisAttributes);

//	var areas = json.layers[0].areas;
//		generateAreas(areas);
	
	var points = json.layers[0].points;
	generatePoints(points);

	var lines = json.layers[0].lines;
	generateLines(lines, points);

});// END: d3.json

console.log("Done!");
