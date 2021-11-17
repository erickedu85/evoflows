var marginBarchartMap;
var heightBarchartMap;
var widthBarchartMap;

var barchartTopK;

//scales and axis
var yScaleBarchart = d3.scale.ordinal();
var yAxisBarchart = d3.svg.axis().scale(yScaleBarchart)
						.tickSize(0, 0) 
						// .ticks(4)
						.orient("left");

var xScaleBarchart = d3.scale.linear();
var xAxisBarchart = d3.svg.axis().scale(xScaleBarchart)
						.tickSize(5, 0) 
						.ticks(4)
						.tickFormat(customNumberFormat)
						.orient("bottom");


var xScaleBarchartBefore = d3.scale.linear();		

var ancienData = [];

// X Axis Candado
var candadoXAxis;
var isLockedXAxisBarChart;
// Y Axis PIN
var pinYAxis;
var isPinnedBarChart;
//


function createTopKBarchart(){

	let barchart_wrapper_width = mapVisWidth*0.7;

	let barchart_wrapper_height;
	if (windowsHeight >= 1440){
		barchart_wrapper_height = mapVisHeight*0.35
	}else if (windowsHeight >= 1080 ){
		barchart_wrapper_height = mapVisHeight*0.40
	} else{
		barchart_wrapper_height = mapVisHeight*0.47
	}


	
	gBarchartMap.attr("class","smallMultiple")
			.attr("transform","translate("+ 0 +","+ (mapVisHeight - barchart_wrapper_height) + ")");

	gBarchartMap.append("rect")
				.attr("class",'background')
				.attr("rx",8)
				.attr("ry",8)
				.attr("width",barchart_wrapper_width)
				.attr("height",barchart_wrapper_height); 
 

	marginBarchartMap = {top:70,right:55,bottom:60,left:barchart_wrapper_width*0.25};
	heightBarchartMap = barchart_wrapper_height - marginBarchartMap.top - marginBarchartMap.bottom;
	widthBarchartMap = barchart_wrapper_width - marginBarchartMap.left - marginBarchartMap.right;

	//title
	gBarchartMap.append("text")
			.attr("id","barchart-map-title")
			.attr("class","titulo")
			.attr("dy","-0.5em")	
			.attr("x", barchart_wrapper_width / 2)
			.attr("y", marginBarchartMap.top/2);
	
	//y axis label
	gBarchartMap.append("text")
			.attr({
				"class":"label",
				"x":0-barchart_wrapper_height/2, //This Y
				"y":20, //This X
				"transform":"rotate(-90)"
			})
			.style({
				"alignment-baseline":"central", //vertical only for text
				"text-anchor": "middle"
			})
			.text("Regions");

	//x axis label
	gBarchartMap.append("text")
			.attr("class","label")
			.attr("x",marginBarchartMap.left+widthBarchartMap/2)
			.attr("y",barchart_wrapper_height - marginBarchartMap.bottom/2)
			.attr("dy","1.3em")	
			.text("Num. "+ dataType);

	barchartTopK = gBarchartMap.append("g")
							.attr("id","barchartTopK")
							.attr("class","barchart")
							.attr("transform","translate("+(marginBarchartMap.left)+","+(marginBarchartMap.top)+")");

	//Append axis grid ||||						
	barchartTopK.append("g").attr("class","x grid")
							.attr("transform","translate(0,"+heightBarchartMap+")");

	barchartTopK.append("g").attr("id","barsInBarchart");

	xScaleBarchart.range([0,widthBarchartMap]);
	yScaleBarchart.rangeRoundBands([heightBarchartMap,0], 0.5);

	//To get animation from previous state
	xScaleBarchartBefore.range([0,widthBarchartMap]);

	//Append axis |__
	barchartTopK.append("g")
				.attr("class","x axis")
				.attr("transform","translate(0,"+heightBarchartMap+")");		

	barchartTopK.append("g")
				.attr("class","y axis")
				.attr("transform","translate(0,0)");


	
	let widthIcon = 16;
	let heightIcon = 16;

	// create locked for x axis
	// CANDADO
	candadoXAxis = gBarchartMap.selectAll("#candadoXAxis").data([1]);
		
	//create candado
	candadoXAxis.enter().append("image")
			.attr("id","candadoXAxis")
			.attr({
				'xlink:href': pathCandadoOpen,
				x: barchart_wrapper_width-marginBarchartMap.right+ heightIcon/2,
				y: barchart_wrapper_height-marginBarchartMap.bottom - heightIcon/2,
				width: widthIcon,
				height: heightIcon
			})
			.style("cursor","hand");


	//click action on candado barchart x axis
	d3.select("#candadoXAxis").on("click",function(d){
		document.getElementById("candadoXAxis").classList.toggle("consin");		
		if(document.getElementById("candadoXAxis").classList.contains("consin")){
			d3.select("#candadoXAxis").attr('xlink:href',pathCandadoClose);
			isLockedXAxisBarChart = true;
		}else{
			d3.select("#candadoXAxis").attr('xlink:href',pathCandadoOpen);
			isLockedXAxisBarChart = false;
		}
	});				

// 	//var isPinned;
	// create pin for y Axis
	// PIN
	pinYAxis = gBarchartMap.selectAll("#pinYAxis").data([1]);
		
	//create pin
	pinYAxis.enter().append("image")
			.attr("id","pinYAxis")
			.attr({
				'xlink:href': pathPin,
				x: marginBarchartMap.left-widthIcon/2,
				y: marginBarchartMap.top-heightIcon-widthIcon/2,
				// width: widthIcon,
				// height: heightIcon
			})
			.on("click",pinRegionsOnMap)
			.style("cursor","hand");

	setMapBarchartVisibility(false);

}




