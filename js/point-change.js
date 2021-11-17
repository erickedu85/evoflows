

function getPercentageVariation(curr,prev){
	let variation = Math.abs(curr-prev);
	let x = ((variation*100)/prev);

	// console.log(curr,",",prev," % ",x);

	return x;
}



function getPointAnomalyByPercentage(timeSerieValues,percentageIncrease,percentageDecrease){

	let aryResult = [];
	for (let i=1;i<timeSerieValues.length;i++){

		let currTS = timeSerieValues[i];
		let prevTS = timeSerieValues[(i-1)];

		let currTSValue = currTS.value;
		let prevTSValue = prevTS.value;

		let currVariation = getPercentageVariation(currTSValue,prevTSValue);

		if(isFinite(currVariation) && currTSValue>0 && prevTSValue>0){

			if(currTSValue>prevTSValue && currVariation>=percentageIncrease){
				let point = {
					"date":currTS.date,
					"relationRelative":1 //(currTSValue>prevTSValue)?1:0
				};
				aryResult.push(point);
			}

			if(prevTSValue>currTSValue && currVariation>=percentageDecrease){
				let point = {
					"date":currTS.date,
					"relationRelative":0
				};
				aryResult.push(point);
			}
			
		}
		
	}
	// console.log(aryResult)
	return aryResult;
}

function getPointDetectionByThreshold(timeSerieValues, threshold){
	let aryResult = [];

	// singleTimeSerieValues.forEach(){
		// category: ""
		// components: (3) [{…}, {…}, {…}]
		// coordinates: {x1: 287.0747657544685, y1: 383.0923821000915, x2: 338.4429603345466, y2: 394.3576932518433}
		// date: Tue Jan 01 1980 00:00:00 GMT+0100 (heure normale d’Europe centrale) {}
		// key: "R0_5_0_19"
		// overlaping: true
		// text: []
		// value: 193140
		// y: 193140
		// y0: 27485812.5
	// }

	for(let i=1; i<timeSerieValues.length;i++){

		let currTS = timeSerieValues[i];
		let prevTS = timeSerieValues[(i-1)];
		let relativeValue = currTS.value - prevTS.value;
		let absRelationReference = Math.abs(relativeValue);
		
		if(absRelationReference>threshold){
			aryResult.push({
				"date":currTS.date,
				"relationRelative":(relativeValue>0)?1:0 //1 up; 0 down
			});
		}
	}
	
	return aryResult;

}

function getLargestSubarray(timeSerieValues){

	let theArray = getDiferenceValues(timeSerieValues.map(d=>d.value));
	let subArray = getLargestSumIndexContiguousSubarray(theArray);

	let aryResult = [];
	aryResult.push({
		"dateStart":timeSerieValues[subArray.start_index].date,
		"relationRelative":1
	});
	

	return aryResult;
}

//https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/
// O(n)
// Algorithmic Paradigm: Dynamic Programming
function getLargestSumIndexContiguousSubarray(theArray){

	//Initialize:
    let max_so_far = 0;
	let max_ending_here = 0;
	let start_index = 0;
	let end_index = 0;
	let pivot_index = 0;

	for (let i=0;i<theArray.length;i++){
		max_ending_here = max_ending_here + theArray[i];
		if(max_ending_here<0){
			max_ending_here = 0;
			pivot_index = i+1;
		}
		
		if(max_so_far<max_ending_here){
			max_so_far = max_ending_here;
			start_index = pivot_index;
			end_index = i;
		}
	}

	return {
		"max_so_far":max_so_far,
		"start_index":start_index,
		"end_index":end_index
	};

}

function getDiferenceValues(theArray){

	if(theArray.length<2){
		return;
	}

	let result = [];
	for(let i = 1; i<theArray.length;i++){
		let currVal = theArray[i];
		let prevVal = theArray[i-1];
		let difeVal = currVal-prevVal;
		result.push(difeVal);
	}
	return result;

}