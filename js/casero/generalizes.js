
function getTimeWindow(start, stop, polaridad, step){
	//step :  (every N minutes/hours/days/months or years)
	let timeWindow; 
	switch(polaridad.toLowerCase()){
		case "m":
			timeWindow = d3.time.minutes(start, stop, step);
			break;
		case "h":
			timeWindow = d3.time.hours(start, stop, step);
			break;
		case "d":
			timeWindow = d3.time.days(start, stop, step);
			break;
		case "b":
			timeWindow = d3.time.months(start, stop, step);
			break;
		case "y":
			timeWindow = d3.time.years(start, stop, step);
			break;
		default:
			console.log("polarity problem")
			break;
	}
	return timeWindow;
}

function getTimeRound(start, polaridad){
let timeRound; 
switch(polaridad.toLowerCase()){
	case "m":
		timeRound = d3.time.minute.round(start);
		break;
	case "h":
		timeRound = d3.time.hour.round(start);
		break;
	case "d":
		timeRound = d3.time.day.round(start);
		break;
	case "b":
		timeRound = d3.time.month.round(start);
		break;
	case "y":
		timeRound = d3.time.year.round(start);
		break;
	default:
		console.log("gettimeRound")
		break;
}
return timeRound;
}

//interval.offset(date, step)
function getTimeOffset(start, offset, polaridad){
let timeOffset; 
switch(polaridad.toLowerCase()){
	case "m":
		timeOffset = d3.time.minute.offset(start, offset);
		break;
	case "h":
		timeOffset = d3.time.hour.offset(start, offset);
		break;
	case "d":
		timeOffset = d3.time.day.offset(start, offset);
		break;
	case "b":
		timeOffset = d3.time.month.offset(start, offset);
		break;
	case "y":
		timeOffset = d3.time.year.offset(start, offset);
		break;
	default:
		console.log("getTimeOffset")
		break;
}
return timeOffset;
}


function getTimePolarity(polaridad){
let timePolarity;
switch(polaridad.toLowerCase()){
	case "m":
		timePolarity = d3.time.minutes;
		break;
	case "h":
		timePolarity = d3.time.hours;
		break;
	case "d":
		timePolarity = d3.time.days;
		break;
	case "b":
		timePolarity = d3.time.months;
		break;
	case "y":
		timePolarity = d3.time.years;
		break;
	default:
		console.log("Error in getTimePolarity");
		break;
}
return timePolarity;
}

function getSuperiorTimePolarity(polaridad){
	let superiortimePolarity;
	switch(polaridad.toLowerCase()){
		case "m":
			superiortimePolarity = "h";
			break;
		case "h":
			superiortimePolarity = "d";
			break;
		case "d":
			superiortimePolarity = "b";
			break;
		case "b":
			superiortimePolarity = "y";
			break;
		case "y":
			superiortimePolarity = "y";
			break;
		default:
			console.log("Error in getSuperiorTimePolarity");
			break;
	}
	return superiortimePolarity;
}


function printLog(startDate, methodName){
	if(log){
		console.log(methodName + ": " +(Date.now()-startDate)/1000 + " seg.");
	}
}

function getBrowser() {
	if( navigator.userAgent.indexOf("Chrome") != -1 ) {
		return "Chrome";
	} else if( navigator.userAgent.indexOf("Opera") != -1 ) {
		return "Opera";
	} else if( navigator.userAgent.indexOf("MSIE") != -1 ) {
		return "IE";
	} else if( navigator.userAgent.indexOf("Firefox") != -1 ) {
		return "Firefox";
	} else { 
		return "unknown";
	}
}



function getAvg(...arg){
let sum = 0;
for(let value of arg){
	sum +=value;
}
return sum / arg.length;
}

// Ref math.js library
function getStd(...arg){
return math.std(arg);
}



// function standardDeviation(values){
//   var avg = average(values);

//   var squareDiffs = values.map(function(value){
//     var diff = value - avg;
//     var sqrDiff = diff * diff;
//     return sqrDiff;
//   });

//   var avgSquareDiff = average(squareDiffs);

//   var stdDev = Math.sqrt(avgSquareDiff);
//   return stdDev;
// }

// function average(data){
//   var sum = data.reduce(function(sum, value){
//     return sum + value;
//   }, 0);