//if value === 0 then opacity 0; otherwise 1
let fill_opacity_value_bars = function(d){
	if(d.value==0){
		return 1e-6;
	}
	return 1;	
};

function updateTopKBarsInChart(currData,durationAnimation){

	let sizeCurrData = currData.length;
	if(sizeCurrData!=topKBarchart){
		let nElementosToAdd = (topKBarchart-sizeCurrData);
		for(let i=0;i<nElementosToAdd;i++){
			let emptyElement = {
				"properties": {"name": i},
				"value": "",
				"valueBefore": ""
			};
			currData.push(emptyElement);
		}
	}

	currData.sort(function(a,b){return a.value-b.value;});


	//update the input domain on the xScale

	let extentData;
	let extentDataBefore;

	if(isLockedXAxisBarChart){
		extentData = objSelectedFlowAnimation.maxInputDomain;
		extentDataBefore = objSelectedFlowAnimation.maxInputDomain;
	}else{
		extentData = [0,d3.max(currData,d=>d.value)];

		extentDataBefore = [0,d3.max(ancienData,d=>d.value)];
	}

	//Update the input domain on the xScale
	
	xScaleBarchart.domain(extentData);
	// xScaleBarchart.domain([0,d3.max(currData,d=>d.value)]); 
	//para animacion
	// xScaleBarchartBefore.domain(inputDomain);
	xScaleBarchartBefore.domain(extentDataBefore);
	// xScaleBarchartBefore.domain([0,d3.max(ancienData,d=>d.value)]);
	
	barchartTopK.select(".x.axis").transition().duration(durationAnimation).call(xAxisBarchart);
	
	let axisGridDivisionBottom = d3.svg.axis().scale(xScaleBarchart)
										.tickSize(-heightBarchartMap, 0) 
										.ticks(4) //comment faire automatic?
										.tickFormat("");
	barchartTopK.select(".x.grid")
			.transition().duration(durationAnimation).call(axisGridDivisionBottom);

	yScaleBarchart.domain(currData.map(d=>d.properties.name));

	barchartTopK.select(".y.axis")
			.transition().duration(durationAnimation).call(yAxisBarchart)
					.selectAll("text")
					.attr("dx", "-0.5em")
					.style({
						"fill-opacity": (d)=>{
							if(!isNaN(d)){
								return 1e-6;
							}
							return 1;
						}
					});

	let bars = barchartTopK.select("#barsInBarchart")
							.selectAll(".barsTopK")
							.data(currData,d=>d.properties.name);
	

	//exit
	bars.exit()
		.style({
			"opacity":1
		})
	  .transition().duration(durationAnimation)
		.style({
			"opacity":0
		})
		.remove();

	//update
	bars.attr({
			"width": d=> xScaleBarchartBefore(d.valueBefore),
		})
		.style({
			// "fill":d=>d.color,
			"fill":d=>scaleMapChoroplethBefore(d.valueBefore),
			"fill-opacity":1
		})
	  .transition().duration(durationAnimation)
		.attr({
			"class":'barsTopK',
			"y": d=> yScaleBarchart(d.properties.name),
			"x": 0,
			"width": d=> xScaleBarchart(d.value),
			"height": yScaleBarchart.rangeBand()
		})
		.style({
			// "fill":d=>d.color,
			"fill":d=>scaleMapChoropleth(d.value),
			"fill-opacity": 1
		});

	//enter
	bars.enter().append('rect')
		.attr({
			"class":'barsTopK',
			'y': d => yScaleBarchart(d.properties.name),
			'x': 0,
			'width': 0,
			"height":yScaleBarchart.rangeBand()
		})
		.style({
			// "fill":d=>d.color,
			"fill":d=>scaleMapChoropleth(d.value),
			"fill-opacity": 1e-6,
		})
	  .transition().duration(durationAnimation)
		.attr({
				'y': d => yScaleBarchart(d.properties.name),
				'x': 0,
				'width': d => xScaleBarchart(d.value),
				"height":yScaleBarchart.rangeBand()
			})
		.style({
			// "fill":d=>d.color,
			"fill":d=>scaleMapChoropleth(d.value),
			"fill-opacity": 1
		});
		   

	//****
	//TEXT
	//****
	let barsValuesText = barchartTopK.select("#barsInBarchart")
							.selectAll(".text-values")
							.data(currData,d=>d.properties.name);
	//exit
	barsValuesText.exit()
		.style({
			"opacity":1
		})
	  .transition().duration(durationAnimation)
		.style({
			"opacity":0
		})
		.remove();

	//update
	barsValuesText.attr({
			"x": d=> xScaleBarchartBefore(d.valueBefore)
		})
		.style({
			"fill-opacity":d=>fill_opacity_value_bars(d),
			"alignment-baseline": "central"
		})
	  .transition().duration(durationAnimation)
		.attr({
			"y": d => {return yScaleBarchart(d.properties.name)+yScaleBarchart.rangeBand()/2;},
			"x": d => xScaleBarchart(d.value)
		})
		.text(d=>customNumberFormat(d.value))
		.style({
			"fill-opacity":d=>fill_opacity_value_bars(d),
			"alignment-baseline": "central"
		});

	//enter
	barsValuesText.enter().append('text')
		.attr({
			"class":"text-values",
			"y": d =>{return yScaleBarchart(d.properties.name)+yScaleBarchart.rangeBand()/2;},
			"x": 0,
			"dx":"0.2em"
		})
		.text(d=>customNumberFormat(d.value))
		.style({
			"fill-opacity":0,
			"alignment-baseline": "central"
		})
	  .transition().duration(durationAnimation)
		.attr({
			"x": d => xScaleBarchart(d.value)
		})
	  	.style({
			"fill-opacity":d=>fill_opacity_value_bars(d),
			"alignment-baseline": "central"
		});

	// ancienData = currData.filter(d=>isNaN(d.properties.name));

}



