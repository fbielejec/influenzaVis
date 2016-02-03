/**
 * @fbielejec
 */

function generateTime(timeline) {

	dateFormat = d3.time.format("%Y/%m/%d");

	var startDate = formDate(timeline.startTime);
	sliderStartValue = startDate.getTime();

	var endDate = formDate(timeline.endTime);
	sliderEndValue = endDate.getTime();

	currentSliderValue = sliderStartValue;

	var sliderSpeed = 100;
	var duration = sliderEndValue - sliderStartValue;
	sliderInterval = duration / sliderSpeed;

	// initial value
	currentDateDisplay = d3.select('#currentDate').text(
			dateFormat(startDate));

	timeScale = d3.time.scale.utc().domain([ startDate, endDate ]).range(
			[ 0, 1 ]);
	timeSlider = d3.slider().scale(timeScale).axis(d3.svg.axis());
	d3.select('#timeSlider').call(timeSlider);

}//END: generateTime

function initializeTimeSlider(timeSlider, timeScale, currentDateDisplay,
		dateFormat) {

	// time slider listener
	timeSlider.on('slide', function(evt, value) {

		update(value, timeScale, currentDateDisplay, dateFormat);
		currentSliderValue = value;

	});// END: slide

	var playPauseButton = d3.select('#playPause').attr("class", "playPause")
			.on(
					"click",
					function() {

						if (playing) {
							playing = false;
							playPauseButton.classed("playing", playing);

							clearInterval(processID);

						} else {
							playing = true;
							playPauseButton.classed("playing", playing);

							processID = setInterval(function() {

								var sliderValue = currentSliderValue
										+ sliderInterval;
								if (sliderValue > sliderEndValue) {
									sliderValue = sliderStartValue;
								}

								timeSlider.value(sliderValue);
								update(sliderValue, timeScale,
										currentDateDisplay, dateFormat);

								currentSliderValue = sliderValue;

							}, 100);

						}// END: playing check

					});

}// END: initializeTimeSlider

function updateDateDisplay(value, timeScale, currentDateDisplay, dateFormat) {

	var currentDate = timeScale.invert(timeScale(value));
	currentDateDisplay.text(dateFormat(currentDate));

}// END: updateDateDisplay

function update(value, timeScale, currentDateDisplay, dateFormat) {

	updateDateDisplay(value, timeScale, currentDateDisplay, dateFormat);

	// ---LINES---//

	// ---select lines painting now---//

	linesLayer.selectAll("path.line") //
	.filter(
			function(d) {

				var linePath = this;
				var lineStartDate = formDate(
						linePath.attributes.startTime.value).getTime();
				var lineEndDate = formDate(linePath.attributes.endTime.value)
						.getTime();

				return (lineStartDate <= value && value <= lineEndDate);
			}) //
	.transition() //
	.ease("linear") //
	.attr(
			"stroke-dashoffset",
			function(d, i) {

				var linePath = this;
				var totalLength = linePath.getTotalLength();

				var lineStartDate = formDate(
						linePath.attributes.startTime.value).getTime();
				var lineEndDate = formDate(linePath.attributes.endTime.value)
						.getTime();
				var duration = lineEndDate - lineStartDate;
				var timePassed = value - lineStartDate;

				// TODO one month difference, why?
				// console.log("lineStartDate");
				// console.log(linePath.attributes.startTime.value);
				// console.log(dateFormat(formDate(linePath.attributes.startTime.value)));

				var offset = totalLength;
				if (duration == 0) {

					offset = 0;

				} else {

					offset = map(timePassed, 0, duration, 0, totalLength);

//					if (d.westofsource) {
//
//						offset = offset + totalLength;
//
//					} else {

						offset = totalLength - offset;
//					}

				}// END: instantaneous line check

				return (offset);
			}) //
	.attr("visibility", "visible");

	// ---select lines yet to be painted---//

	linesLayer.selectAll("path.line") //
	.filter(
			function(d) {
				var linePath = this;
				var lineStartDate = formDate(
						linePath.attributes.startTime.value).getTime();

				return (lineStartDate > value);
			}) //
	.attr("stroke-dashoffset", function(d, i) {
		var linePath = this;
		var totalLength = linePath.getTotalLength();

		return (totalLength);
	}) //
	.attr("visibility", "hidden");

	// ---select lines already painted---//

	linesLayer.selectAll("path.line") //
	.filter(
			function(d) {
				var linePath = this;
				var lineEndDate = formDate(linePath.attributes.endTime.value)
						.getTime();

				return (lineEndDate < value);
			}) //
	.attr("stroke-dashoffset", 0) //
	.attr("visibility", "visible");

	// ---POINTS---//

	// ---select points yet to be displayed---//

	pointsLayer.selectAll(".point") //
	.filter(function(d) {
		var point = this;
		var startDate = formDate(point.attributes.startTime.value).getTime();

		return (value < startDate);
	}) //
	.transition() //
	.ease("linear") //
//	.duration(1000) //
	.attr("visibility", "hidden")
	.attr("opacity", 0);
//
//	// ---select point displayed now---//

	pointsLayer.selectAll(".point") //
	.filter(function(d) {
		var point = this;
		var startDate = formDate(point.attributes.startTime.value).getTime();

		return (value >= startDate);
	}) //
	.transition() //
	.ease("linear") //
//	.duration(500) //
	.attr("visibility", "visible") //
	.attr("opacity", 1);
	
}// END: update