//   var avg = sum / data.length;
//   return avg;
// }

// function median(values) {

//     values.sort( function(a,b) {return a - b;} );

//     var half = Math.floor(values.length/2);

//     if(values.length % 2)
//         return values[half];
//     else
//         return (values[half-1] + values[half]) / 2.0;
// }


/* Return number of minutes in brush object */
function calculeNumIntervals(brushObject, polarityTemporal, stepTemporal) {
var result;
switch (polarityTemporal) {
case "m":result = d3.time.minutes(brushObject.extent()[0], brushObject.extent()[1], stepTemporal).length;
	break;
case "h":result = d3.time.hours(brushObject.extent()[0],brushObject.extent()[1], stepTemporal).length;
	break;
case "d":result = d3.time.days(brushObject.extent()[0], brushObject.extent()[1],stepTemporal).length;
	break;
case "b":result = d3.time.months(brushObject.extent()[0],brushObject.extent()[1], stepTemporal).length;
	break;
case "y":result = d3.time.years(brushObject.extent()[0],brushObject.extent()[1], stepTemporal).length;
	break;
}
return result;
}


function getNumberOfLabels(polarityTemporal, i, j){

var lenghtRange =  rangesDomainMultiresolution[i].values[j].range[1]-rangesDomainMultiresolution[i].values[j].range[0];
var numberOfIntervals = intervals(polarityTemporal, i);
var lenghtLabel;
var numberOfLabels;

lenghtLabel = getTextWidthInPx(" 00:00 ","20px Arial");
	
numberOfLabels = Math.floor(lenghtRange/lenghtLabel);

//If the number of labels to put is bigger than the number of intervales
if(numberOfLabels > numberOfIntervals){
	numberOfLabels = numberOfIntervals;
}

return numberOfLabels;
}


function getNumIntervalsDistortion(polarityTemporal, i, j,sDisLeft, sDisRight){
var numInterval = intervals(polarityTemporal, i);
var taille = rangesDomainMultiresolution[i].values[j].range[1]-rangesDomainMultiresolution[i].values[j].range[0];
var sizeLabel; // = getTextSize("00:00","10px Arial");
if(i==1){//distortion left
	taille = sDisLeft;
	if(j%2==1){
		sizeLabel = getTextWidthInPx(" 00:00 ","20px Arial") *2
	}else{
		sizeLabel = 1000000000;
	}
}else if(i==3){//distortion right
	taille = sDisRight;
	if(j%2==1){
		sizeLabel = getTextWidthInPx(" 00:00 ","20px Arial") *2
	}else{
		sizeLabel = 1000000000;
	}
}

var x = numInterval/(taille / sizeLabel); //numInterval/
//Cada cuantos intervalos de tiempo se ponen el axis label
//Ex: return 3; =  cada 10 minutos
return Math.floor(x);

}




