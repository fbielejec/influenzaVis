/**
 * @fbielejec
 */

function generateTime(timeline) {

	dateFormat = d3.time.format("%Y/%m/%d");

	var startDate = formDate(timeline.startTime);
	sliderStartValue = startDate.getTime();

	var endDate = formDate(timeline.endTime);
	sliderEndValue = endDate.getTime();


	


}//END: generateTime