function pinRegionsOnMap() {
	
	// Build the table with the elements of the bottom hierarchy
	let currBottomHierarchy = jerarquiaOutflow.getBottomLevelNodes();
	let msgDataModal = "<table id='regiones' class='table' style=width:'100%'>";
	//adding titles
	msgDataModal = msgDataModal + "<tr><th></th><th>Region Name</th></tr>";

	for(var i = 0; i<currBottomHierarchy.length;i++){
		
		let currItem = currBottomHierarchy[i];
		let label = currItem.name;

		let activeClass = '';
		let indexInRegionesPinned = arrayRegionesPinned.indexOf(label);
		if(indexInRegionesPinned!=-1){
			//this item is Pinned
			activeClass = "active";
		}

		let pinBtn = "<button id = button_"+ i +" type='button' class='btn vis-menu-btn "+activeClass+"' title='"+ currItem.name +"' onclick='pinThis(this);'><img class='icon' src='"+ pathPin +"'/></button>";
		let line = "<tr><td id="+ i +">" + pinBtn + "</td><td>"+ label + "</td></tr>";
		msgDataModal = msgDataModal + line;
	}
	msgDataModal = msgDataModal + "</table>";
	
	// d3.select("#data-modal-title").html(titleDataModal)
	d3.select("#pinMap-data-modal-msg").html(msgDataModal);
	d3.select(this).attr("data-toggle", "modal");
	d3.select(this).attr("data-target", "#pinMap");
}

function pinThis(element){
	document.getElementById(element.id).classList.toggle("active");
}

let arrayRegionesPinned = [];

function validateFilterMap(){	
	let hijosActivos = getHijosFromPadreId("regiones","button");
	arrayRegionesPinned = hijosActivos.map(d=>d.title);

	//update the minMaxInputValue according to the pinned items
	if(arrayRegionesPinned.length>0){
		let namesOfBottomHierarchy = jerarquiaOutflow.getBottomLevelNodes().map(d=>d.name);
		let namesToFilter = [objSelectedFlowAnimation.d.category.toLowerCase()];
		namesOfBottomHierarchy.forEach(d=>{
			let indexInRegionPinned = arrayRegionesPinned.indexOf(d);
			if(indexInRegionPinned==-1){
				namesToFilter.push(d);
			}
		});

		let minMaxInputDomain= getMinMaxInputDomain(objSelectedFlowAnimation.values,namesToFilter);
		objSelectedFlowAnimation.maxInputDomain = minMaxInputDomain;
	}else{
		let minMaxInputDomain= getMinMaxInputDomain(objSelectedFlowAnimation.values,[objSelectedFlowAnimation.d.category.toLowerCase()]);
		objSelectedFlowAnimation.maxInputDomain = minMaxInputDomain;
	}


	
	
	

}