function intervals(polarityTemporal, i){
var interval;
switch (polarityTemporal) { 
	case "m":
		switch (i) { 
			case 0:
				interval = (d3.time.minutes(brushContextNorLeft.extent()[0],
						brushContextNorLeft.extent()[1])).length;
				break;
			case 1:
				interval = (d3.time.minutes(brushContextDisLeft.extent()[0],
						brushContextDisLeft.extent()[1])).length;
				break;
			case 2:
				interval = (d3.time.minutes(brushContext.extent()[0],
						brushContext.extent()[1])).length;
				break;
			case 3:
				interval = (d3.time.minutes(brushContextDisRight.extent()[0],
						brushContextDisRight.extent()[1])).length;
				break;
			case 4:
				interval = (d3.time.minutes(brushContextNorRight.extent()[0],
						brushContextNorRight.extent()[1])).length;
				break;
		}
		break;
	case "h":
		switch (i) { 
			case 0:
				interval = (d3.time.hours(brushContextNorLeft.extent()[0],
						brushContextNorLeft.extent()[1])).length;
				break;
			case 1:
				interval = (d3.time.hours(brushContextDisLeft.extent()[0],
						brushContextDisLeft.extent()[1])).length;
				break;
			case 2:
				interval = (d3.time.hours(brushContext.extent()[0],
						brushContext.extent()[1])).length;
				break;
			case 3:
				interval = (d3.time.hours(brushContextDisRight.extent()[0],
						brushContextDisRight.extent()[1])).length;
				break;
			case 4:
				interval = (d3.time.hours(brushContextNorRight.extent()[0],
						brushContextNorRight.extent()[1])).length;
				break;
		}
	break;			
	case "d":
		switch (i) { 
			case 0:
				interval = (d3.time.days(brushContextNorLeft.extent()[0],
						brushContextNorLeft.extent()[1])).length;
				break;
			case 1:
				interval = (d3.time.days(brushContextDisLeft.extent()[0],
						brushContextDisLeft.extent()[1])).length;
				break;
			case 2:
				interval = (d3.time.days(brushContext.extent()[0],
						brushContext.extent()[1])).length;
				break;
			case 3:
				interval = (d3.time.days(brushContextDisRight.extent()[0],
						brushContextDisRight.extent()[1])).length;
				break;
			case 4:
				interval = (d3.time.days(brushContextNorRight.extent()[0],
						brushContextNorRight.extent()[1])).length;
				break;
		}
	break;					
	case "b":
		switch (i) { 
			case 0:
				interval = (d3.time.months(brushContextNorLeft.extent()[0],
						brushContextNorLeft.extent()[1])).length;
				break;
			case 1:
				interval = (d3.time.months(brushContextDisLeft.extent()[0],
						brushContextDisLeft.extent()[1])).length;
				break;
			case 2:
				interval = (d3.time.months(brushContext.extent()[0],
						brushContext.extent()[1])).length;
				break;
			case 3:
				interval = (d3.time.months(brushContextDisRight.extent()[0],
						brushContextDisRight.extent()[1])).length;
				break;
			case 4:
				interval = (d3.time.months(brushContextNorRight.extent()[0],
						brushContextNorRight.extent()[1])).length;
				break;
		}
	break;	
	case "y":
		switch (i) { 
			case 0:
				interval = (d3.time.years(brushContextNorLeft.extent()[0],
						brushContextNorLeft.extent()[1])).length;
				break;
			case 1:
				interval = (d3.time.years(brushContextDisLeft.extent()[0],
						brushContextDisLeft.extent()[1])).length;
				break;
			case 2:
				interval = (d3.time.years(brushContext.extent()[0],
						brushContext.extent()[1])).length;
				break;
			case 3:
				interval = (d3.time.years(brushContextDisRight.extent()[0],
						brushContextDisRight.extent()[1])).length;
				break;
			case 4:
				interval = (d3.time.years(brushContextNorRight.extent()[0],
						brushContextNorRight.extent()[1])).length;
				break;
		}
	break;				
}
return interval;
}

function removeOverlapping(data){
	//DATA STRUCTURE
	//data.element.forEach(function(element){
		// element.keyOverlap = key; //IMPORTANT KEY
		// element.key = key; //IMPORTANT KEY
		// element.overlaping = false;
		// element.coordinates = {"x1":x1,"y1":y1,"x2":x2,"y2":y2};;
	// })

	let dataWork = data.filter(d=>d.keyOverlap!="");

	dataWork.forEach(function(element){

		let rangeOthers = dataWork.filter(function(elementToFilter){
			return element.keyOverlap != elementToFilter.keyOverlap;
		});

		let rectElement = {"left": element.coordinates.x1, 
							"bottom": element.coordinates.y1, 
							"right": element.coordinates.x2, 
							"top": element.coordinates.y2
						};
								
		rangeOthers.forEach(function(elementOther){
			if(!elementOther.overlaping){
				let rectElementOther = {
						"left": elementOther.coordinates.x1, 
						"bottom": elementOther.coordinates.y1, 
						"right": elementOther.coordinates.x2, 
						"top": elementOther.coordinates.y2
					}; 
				if(intersectRect(rectElement, rectElementOther)){
					element.overlaping = true;
				}
			}
		});
	});

	//To get just text label that are not overlapping
	return data.filter(element=>element.overlaping == false);
}


function getRemFromPx(px){
	return px/16;
}

function getPxFromRem(rem){
	return rem*16;
}

//Get text width in PX
// The measureText() method returns an object that contains the width of the specified text, in pixels.
function getTextWidthInPx(text, font){
	d3.select("body").append("canvas").attr("id",'myCanvas');
	var c=document.getElementById('myCanvas');
	var ctx=c.getContext('2d');
	ctx.font=font;
	var m=ctx.measureText(text);
	d3.selectAll("#myCanvas").remove();
	return m.width;
}

function intersectRect(r1, r2) {
	return !(r2.left > r1.right || 
					 r2.right < r1.left || 
					 r2.bottom > r1.top ||
					 r2.top < r1.bottom);
}

function moyenneTableau(arr) {
	var somme = 0;
	for (var i = 0, j = arr.length; i < j; i++) {
		somme += arr[i];
	}
	return somme / arr.length;
}

function exportToCsv(filename, rows) {
	var processRow = function (row) {
			var finalVal = '';
			for (var j = 0; j < row.length; j++) {
					var innerValue = row[j] === null ? '' : row[j].toString();
					if (row[j] instanceof Date) {
							innerValue = row[j].toLocaleString();
					};
					var result = innerValue.replace(/"/g, '""');
					if (result.search(/("|,|\n)/g) >= 0)
							result = '"' + result + '"';
					if (j > 0)
							finalVal += ',';
					finalVal += result;
			}
			return finalVal + '\n';
	};

	var csvFile = '';
	for (var i = 0; i < rows.length; i++) {
			csvFile += processRow(rows[i]);
	}

	var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
	if (navigator.msSaveBlob) { // IE 10+
			navigator.msSaveBlob(blob, filename);
	} else {
			var link = document.createElement("a");
			if (link.download !== undefined) { // feature detection
					// Browsers that support HTML5 download attribute
					var url = URL.createObjectURL(blob);
					link.setAttribute("href", url);
					link.setAttribute("download", filename);
					link.style.visibility = 'hidden';
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
			}
	}
}

function getAgregatedValue(data){
let sumValue = data.reduce(function(acc,curr){
				return acc+curr.value;
},0);
return sumValue;
}


function exportConfiguration(){
	let fileDownloadName = "multistream_share.json";
	let currConfiguration = getCurrConfiguration();

	let blob = getBlobFromJson(currConfiguration);
	let url = window.URL.createObjectURL(blob);
	let a = document.createElement("a");
	document.body.appendChild(a);
	a.setAttribute("download",fileDownloadName);
	a.setAttribute("href", url);
	a.style["display"] = "none";
	a.click();
}

function getBlobFromJson(json){
let jsonBlob = JSON.stringify(json);
let blob = new Blob([jsonBlob], {type: "application/json"});
return blob;
}

function importConfiguration(){

}


function getCurrConfiguration(){

	let dateFormat = d3.time.format("%Y-%m-%d %H:%M");
	
	console.log(brushContext.extent())

	let jsonCurrConfiguration = {
		"optsGeneral": {
			"active":true,
			"date":dateFormat(new Date()),
		},
		"optsMultistream": {
			"facteurZoom": 4,
			"facteurDis": 2,
			"facteurNor": 1,
			"offsetType": offsetType,
			"optsMultiresolution": {
				"showLimitsAreas": false,
				"layersFadingColors": false,
				"layersShowBorderline": false
			},
			"optsContext": {
				"showBrushDistortion": false,
				"showBrushNormal": true,
				"showContext": true,
				"blockedBrushNormalLeft": lockedLeft,
				"blockedBrushNormalRight": lockedRight,
				"blockedBrushZoom": false,
				"timeIntervalBrushNormalLeft": brushContextNorLeft.extent(),
				"timeIntervalBrushDistortionLeft": brushContextDisLeft.extent(),
				"timeIntervalBrushZoom": brushContext.extent(),
				"timeIntervalBrushDistortionRight": brushContextDisRight.extent(),
				"timeIntervalBrushNormalRight": brushContextNorRight.extent()
			}
		},
		"optsTree": {
			"key_focus_list_outflow":key_focus_list_outflow,
			"key_context_list_outflow":key_context_list_outflow,
			"key_focus_list_inflow":key_focus_list_inflow,
			"key_context_list_inflow":key_context_list_inflow
		},
		"optsMap":{
			"scale":currMapScale,
			"translate":currMapTranslate
		}
	};

	return jsonCurrConfiguration;
}



function removeAllChildrenOfAList(idList){
	let list = document.getElementById(idList);
	while (list.hasChildNodes()) {
		list.removeChild(list.firstChild);
	}
}




function addElement(parentId, elementTag, elementId, html) {
	// Adds an element to the document
	var p = document.getElementById(parentId);
	var newElement = document.createElement(elementTag);
	newElement.setAttribute('id', elementId);
	newElement.innerHTML = html;
	p.appendChild(newElement);
	return newElement;
}

function removeElement(idElement){
	try {
		let element = document.getElementById(idElement);
		element.parentNode.removeChild(element);
	}
	catch(err){
		console.log("il ny pas encore cet element :)");
	}
}

function removeClass(parentId, className){
// Get the container element
var btnContainer = document.getElementById(parentId);

if(btnContainer.children){
	for(let i=0;i<btnContainer.children.length;i++){
		let currElement = btnContainer.children[i];
		currElement.classList.remove(className);
	}
}

}



function putImageToCanvas(canvas,imgData,x,y){
let ctx = canvas.getContext("2d");
ctx.putImageData(imgData,x,y);
return canvas;
}

function getImageFromCanvas(canvas,x,y,width,height){
let ctx = canvas.getContext("2d");
let imgData = ctx.getImageData(x, y, width, height);
return imgData;
}

function createCanvas(fromElementId,toCanvasId,width,height){
html2canvas(document.querySelector("#"+fromElementId)).then(canvas => {

	let elemWidth = document.getElementById(fromElementId).offsetWidth;
	let elemHeight = document.getElementById(fromElementId).offsetHeight;

	let imgCanvasSnap = getImageFromCanvas(canvas,0,0,elemWidth,elemHeight);	
	let c = document.getElementById(toCanvasId);
	c = putImageToCanvas(c,imgCanvasSnap,0,0);
	c.style.width = width+ 'px';
	c.style.height = height+ 'px';
});
}

function getCapitalize(aString){
	return aString.replace(/(^|\s)\S/g, l => l.toUpperCase());
}

function removeItemInList(index, list){
	return list.splice(index, 1);
}


function getGeoJsonElementBiggestCoordinate(geoJsonElement){

	if(geoJsonElement.geometry.type === "MultiPolygon"){
		return {
			"type":"Feature",
			"geometry":{
				"type":"Polygon",
				// take the biggets polygon
				"coordinates":[getTheBiggestArray(geoJsonElement.geometry.coordinates)]
			}
		};
	}
	return geoJsonElement;
}

function getTheBiggestArray(multidimensionalArray){
	//[[[]]],[[[]]]
	let maxLength = 0;
	for(let i = 0; i<multidimensionalArray.length;i++){
		maxLength = Math.max(maxLength,multidimensionalArray[i][0].length);
	}

	for(let i = 0; i<multidimensionalArray.length;i++){
		if(multidimensionalArray[i][0].length==maxLength){
			return [...multidimensionalArray[i][0]];
		}
	}
	return null;
}

function getSlopeBetweenTwoPoints(x1, y1, x2, y2) {
	
	let numerator = (y2 - y1);
	let denominator = (x2 - x1);


	// console.log("x1",x1)
	// console.log("y1",y1)
	// console.log("x2",x2)
	// console.log("y2",y2)
	// console.log("numerator",numerator)
	// console.log("denominator",denominator)

	if (numerator == 0 && denominator == 0) {
		// Vertical line = slope no defined
		return -1;
	} else if (numerator == 0) {
		// horizontal line = slope zero
		return 0;
	} else {
		return numerator / denominator;
	}
}


//https://math.stackexchange.com/questions/436767/move-point-a-along-a-line
function getNewPointAlongPointA(pointA, pointB, distanceFromPointA){

	let x1 = pointA.x;
	let y1 = 2000-pointA.y; //2000 pour changer Y axis coordiantes
	let x2 = pointB.x;
	let y2 = 2000-pointB.y;

	let inDegrees = getDegreesBetweenTwoPoints(x1,y1,x2,y2);
	//getting radians from degrees to use in Math.sin and Math.cos
	let inRadians = getRadiansFromDegrees(inDegrees);
	
	//setting the result
	let resultX = Math.abs(distanceFromPointA * Math.cos(inRadians));
	let resultY = Math.abs(distanceFromPointA * Math.sin(inRadians));	
	let result = {x:resultX,y:resultY};

	
	let cuadrante = getCuadranteFromDegrees(inDegrees);
	switch(cuadrante){
		case 4://normalmente 1
			result.x =Math.abs(result.x);
			result.y =Math.abs(result.y);
			break;
		case 3://normalmente 2
			result.x =-result.x;
			break;
		case 2://normalmente 3
			result.x =-result.x;
			result.y =-result.y;
			break;
		case 1://normalmente 4
			result.y =-result.y;
			break;
		default:
			console.log("NO HAY CUANDRANTE");
	}

	return getSumTwoPoints(pointA,result);

}

function getDegreesBetweenTwoPoints(cx, cy, ex, ey) {
	var dy = ey - cy;
	var dx = ex - cx;
	// var theta = Math.atan(dy/dx);// range (-PI, PI]
	var theta = Math.atan2(dy, dx); // range (-PI, PI]
	theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
	if (theta < 0) theta = 360 + theta; // range [0, 360)
	return theta;
  }

function getCuadranteFromDegrees(angleInDegrees){
	if(angleInDegrees>=0 && angleInDegrees<90){
		return 1;
	}else if(angleInDegrees>=90 && angleInDegrees<180){
		return 2;
	}else if(angleInDegrees>=180 && angleInDegrees<270){
		return 3;
	}else if(angleInDegrees>=270 && angleInDegrees<360){
		return 4;
	}else{
		return null;
	}
}


function getPointMultiplyNumber(number, point){
	let x1 = point.x;
	let y1 = point.y;
	return [(number*x1),(number*y1)];
}

//Get the cartesian sum of two points
function getSumTwoPoints(pointA,pointB){

	if(pointA.length == pointB.length){
		let x1 = pointA.x;
		let y1 = pointA.y;
		let x2 = pointB.x;
		let y2 = pointB.y;
		return [(x1+x2),(y1+y2)];
	}
	return null;
}


function getDegreesFromRadians (radians) {
	let degrees = radians / (Math.PI/180);
	return degrees;
}

function getRadiansFromDegrees(degrees){
	let radians = degrees * (Math.PI/180); 
	return radians;
}


function getNewEndArrowAccordingStartArrowInclination(startArrowCenter, endArrowCenter, endArrowLabelHeight, radiusEndArrow){

	let destX = endArrowCenter[0];
	let destY = endArrowCenter[1];
	let oriX = startArrowCenter[0];
	let oriY = startArrowCenter[1];
	let destLabelHeightMiddle = endArrowLabelHeight/2;

	let newDestX = endArrowCenter[0];
	let newDestY = endArrowCenter[1];

	if(destY<=oriY){
		newDestY = destY - destLabelHeightMiddle - radiusEndArrow;
	}else{
		newDestY = destY + destLabelHeightMiddle + radiusEndArrow;
	}
	
	return [newDestX,newDestY];
}

function jsCapitalize(string) 
{
	string = string.toLowerCase();

	let separator = " ";
	let stringSplited = string.split(separator);
	let rejoinString = '';


	for(let i = 0; i<stringSplited.length;i++){
		rejoinString = rejoinString + jsUcfirst(stringSplited[i]);
		if((i+1)<stringSplited.length){
			rejoinString = rejoinString + separator;
		}
	}
    return rejoinString;
}

function jsUcfirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function isDateBetweenInclus(dateSince,dateUntil,dateVerify){
	if(dateSince.getTime()<=dateVerify.getTime() && dateVerify.getTime()<=dateUntil.getTime()){
		return true;
	}
	return false;
}


function getTopKFromArray(topK,array){
	let kElements = [];
	for(let i = 0; i < Math.min(topK,array.length); i++){
		let currVal = array[i];
		kElements.push(currVal);
	}
	return kElements;
}

function getMeanArray(array){
	let sum = 0;
	for (let i=0; i<array.length;i++){
		sum += array[i];
	}
	let mean = sum/array.length;
	return mean;
}


function getEuclideanDistanceOfTwoPoints(pointA, pointB){

	let x_pointA = pointA[0];
	let y_pointA = pointA[1];
	let x_pointB = pointB[0];
	let y_pointB = pointB[1];

	let dif_x = x_pointA - x_pointB;
	let dif_y = y_pointA - y_pointB;

	let euclideanDistance = Math.sqrt(Math.pow(dif_x,2)+Math.pow(dif_y,2));

	return euclideanDistance;
}