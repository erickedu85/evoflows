
var offsetType;

var pathCandadoOpen =  "./img/icon_lock_open.svg";
var pathCandadoClose = "./img/icon_lock_close.svg";
var pathPin = "./img/icon_pin.svg";

var pathAnimationPlay = "./img/icon_play.svg";
var pathAnimationPause = "./img/icon_pause.svg";
var pathAnimationPlaySpeedUp = "./img/icon_speed_up.svg";
var pathAnimationPlaySpeedDown = "./img/icon_speed_down.svg";


var candadoRight;
var candadoLeft;

var dataForEventLegend = [
	{"label":"increase","pathImg":"img/events/arrow_up.svg"},
	{"label":"decrease","pathImg":"img/events/arrow_down.svg"}
];

//USED IN MAP
var selectedDate; 
var typeOrientation; 
//

var minInputValue = 1;
var maxInputValue = 100;
var stepInputValue= 1;

var svg_multistream_vis; 
var blocage = false;
var verticalRulerTopBackground;
var verticalRulerTop;
var verticalRulerBottomBackground;
var verticalRulerBottom;

var tooltipEvents;
var tooltip;
var tooltipFlag = new Date();

//
var sDisLeft;
var sDisRight;

//
var scaleFlowLabel = d3.scale.sqrt();
var nest_by_key = d3.nest().key(function(d) {return d.key;});
var stack = d3.layout.stack()
				.values(function(d) {return d.values;})
				.x(function(d) {return d.date;})
				.y(function(d) {return d.value;})
				;


//
//
var percentageVariationIncrease = 600;
var percentageVariationDecrease = 80;
//
//				

//Keyboard funtionality
var isBrushLockLeft = false;
var isBrushLockRight = false;

function orderTest(data) {
	return d3.range(data.length);
}


//===============================================
/* MULTIRESOLUTION */
var multiresolutionTop;
var yScaleMultiresolution = d3.scale.linear();
var yAxisMultiresolution = d3.svg.axis().scale(yScaleMultiresolution)
								.tickSize(5, 0)
								.tickPadding(5)
								.ticks(5)
								.tickFormat(customNumberFormat)
								.orient("left");

var scalesMultiresolution = []; 
var axisMultiresolution = [];
var rangesDomainMultiresolution=[];
var marginMultiresolutionTop;
var heightMultiresolutionTop;
//===============================================
var multiresolutionBottom;
var yScaleMultiresolutionBottom = d3.scale.linear();
var yAxisMultiresolutionBottom = d3.svg.axis().scale(yScaleMultiresolutionBottom)
								.tickSize(5, 0)
								.tickPadding(5)
								.ticks(5)
								.tickFormat(customNumberFormat)
								.orient("left");


//===============================================
//===============================================




var heightGapFocusContext;

//===============================================
/*  CONTEXT */
// var areaContext = d3.svg.area()
// 					.x(function(d) { return xScaleContext(d.date);})
// 					.y0(function(d) {return yScaleContext(d.y0);})
// 					.y1(function(d) {return yScaleContext(d.y0 + d.y);}); 

var marginContext;
var widthIntern;
var heightContext;

var flowContext; 
var context;
var beginContext;


//1 Scales
//2 Axis

//SCALE
var yScaleContext = d3.scale.linear();
var xScaleContext = d3.time.scale(); 
var xScaleContextDisLeft = d3.time.scale(); 
var xScaleContextNorLeft = d3.time.scale();  
var xScaleContextDisRight = d3.time.scale(); 
var xScaleContextNorRight = d3.time.scale();

//AXIS
var xAxisContext = d3.svg.axis().scale(xScaleContext)
							 .tickSize(-5, 5) //inner and outer : extrems of axis
							 .tickPadding(8)
							 .ticks(5)
							 .tickFormat(customTimeFormat)
							 .orient("bottom");
							 
var yAxisContext = d3.svg.axis().scale(yScaleContext)
						.tickSize(-5, 0)
						.tickPadding(5)
						.orient("left");



//BRUSH
var brushContext = d3.svg.brush();
var brushContextDisLeft = d3.svg.brush();
var brushContextNorLeft = d3.svg.brush();
var brushContextDisRight = d3.svg.brush(); 
var brushContextNorRight = d3.svg.brush();

//To improve the responde of the app
//to just update data when there is a really change of the mouse pointer
var brushContextFlag = [];
var brushContextNorLeftFlag = [];
var brushContextNorRightFlag = [];
var brushContextDisLeftFlag = [];
var brushContextDisRightFlag = [];

//==================================================
//DATA CURRENTLY
var dataCurrentlyContextTop;
var dataCurrentlyContextBottom;
var dataCurrentlyMultiresolutionTop;
var dataCurrentlyMultiresolutionBottom;


var data_focus_level_top;
var data_context_level_top;

var data_focus_level_bottom;
var data_context_level_bottom;
//=================================================

var lockedLeft;
var lockedRight;
//
var topKCategoriesTooltip =5;

//
var isPlayAnimation;
var animationButton;
var playSpeedUp;
var playSpeedDown;
var objSelectedFlowAnimation = {};
var playSpeedRange = [100,3000]; //ms

//
var isFlowBloqued = false;

//
var isMaximumContiguousSubArrayActive = false;
var isPorcentageVariationActive = true;
//

function updateFlows(){

	//--CONTEXT---
	dataCurrentlyContextTop = stack(nest_by_key.entries(nivel_context_outflow));
	dataCurrentlyContextTop.forEach(function(node){
		var node_hierarchy = jerarquiaOutflow.getNodeByKey(node.key);
		node.key = node_hierarchy.key;
		node.category = node_hierarchy.name;
		
		if(optsMultiresolution.layersFadingColors){
			node.color = node_hierarchy.color.desaturate().brighten(layersFadingColorsFactor);
		}else{
			node.color = node_hierarchy.color;
		}
	});
	
	xScaleContext.domain(dateExtRange);

		
	context.select(".x.axis.context").call(xAxisContext);	
	
	//--MULTIRESOLUTION---
	dataCurrentlyMultiresolutionTop = stack(nest_by_key.entries(nivel_focus_outflow));//Used in Focus Local
	dataCurrentlyMultiresolutionTop.forEach(function(node){
		var node_hierarchy = jerarquiaOutflow.getNodeByKey(node.key);
		node.key = node_hierarchy.key;
		node.category = node_hierarchy.name;
		node.color =  node_hierarchy.color;
	});

	//Update Axis
	yScaleMultiresolution.domain([ 0, d3.max(nivel_context_outflow, function(d) {return d.y0 + d.y;})]);
	
	offsetType == "zero" ? multiresolutionTop.select(".y.axis.focus").style({"display":"inline"}) : multiresolutionTop.select(".y.axis.focus").style({"display":"none"});
	// offsetType == "zero" ? multiresolutionTop.select(".y.axis.label").style({"display":"inline"}) : multiresolutionTop.select(".y.axis.label").style({"display":"none"});
	
	multiresolutionTop.select(".y.axis.focus").call(yAxisMultiresolution);
	
	var flowFocusNormal = multiresolutionTop.select("#flowsInFocus").selectAll(".focus.area0") //Normal Area, 1 level
										.data(dataCurrentlyContextTop,function (d){return d.key;});
	
	//UPDATE
	flowFocusNormal.transition(t)
				.duration(durationTransition)
					.attr("d", function(d) {return areaFocus(d, 0,yScaleMultiresolution);})
					.style({
							"fill" : function(d) {return d.color;},
							"stroke" : function(d){return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : d.color;}
					});

	//CREATE
	flowFocusNormal.enter()
				.append("path")
				.attr("id", function(d){return "focus_area0_" + d.key;})
				.attr("class", function(d){return "focus area0 " + d.key;})
				.style("opacity",0)
			.transition(t)
			.duration(durationTransition)
				.attr("d", function(d) {return areaFocus(d, 0,yScaleMultiresolution);})
				.style({
						"fill" : function(d) {return d.color;},
						"stroke" : function(d){return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : d.color;},
						"opacity" : 1
				});	

	
	flowFocusNormal.exit().transition(t)
				.duration(durationTransition)
					.style("opacity", 0)
					.remove();
	
	//---FOCUS ---
	for(var index=1;index<4;index++){
		
		var flowFocusIndex = multiresolutionTop.select("#flowsInFocus").selectAll(".focus.area"+index) 
												.data(dataCurrentlyMultiresolutionTop,function (d){return d.key;});

		//UPDATE
		flowFocusIndex.transition(t)
				.duration(durationTransition)
					.attr("d", function(d) {return areaFocus(d, index,yScaleMultiresolution);})
					.style({
							"fill" : function(d) {
								switch (index) {
									case 1: return "url(#gradientLeft"+ d.values[0]["key"]+")";// Distortion area
									case 2: return "url(#gradientRight"+ d.values[0]["key"]+")";// Distortion area
									case 3: return d.color;
								}
							},
							"stroke" : function(d) {
								switch (index) {
									case 1: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : "url(#gradientLeftStroke"+ d.values[0]["key"]+")";
									case 2: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : "url(#gradientRightStroke"+ d.values[0]["key"]+")";
									case 3: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : d.color;
								}
							}
						});

		//ENTER
		flowFocusIndex.enter()
					.append("path")
					.attr("id", function(d){return "focus_area"+index+"_" + d.key;})
					.attr("class", function(d){return "focus area" +index +" "+  d.parentKey;})
					.style("opacity",0)
				.transition(t)
					.attr("d", function(d) {return areaFocus(d, index,yScaleMultiresolution);})
					.style({
							"opacity" : 1,	
							"fill" : function(d) {
								switch (index) {
									case 1: return "url(#gradientLeft"+ d.values[0]["key"]+")";// Distortion area
									case 2: return "url(#gradientRight"+ d.values[0]["key"]+")";// Distortion area
									case 3: return d.color;
								}
							},
							"stroke" : function(d) {
								switch (index) {
									case 1: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : "url(#gradientLeftStroke"+ d.values[0]["key"]+")";
									case 2: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : "url(#gradientRightStroke"+ d.values[0]["key"]+")";
									case 3: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : d.color;
								}
							}
					});				
		
		flowFocusIndex.exit()
					.transition(t)
				.duration(durationTransition)
					.style("opacity", 0)
					.remove();		
	}























	//--CONTEXT---
	dataCurrentlyContextBottom = stack(nest_by_key.entries(nivel_context_inflow));
	dataCurrentlyContextBottom.forEach(function(node){
		var node_hierarchy = jerarquiaInflow.getNodeByKey(node.key);
		node.key = node_hierarchy.key;
		node.category = node_hierarchy.name;
		
		if(optsMultiresolution.layersFadingColors){
			node.color = node_hierarchy.color.desaturate().brighten(layersFadingColorsFactor);
		}else{
			node.color = node_hierarchy.color;
		}
	});




	//-----------------------------------
	//--MULTIRESOLUTION---
	dataCurrentlyMultiresolutionBottom = stack(nest_by_key.entries(nivel_focus_inflow));//Used in Focus Local
	dataCurrentlyMultiresolutionBottom.forEach(function(node){
		var node_hierarchy = jerarquiaInflow.getNodeByKey(node.key);
		node.key = node_hierarchy.key;
		node.category = node_hierarchy.name;
		node.color =  node_hierarchy.color;
	});

	//Update Axis
	yScaleMultiresolutionBottom.domain([ 0, d3.max(nivel_context_inflow, function(d) {return d.y0 + d.y;})]);
	offsetType == "zero" ? multiresolutionBottom.select(".y.axis.focus").style({"display":"inline"}) : multiresolutionBottom.select(".y.axis.focus").style({"display":"none"});
	// offsetType == "zero" ? multiresolutionBottom.select(".y.axis.label").style({"display":"inline"}) : multiresolutionBottom.select(".y.axis.label").style({"display":"none"});

	multiresolutionBottom.select(".y.axis.focus").call(yAxisMultiresolutionBottom);

	let flowFocusNormalBottom = multiresolutionBottom.select("#flowsInFocus").selectAll(".focus.area0") //Normal Area, 1 level
	//let flowFocusNormalBottom = multiresolutionBottom.select("#flowsInFocus-bottom").selectAll(".focus.area0") //Normal Area, 1 level
										.data(dataCurrentlyContextBottom,function (d){return d.key;});

	//UPDATE
	flowFocusNormalBottom.transition(t)
				.duration(durationTransition)
					.attr("d", function(d) {return areaFocus(d, 0,yScaleMultiresolutionBottom);})
					.style({
							"fill" : function(d) {return d.color;},
							"stroke" : function(d){return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : d.color;}
					});

	//CREATE
	flowFocusNormalBottom.enter()
				.append("path")
				.attr("id", function(d){return "focus_area0_" + d.key;})
				.attr("class", function(d){return "focus area0 " + d.key;})
				.style("opacity",0)
			.transition(t)
			.duration(durationTransition)
				.attr("d", function(d) {return areaFocus(d, 0,yScaleMultiresolutionBottom);})
				.style({
						"fill" : function(d) {return d.color;},
						"stroke" : function(d){return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : d.color;},
						"opacity" : 1
				});	


	flowFocusNormalBottom.exit().transition(t)
				.duration(durationTransition)
					.style("opacity", 0)
					.remove();


	//---FOCUS ---
	for(let indexBottom=1;indexBottom<4;indexBottom++){
			
		let flowFocusIndexBottom = multiresolutionBottom.select("#flowsInFocus").selectAll(".focus.area"+indexBottom) 
												.data(dataCurrentlyMultiresolutionBottom,function (d){return d.key;});

		//UPDATE
		flowFocusIndexBottom.transition(t)
				.duration(durationTransition)
					.attr("d", function(d) {return areaFocus(d, indexBottom,yScaleMultiresolutionBottom);})
					.style({
							"fill" : function(d) {
								switch (indexBottom) {
									case 1: return "url(#gradientLeft"+ d.values[0]["key"]+")";// Distortion area
									case 2: return "url(#gradientRight"+ d.values[0]["key"]+")";// Distortion area
									case 3: return d.color;
								}
							},
							"stroke" : function(d) {
								switch (indexBottom) {
									case 1: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : "url(#gradientLeftStroke"+ d.values[0]["key"]+")";
									case 2: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : "url(#gradientRightStroke"+ d.values[0]["key"]+")";
									case 3: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : d.color;
								}
							}
						});

		//ENTER
		flowFocusIndexBottom.enter()
					.append("path")
					.attr("id", function(d){return "focus_area"+indexBottom+"_" + d.key;})
					.attr("class", function(d){return "focus area" +indexBottom +" "+  d.parentKey;})
					.style("opacity",0)
				.transition(t)
					.attr("d", function(d) {return areaFocus(d, indexBottom,yScaleMultiresolutionBottom);})
					.style({
							"opacity" : 1,	
							"fill" : function(d) {
								switch (indexBottom) {
									case 1: return "url(#gradientLeft"+ d.values[0]["key"]+")";// Distortion area
									case 2: return "url(#gradientRight"+ d.values[0]["key"]+")";// Distortion area
									case 3: return d.color;
								}
							},
							"stroke" : function(d) {
								switch (indexBottom) {
									case 1: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : "url(#gradientLeftStroke"+ d.values[0]["key"]+")";
									case 2: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : "url(#gradientRightStroke"+ d.values[0]["key"]+")";
									case 3: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : d.color;
								}
							}
					});				
		
		flowFocusIndexBottom.exit()
					.transition(t)
				.duration(durationTransition)
					.style("opacity", 0)
					.remove();		
	}
































	
	createTooltip();
	execAlgosInZoomArea();
}

function beforeExport(){
	focus.select("#linksProjetions").selectAll("rect")
										.style({
											"display":"none",
											"stroke-width":0
										});

	svg_tree_vis.selectAll("text").call(wrap, 250);
	svg_tree_vis.selectAll("text").style("text-transform","capitalize");
}


function updateOpts(){
	
	lockedLeft = optsContext.blockedBrushNormalLeft;
	lockedRight = optsContext.blockedBrushNormalRight;

	updateOffsetType(optsMultistream.offsetType);
}


function addKeyboardFunctionality(){

	document.onkeydown = (e)=>{

		let stampTemporal = 1; //same time-step for left and right
		let moving=false;


		if(e.keyCode==27){//Esc
			releaseFlowClick();
		}

		//where is the pointer selected
		//     ___|c|focus_area|v|____
		if (e.keyCode == 67){ //C
			isBrushLockRight = true;
		}else if(e.keyCode == 86){ //V
			isBrushLockLeft = true;
		}
		
		//(e.keyCode == 27){ //Esc
		//(e.keyCode == 17){ //Ctrl
		//(e.keyCode == 16){ //Shift

		switch(e.keyCode){
			case 39: // -->
				moving=true;
				break;
			case 37: // <--
				stampTemporal = -stampTemporal;
				moving=true;
				break;
		}

		if(moving){
			let currLeftTimeStep = brushContext.extent()[0];
			let newTimeExtentLeft = isBrushLockLeft? currLeftTimeStep : getNewTimeStep(currLeftTimeStep,stampTemporal);
			
			let currRightTimeStep = brushContext.extent()[1];
			let newTimeExtentRight = isBrushLockRight? currRightTimeStep : getNewTimeStep(currRightTimeStep,stampTemporal);
		
			brushContextMove([newTimeExtentLeft,newTimeExtentRight]);
			brushEnd();
		}




	};

	document.onkeyup = (e)=>{
		if (e.keyCode == 67){ //C
			isBrushLockRight = false;
		}
		if (e.keyCode == 86){ //V
			isBrushLockLeft = false;
		}
	};

}


function loadMultiresolutionVis(){

	//
	updateOpts();

	//create svg main and axes
	createSvg(); 
	
	//
	display(); 

	//addKeyboardFunctionality
	addKeyboardFunctionality();

	
	d3.select("#close-alert").on("click",function(d){
		document.getElementById("alert-msg").classList.toggle("hidden");
	});
	
	d3.select("#svg-export").on("click",function() {
		beforeExport();
		var num_svg = [0,1]; //num_svg to download
		svgExport(fileName, num_svg);
	});
	
	d3.select("#time").on("mouseup", function() {
		console.log(+this.value);
		stepTemporal = +this.value;
		changeGranularity();
	});
	d3.select("#animation").on("change", function() {
		animation = document.getElementById("animation").checked;
	});
	
	d3.select("#outline-layers").on("change", function() {
		optsMultiresolution.layersShowBorderline = document.getElementById("outline-layers").checked;
		
		for(var index=0;index<4;index++){
			focus.select("#flowsInFocus").selectAll(".focus.area" + index) 
						.style({
								"stroke" : function(d) {
									switch (index) {
										case 0: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : d.color;
										case 1: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : "url(#gradientLeftStroke"+ d.values[0]["key"]+")";
										case 2: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : "url(#gradientRightStroke"+ d.values[0]["key"]+")";
										case 3: return optsMultiresolution.layersShowBorderline ? layersBorderlineColor : d.color;
									}
								}
						});
		}		
	});
	
	d3.select("#fading-colors").on("change", function() {
		optsMultiresolution.layersFadingColors = document.getElementById("fading-colors").checked;
		callUpdate();
	});
	d3.select("#limit-ranges").on("change", function() {
		optsMultiresolution.showLimitsAreas = document.getElementById("limit-ranges").checked;
		
		var visibleLimitRanges;
		if(optsMultiresolution.showLimitsAreas){
			visibleLimitRanges = "visible";
		}else{
			visibleLimitRanges = "hidden";
		}
		
		focus.select(".focusNorRight").style({"visibility": visibleLimitRanges});
		focus.select(".focusNorLeft").style({"visibility": visibleLimitRanges});
		focus.select(".focusDisRight").style({"visibility": visibleLimitRanges});
		focus.select(".focusDisLeft").style({"visibility": visibleLimitRanges});
		focus.select(".focusZoom").style({"visibility": visibleLimitRanges});
		
	});
	

	//
	//
	//PORCENTAGE
	//
	//
	d3.select("#porcentageVariationIncrease").attr({
		"min":100,
		"max":100000,
		"step":100,
		"value":percentageVariationIncrease
	});
	//
	//
	d3.select("#porcentageVariationDecrease").attr({
		"min":10,
		"max":1000,
		"step":10,
		"value":percentageVariationDecrease
	});
	//
	//

	d3.select("#porcentageVariationIncrease").on("input", function() {
		percentageVariationIncrease = +this.value;

		isPorcentageVariationActive = true;
		isMaximumContiguousSubArrayActive = false;

		execAlgosInZoomArea();
	});

	d3.select("#porcentageVariationDecrease").on("input", function() {
		percentageVariationDecrease = +this.value;

		isPorcentageVariationActive = true;
		isMaximumContiguousSubArrayActive = false;

		execAlgosInZoomArea();
	});

	d3.select("#btnMCS").on("click", function() {
		
		isPorcentageVariationActive = false;
		isMaximumContiguousSubArrayActive = true;

		execAlgosInZoomArea();
	});

	//
	//
	//ALPHA
	//
	//
	d3.select("#alpha").attr({
							"min":minInputValue,
							"max":maxInputValue,
							"step":stepInputValue,
							"value":optsMultistream.facteurZoom
						});
	
	
	d3.select("#alpha").on("input", function() {
		var calcule = calculateRangeFocus(optsMultistream.facteurNor, optsMultistream.facteurDis, +this.value);
		if (calcule != null) {
			optsMultistream.facteurZoom = +this.value;
			beginValidation();
		}else{
			backContext();
			if(document.getElementById("alert-msg").classList.contains("hidden")){
				document.getElementById("alert-msg").classList.toggle("hidden");
			}
		}
		updateFocus(calcule);
	});
	d3.select("#alpha").on("mouseover", function() {
		brushZoomOver();
	});
	d3.select("#alpha").on("mouseout", function() {
		brushOutAll();
	});
	
	//
	//BETA
	//
	d3.select("#beta").attr({
							"min":minInputValue,
							"max":maxInputValue,
							"step":stepInputValue,
							"value":optsMultistream.facteurDis
						});
	
	d3.select("#beta").on("input", function() {
		var calcule = calculateRangeFocus(optsMultistream.facteurNor, +this.value,  optsMultistream.facteurZoom);
		if (calcule != null) {
			optsMultistream.facteurDis = +this.value;
			beginValidation();
		}else{
			backContext();
			if(document.getElementById("alert-msg").classList.contains("hidden")){
				document.getElementById("alert-msg").classList.toggle("hidden");
			}
		}
		updateFocus(calcule);
	});
	d3.select("#beta").on("mouseover", function() {
		brushDisLeftOver();
		brushDisRightOver();
	});
	d3.select("#beta").on("mouseout", function() {
		brushOutAll();
	});
	//
	//
	//GAMMA
	//
	d3.select("#gamma").attr({
							"min":minInputValue,
							"max":maxInputValue,
							"step":stepInputValue,
							"value":optsMultistream.facteurNor
						});
	
	d3.select("#gamma").on("input", function() {
		var calcule = calculateRangeFocus(+this.value, optsMultistream.facteurDis, optsMultistream.facteurZoom);
		if (calcule != null) {
			optsMultistream.facteurNor = +this.value;
			beginValidation();
			
		}else{
			backContext();
			if(document.getElementById("alert-msg").classList.contains("hidden")){
				document.getElementById("alert-msg").classList.toggle("hidden");
			}
		}
		updateFocus(calcule);
	});
	d3.select("#gamma").on("mouseover", function() {
		brushNorLeftOver();
		brushNorRightOver();
	});
	d3.select("#gamma").on("mouseout", function() {
		brushOutAll();
	});
	//
	$("#multistream-offsetType :input").change(function() {
		offsetType = this.value;
		stack.offset(offsetType);
		updateFlows();
	});
	


	d3.select("#candadoLeft").on("click",function(d){
		document.getElementById("candadoLeft").classList.toggle("consin");		
		if(document.getElementById("candadoLeft").classList.contains("consin")){
			d3.select("#candadoLeft").attr('xlink:href',pathCandadoClose);
			lockedLeft = true;
		}else{
			d3.select("#candadoLeft").attr('xlink:href',pathCandadoOpen);
			lockedLeft = false;
		}
	});

	d3.select("#candadoRight").on("click",function(d){
		document.getElementById("candadoRight").classList.toggle("consin");		
		if(document.getElementById("candadoRight").classList.contains("consin")){
			d3.select("#candadoRight").attr('xlink:href',pathCandadoClose);
			lockedRight = true;
		}else{
			d3.select("#candadoRight").attr('xlink:href',pathCandadoOpen);
			lockedRight = false;
		}
	});

	
	d3.select("#animationButton").on("click",function(d){
		document.getElementById("animationButton").classList.toggle("consin");
		if(document.getElementById("animationButton").classList.contains("consin")){
			//IS PLAYING....
			animationButton.attr('xlink:href',pathAnimationPause); //set the PAUSE Icon
			isPlayAnimation = true;
			playAnimation(objSelectedFlowAnimation.d,objSelectedFlowAnimation.orientation);
		}else{
			//IS PAUSE
			animationButton.attr('xlink:href',pathAnimationPlay); //set the Play Icon
			isPlayAnimation = false;
			setVisibleButtonSpeed(false);
		}
	});


	d3.select('#playSpeedUp').on('click',function(d){
		let facteur = 0.2;
		let newDurationTransitionTS = durationTransitionTS - (durationTransitionTS*facteur);
		if(newDurationTransitionTS>=playSpeedRange[0] && newDurationTransitionTS <=playSpeedRange[1]){
			durationTransitionTS = newDurationTransitionTS;
			durationTransitionMap = durationTransitionMap - (durationTransitionMap*facteur);
		}
	});

	d3.select('#playSpeedDown').on('click',function(d){
		let facteur = 0.2;
		let newDurationTransitionTS = durationTransitionTS + (durationTransitionTS*facteur);
		if(newDurationTransitionTS>=playSpeedRange[0] && newDurationTransitionTS <=playSpeedRange[1]){
			durationTransitionTS = newDurationTransitionTS;
			durationTransitionMap = durationTransitionMap + (durationTransitionMap*facteur);
		}
	});

	if(!optsContext.showContext){
		context.style({
			"opacity":0,
			"display":"none"
		});
	}
	
	setMainTitleVisVisibility(false);
	
	let calcule = calculateRangeFocus(optsMultistream.facteurNor, optsMultistream.facteurDis, optsMultistream.facteurZoom);
	totalito(calcule);
	
}

function createSvg(){
	// screen.availHeight
	
	let multiresolutionHeighProportion;
	let contextHeightProportion;
	
	if (windowsHeight >= 1440){
		multiresolutionHeighProportion = 0.42
		contextHeightProportion = 0.13
	}else if (windowsHeight >= 1080 ){
		multiresolutionHeighProportion = 0.42
		contextHeightProportion = 0.13
	} else{
		multiresolutionHeighProportion = 0.4;
		contextHeightProportion = 0.15;
	}



	//multiresolution top
	var alturaMultiresolutionTop = multistreamVisHeight*multiresolutionHeighProportion;
	//multiresolution bottom
	var alturaMultiresolutionBottom = multistreamVisHeight*multiresolutionHeighProportion;
	//context
	var alturaContext = multistreamVisHeight*contextHeightProportion;




	/* Creation margin Focus */
	marginMultiresolutionTop = {top : 20, right : 20, bottom : 20, left : 120};
	heightMultiresolutionTop = (alturaMultiresolutionTop) - marginMultiresolutionTop.top - marginMultiresolutionTop.bottom;

	marginMultiresolutionBottom = {top : alturaMultiresolutionTop + 20, right : 20, bottom : 20, left : 120};
	heightMultiresolutionBottom = (alturaMultiresolutionBottom) - 20 - 20;

	/* Creation margin Context */
	marginContext = {top : alturaMultiresolutionTop + alturaMultiresolutionBottom + 25, right :  20, bottom : 20, left : 120};
	heightContext = alturaContext - 20 - 20;
	heightGapFocusContext = 45;
	widthIntern = multistreamVisWidth - marginMultiresolutionTop.left - marginMultiresolutionTop.right;
	
	/* SVG */
	svg_multistream_vis = d3.select("body").select("#svg-multistream-vis")
						.attr("xmlns","http://www.w3.org/2000/svg")
						.attr("xlink","http://www.w3.org/1999/xlink")
						.attr("svg","http://www.w3.org/2000/svg")
						.attr("version","1")
						.attr("width",multistreamVisWidth)
						.attr("height", multistreamVisHeight);

	svg_multistream_vis.attr('viewBox', '0 0 ' +  ( multistreamVisWidth) + ' '  + ( multistreamVisHeight) )
							.attr('height', multistreamVisHeight)
							.attr('width', '100%')
							.attr('preserveAspectRatio', 'none');
	
	
	/* MULTIRESOLUTION */
	multiresolutionTop = svg_multistream_vis.append("g")
				.attr("id","focus")
				.attr("class", "focus")
				.attr("transform","translate(" + (marginMultiresolutionTop.left) + "," + marginMultiresolutionTop.top + ")");

	multiresolutionTop.append("text")
			.attr("class", "y axis label legend title1")
			.attr("x",0 - heightMultiresolutionTop / 2)
			.attr("y", -marginMultiresolutionTop.left)
			.attr("dy","1.3em")	
			.attr("transform", "rotate(-90)")
			.text(legend_y_outflow);

	multiresolutionTop.append("text")
			.attr("class", "y axis label sublegend")
			.attr("x",0 - heightMultiresolutionTop / 2)
			.attr("y", -marginMultiresolutionBottom.left)
			.attr("dy","5.2em")
			.attr("transform", "rotate(-90)")
			.text(sub_legend_y_outflow);
		

	multiresolutionTop.append("rect")
			.attr("id","multiresolutionBackground")
			.attr("class", "background")
			.attr("width", widthIntern)
			.attr("height",heightMultiresolutionTop);

	yScaleMultiresolution.range([ heightMultiresolutionTop, 0 ]);			

								
	multiresolutionTop.append("g").attr("id","x_grid_focus");

	multiresolutionTop.append("g").attr("id","x_axis_focus");

	createGradientArrays(key_focus_list_outflow);

	multiresolutionTop.append("g").attr("id","flowsInFocus");

	multiresolutionTop.append("g")
								.attr("class", "y axis focus")
								.attr("transform","translate(0,0)");

	//CREATE THE LINK LINKS PROJETIONS GROUP
	//multiresolutionTop.append("g").attr("id","linksProjetions");
	
	//CREATE THE POINTCHANGES GROUP
	multiresolutionTop.append("g").attr("id","gPointChanges");

	//TEXT LABELS GROUP
	multiresolutionTop.append("g").attr("id","textsLabels");





	//----------------------------------------------------
	//----------------------------------------------------
	//----------------------------------------------------		
	multiresolutionBottom = svg_multistream_vis.append("g")
		.attr("id","focus-bottom")
		.attr("class", "focus")
		.attr("transform","translate(" + (marginMultiresolutionBottom.left) + "," + marginMultiresolutionBottom.top + ")");

	multiresolutionBottom.append("text")
		.attr("class", "y axis label legend title1")
		.attr("x",0 - heightMultiresolutionBottom / 2)
		.attr("y", -marginMultiresolutionBottom.left)
		.attr("dy","1.3em")
		.attr("transform", "rotate(-90)")
		.text(leyend_y_inflow);

	multiresolutionBottom.append("text")
		.attr("class", "y axis label sublegend")
		.attr("x",0 - heightMultiresolutionBottom / 2)
		.attr("y", -marginMultiresolutionBottom.left)
		.attr("dy","5.2em")
		.attr("transform", "rotate(-90)")
		.text(sub_leyend_y_inflow);

		

	multiresolutionBottom.append("rect")
		.attr("id","multiresolutionBackground-bottom")
		.attr("class", "background")
		.attr("width", widthIntern)
		.attr("height",heightMultiresolutionBottom);

	yScaleMultiresolutionBottom.range([ heightMultiresolutionBottom, 0 ]);	


	multiresolutionBottom.append("g").attr("id","x_grid_focus-bottom");

	multiresolutionBottom.append("g").attr("id","x_axis_focus-bottom");

	multiresolutionBottom.append("g").attr("id","flowsInFocus");

	multiresolutionBottom.append("g")
								.attr("class", "y axis focus")
								.attr("transform","translate(0,0)");

	//CREATE THE LINK LINKS PROJETIONS GROUP
	multiresolutionBottom.append("g").attr("id","linksProjetions");

	//CREATE THE POINTCHANGES GROUP
	multiresolutionBottom.append("g").attr("id","gPointChanges");

	//TEXT LABELS GROUP
	multiresolutionBottom.append("g").attr("id","textsLabels");

	//-------------------------------------------------------------
	//-------------------------------------------------------------
	//-------------------------------------------------------------




	/* Context */
	context = svg_multistream_vis.append("g")
					.attr("id","context")
					.attr("class", "context")
					.attr("transform","translate(" + marginContext.left + "," +( marginContext.top) + ")")
					.style({
						"background-color":"grey"
					});

	context.append("rect")
				.attr("id","contextBackground")
				.attr("class", "background")
				.attr("width", widthIntern)
				.attr("height",heightContext);

	context.append("text")
			.attr("class","x axis label")
			.attr("transform","translate(" + (widthIntern/2) + " ," + (heightContext+20) + ")")
			.text("");


	//CREATE PLAY BUTTON ANIMATION
	let animationButtonSize = 40;
	animationButton = context.append("image")
								.attr({
									"id":"animationButton",
									"class":"consin", //to init in play state
									"xlink:href": pathAnimationPlay,
									"x": -80,
									"y": heightContext/2-animationButtonSize/2,
									// "width": animationButtonSize,
									// "height": animationButtonSize
								})
								.style({
									"cursor":"hand",
									"display":"none"
								});



	let playSpeedButtonSize = 17;
	playSpeedUp = context.append("image")
							.attr({
								"id":"playSpeedUp",
								// "class":"consin", //to init in play state
								"xlink:href": pathAnimationPlaySpeedUp,
								"x": -45,
								"y": heightContext/2-playSpeedButtonSize/2+animationButtonSize/2,
								"width": playSpeedButtonSize,
								"height": playSpeedButtonSize
							})
							.style({
								"cursor":"hand",
								"display":"none"
							});

	playSpeedDown = context.append("image")
							.attr({
								"id":"playSpeedDown",
								// "class":"consin", //to init in play state
								"xlink:href": pathAnimationPlaySpeedDown,
								"x": -45 - animationButtonSize-playSpeedButtonSize/2,
								"y": heightContext/2-playSpeedButtonSize/2+animationButtonSize/2,
								"width": playSpeedButtonSize,
								"height": playSpeedButtonSize
							})
							.style({
								"cursor":"hand",
								"display":"none"
							});							



	context.append("g").attr("id","flowsInContext");			

	xScaleContext.range([ 0, widthIntern ]);
	yScaleContext.range([ heightContext, 0 ]);

	context.append("g")
					.attr("class", "x axis context")
					.attr("transform","translate(0," + heightContext/2 + ")");


	createBrushInContext();

	createGroupForContextBrushes();

	InitBarPositionBrushInContext();

	/* ToolTip */
	tooltip = d3.select("body").append("div")
							.attr("id","tooltipFlow")
							.attr("class", "tooltip tooltip-multiresolution")
							.style({
								"opacity":0,
								"display":"none"
							});

	// tooltip.on("mouseover",()=>{
	// 	console.log("over tooltip");
	// });

	tooltipEvents = d3.select("body").append("div")
											.attr("class", "tooltip tooltip-multiresolution")
											.style({
												"opacity":0,
												"display":"none"
											});

	verticalRulerTopBackground = multiresolutionTop.append("line").attr("class","vertical-ruler-background");
	verticalRulerTop = multiresolutionTop.append("line")
												.attr("class","vertical-ruler");											

	verticalRulerBottomBackground = multiresolutionBottom.append("line").attr("class","vertical-ruler-background");
	verticalRulerBottom = multiresolutionBottom.append("line")
												.attr("class","vertical-ruler");											
	


	if(isMobileDevice()){
		document.getElementById("multistream-offsetType").style.display = "none";
	}


	createEventLegend();												

}

function createEventLegend(){

	let symbolPxSize = 15;
	let verticalGapEntries = 10;
	let numEntries = dataForEventLegend.length;
	let legendMargin= {top:10,left:10,bottom:10};
	let legendHeight = numEntries * symbolPxSize + (numEntries+1)*verticalGapEntries;
	let legend_wrapper_height = legendHeight + legendMargin.top + legendMargin.bottom;
	let legend_wrapper_width = 90;

	let yPositionLegendEntry = d3.scale.ordinal()
							.domain(dataForEventLegend.map(d=>d.label))
							.rangePoints([verticalGapEntries+symbolPxSize/2, legendHeight-(verticalGapEntries+symbolPxSize/2)]);

	
	let gWrapperLegend = multiresolutionTop.append("g")
					.attr("class","legend")
					.attr("transform","translate("+ 10 +","+ 10 + ")");
	
	gWrapperLegend.append("rect")
			.attr("class",'background')
			.attr("rx",8)
			.attr("ry",8)
			.attr("width",legend_wrapper_width)
			.attr("height",legend_wrapper_height);
	
	let gLegend = gWrapperLegend.append("g")
							.attr("transform","translate("+legendMargin.left+","+legendMargin.top+")");

	let legend_items = gLegend.selectAll(".legendEntry").data(dataForEventLegend,d=>d.label);
		
	let legendEntry = legend_items.enter().append("g")
						.attr("class","legendEntry");
			
	legendEntry.append("image")
			.attr("class","symbol")
			.attr("xlink:href",d=>{return d.pathImg;})
			.attr("width", symbolPxSize)
			.attr("height", symbolPxSize)
			.attr("x",0)
			.attr("y",d=>{return yPositionLegendEntry(d.label)-symbolPxSize/2;});
			

	legendEntry.append("text")
			.attr("class","text")
			.attr("x",(symbolPxSize+5))
			.attr("y",d=>yPositionLegendEntry(d.label))
			.text(d=>d.label)
			.style({
				"alignment-baseline":"central" //only for text
			});


}

// function timeout() {
// 	setTimeout(function () {
// 		// Do Something Here
// 		// Then recall the parent function to
// 		// create a recursive loop.
// 		llamame();
// 		timeout();
// 	}, 100);
// }


function display() {

	let calcule = calculateRangeFocus(optsMultistream.facteurNor, optsMultistream.facteurDis, optsMultistream.facteurZoom);
	rangesDomainMultiresolution = nest_by_key.entries(calcule);
	createScalesAxisFocus(rangesDomainMultiresolution);

	updateFlows();

	InitBarPositionBrushInContext();

	updateRectanglesAndLinksInFocus();// Rectangles BORDERS
	
	//execAlgosInZoomArea();
	
	beginValidation();//To set the values at begging
}

function updateMainTitle (data, fromDate, toDate){
	
	let joinData = data.filter(d=>d.date>=fromDate && d.date<=toDate);
	let sumValue = getAgregatedValue(joinData);
	
}

function rankArray(arrayCurr, arrayCompare){

	arrayCurr.forEach((d,indexCurr)=>{
		let indexCompare = arrayCompare.map(c=>c.key).indexOf(d.key);	
		let pathImgRank = "img/ranking/";
		let rank = "";
		//new//up//down//equal
		if(indexCompare==-1){
			rank = "new";
		}else if(indexCurr==indexCompare){
			rank = "equal";
		}else if(indexCurr<indexCompare){
			rank="up";
		}else {
			rank="down";
		}
		d.rank = rank;
		d.rankPath = pathImgRank+rank+".png";
	});

	return arrayCurr;
	
}

function getWhereIsPointer(date){
	if(brushContextNorLeft.extent()[0] <= date && date <=brushContextNorLeft.extent()[1]){
		return "NL";
	}else if(brushContextDisLeft.extent()[0] < date && date <= brushContextDisLeft.extent()[1]){
		return "FL";
	}else if(brushContext.extent()[0] <= date && date <= brushContext.extent()[1]){
		return "Z";
	}else if(brushContextDisRight.extent()[0] <= date && date < brushContextDisRight.extent()[1]){
		return "FR";
	}else{
		return "NR";
	}
}

function getDataByIndex(theData, index){
	let dataInIndex = [];
	theData.forEach(function(d){
		let currData = d.values[index];
		dataInIndex.push(currData);
	});
	return dataInIndex;
}


function getSubSetOfData(theData, sinceDate, untilDate, categoryKey){
	
	let result = [];
	let maxDateLim = getTimeOffset(dateMaxRange, -2, polarityTemporal);
	if(untilDate > maxDateLim){
		untilDate = maxDateLim;
	}


	//to get only the data from a specific KEY
	if(categoryKey!=null){
		theData = theData.filter(d=>d.key==categoryKey);
	}

	theData.forEach(function(element){
		
		//add the color property to the all values for an element
		element.values.forEach(d=>{d.color = element.color;});
		let filterValues = element.values.filter(obj=>{return (obj.date>=sinceDate && obj.date<=untilDate );});

		result.push({
			"key":element.key,
			"color":element.color,
			"category":element.category,
			"values":filterValues
		});
	});
	return result;
}


function getEventsByCategory(category){
		return events.filter((d)=>{return d.category==category});
}

function getPointChanges(dataInZoomArea,multiresolutionType,yScale,dataType){
	
	// console.log(dataInZoomArea)
	
	let aryPointDetection = [];
	dataInZoomArea.forEach(function(layerInZoom){

		// DataPoint comes from?
		let dataPointDetection;
		// % Variation 
		if(isPorcentageVariationActive){
			dataPointDetection = getPointAnomalyByPercentage(layerInZoom.values,percentageVariationIncrease,percentageVariationDecrease);
		}else if(isMaximumContiguousSubArrayActive){
			// or MCS
			dataPointDetection = getLargestSubarray(layerInZoom.values);
		}

		layerInZoom.values.forEach(function(element){
			
			var currMatchPointDetection = dataPointDetection.filter(d=>{return d.date == element.date;});
			if(currMatchPointDetection.length==1){
				let nuevoElemento = {
					"category":element.category,
					"date":element.date,
					"key":element.key,
					"value":element.value,
					"y":element.y,
					"y0":element.y0,
					"relationRelative":currMatchPointDetection[0].relationRelative,
					"pathImg":currMatchPointDetection[0].relationRelative == 1 ? dataForEventLegend.find(d=>d.label==='increase').pathImg:dataForEventLegend.find(d=>d.label==='decrease').pathImg,
					"dataType":dataType
				};
				aryPointDetection.push(nuevoElemento);
			}
		});
	});

	pointEventDetections.push(aryPointDetection);

	let points = multiresolutionType.select("#gPointChanges").selectAll(".point-detection")
					.data(aryPointDetection,function(d){return (d.key+"-"+d.date);});
	
	let durationAnima = 1;

	//exit
	points.exit()
		.style({
			"opacity":1
		})
	.transition().duration(durationAnima)
		.style({
			"opacity":0
		}).remove();

	//update
	points.attr("x", function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date)-getPxFromRem(eventWidthSizeLabelScale/2); })
			.attr("y", function(d) {return yScale(d.y0 + d.value/2)-getPxFromRem(eventHeightSizeLabelScale/2); });				

	//enter
	points.enter().append("a")
					.attr("target","_blank")
					.attr("xlink:href", function(d){
						let queryText = "what+happened+in+" + d.category + "+in+" + d.date.getFullYear();
						return "https://www.google.com/search?q=" + queryText;})
			.append("image")
					.attr("class","point-detection")
					.attr("x", function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date)-getPxFromRem(eventWidthSizeLabelScale/2); })
					.attr("y", function(d) {return yScale(d.y0 + d.value/2)-getPxFromRem(eventHeightSizeLabelScale/2); })
					.attr("xlink:href",d=>{return d.pathImg;})
					.attr("width",getPxFromRem(eventWidthSizeLabelScale))
					.attr("height",getPxFromRem(eventHeightSizeLabelScale))
					.style({
						"pointer-events":"none",
						"opacity":0
					})
					.on("mouseover",pointChangeMouseOver)
				.transition().duration(durationAnima)
					.style({
						"opacity":1
					});


}



function pointChangeMouseOver(d){

	let first_line = "<p class='title'>" + customTimeFormatTitle(d.date)  + "</p>";
	let second_line = "<p class='info'>" + d.who+ ": " + "<span class='value'>" + d.what + "</span></p>";
	
	// https://developers.google.com/youtube/player_parameters
	//"<iframe src='https://en.wikipedia.org/wiki/Beyoncé></iframe>"
	// <iframe id='myFrame' src='https://www.youtube.com/embed/gd_zSH0dFZg?&autoplay=1&controls=0&start=50' allow='autoplay'></iframe>
	//&start=50&end=60&loop=1
	let testEmbeddingContent = "<iframe id='myFrame' src='https://www.youtube.com/embed/n0my6NmWN5g?&autoplay=1&controls=0"+ "&start="+d.media +"' allow='autoplay'></iframe>";
	let txt = first_line + second_line + testEmbeddingContent;
	let tooltipTopPosition = -290;
	showToolTipEvents(txt,tooltipTopPosition);
}


///

function getFlowLabelWithoutOverlapping(data){
	let datesForTextLabel = []; 
	
	data.forEach(function(element){
		
		const max = element.values.reduce(function(prev, current) {
		    return (prev.value > current.value) ? prev : current;
		},{});
		datesForTextLabel.push(max);
	});
	
	//Ordering descending this array to get the maximun and minimun
	datesForTextLabel.sort(function(a,b){return a.value-b.value;});
	// console.log(datesForTextLabel)
	
	const minValueTextLabel = 0; //datesForTextLabel[0].valueNormal;
	const maxValueTextLabel = datesForTextLabel[datesForTextLabel.length-1].value;
	
	//Scale to get the HEIGHT of the text 
	scaleFlowLabel.clamp(true)
					.domain([minValueTextLabel, maxValueTextLabel])
					.range(layersOutputRangeLabelScale);
		
	datesForTextLabel.forEach(function(element){
		element.category = getCapitalize(element.category);
		var value = element.value;
		var objectWidth;
		switch(layersLabelType){
			case "flowLabelText":
				let font = scaleFlowLabel(value).toString().concat("rem ").concat(text_font_family);
				objectWidth = getTextWidthInPx(element.category,font);
				break;
			case 'flowLabelImg':
				objectWidth = getPxFromRem(scaleFlowLabel(value));// scaleFlowLabel(value); // getTextWidth(element.category,font);
				break;
		}

		var objectHeight = getPxFromRem(scaleFlowLabel(value));
		var objectWidthMiddle = objectWidth/2;
		var objectHeightMiddle = objectHeight/2;
		
		var x1 = scalesMultiresolution[selectAxisFocus(element.date)](element.date)-objectWidthMiddle;
		var y1 = yScaleMultiresolutionBottom(element.y0 + element.value/2 )-objectHeightMiddle;
		var x2 = (x1+objectWidth);
		var y2 = (y1+objectHeight);
		
		element.keyOverlap = element.category;
		element.coordinates = {"x1":x1,"y1":y1,"x2":x2,"y2":y2};
		element.overlaping = false;
	});

	return removeOverlapping(datesForTextLabel);
}


function flowTextLabel(flowWithoutOverlapping,multiresolutionType,yScale){
	let flowLabel = multiresolutionType.select("#textsLabels").selectAll(".textLabel")
										.data(flowWithoutOverlapping,function (d){return d.key;});

	//exit
	flowLabel.exit()
				.remove();

	//update
	flowLabel
			.attr("x", function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date); })
			.attr("y", function(d) {return yScale(d.y0 + d.value/2 ); })
			.style({
				"font-size":function(d) {return scaleFlowLabel(d.value) + "rem";},
		});
		
	//enter
	flowLabel.enter().append("text")
					.attr("class",function(d){return "subtitle1 textLabel" + " " + d.parentKey + " " +d.key;})
					.attr("x", function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date); })
					.attr("y", function(d) {return yScale(d.y0 + d.value/2); }) 
					// .attr("x", function(d) {console.log("aqui"); return 10; })
					// .attr("y", function(d) {return 20; }) 
					.attr("dy",".35em")
					.text(function(d) {return d.category;})
					.style({
							"opacity":1,
							"font-size":function(d) {return scaleFlowLabel(d.value) + "rem";},
							"font-family":text_font_family,
							"text-anchor":"middle",
							"pointer-events": "none",
					});	
					
					
	
	
	// //To create RECTANGLES around the text label 
	
	
	// var rectangleLabel = multiresolution.select("#textsLabels").selectAll(".rect")
	// 			.data(flowWithoutOverlapping,function (d){return d.key;});

	// //update
	// rectangleLabel
	// 			//.style({"opacity":0})	
	// 			.attr("x",function(d){return d.coordinates.x1;})
	// 			.attr("y",function(d){return d.coordinates.y1;})
	// 			.attr("width",(function(d){return d.coordinates.x2-d.coordinates.x1;}))
	// 			.attr("height",(function(d){return d.coordinates.y2-d.coordinates.y1;}))
	// 			.text(function(d) {return d.name;})
	// 			.style({
	// 					"display":"inline",
	// 					"fill":"none",
	// 					"stroke":"black"
	// 			})
	
	// //enter RECTANGLE
	// rectangleLabel.enter().append("rect")
	// 					.attr("class",function(d){return "rect" + " " + d.parentKey + " " +d.key;})
	// 					.attr("x",function(d){return d.coordinates.x1;})
	// 					.attr("y",function(d){return d.coordinates.y1;})
	// 					.attr("width",(function(d){return d.coordinates.x2-d.coordinates.x1;}))
	// 					.attr("height",(function(d){return d.coordinates.y2-d.coordinates.y1;}))
	// 					.style({
	// 						"display":"inline",
	// 						"fill":"none",
	// 						"stroke":"black"
	// 						})
	
	// //exit
	// rectangleLabel.exit()
	// 			.style("opacity",0)
	// 			// .transition()
	// 			// .duration(transitionDuration)
	// 			.style("opacity",0)
	// 			.remove();

}

function flowImgLabel(flowWithoutOverlapping){
	let flowLabel = multiresolutionTop.select("#textsLabels").selectAll(".textLabel")
										.data(flowWithoutOverlapping,function (d){return d.key;});
	
	//exit
	flowLabel.exit()
				.remove();

	//update
	flowLabel
			.attr("x", function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date) - getPxFromRem(scaleFlowLabel(d.value)/2); })
			.attr("y", function(d) {return yScaleMultiresolution(d.y0 + d.value/2) - getPxFromRem(scaleFlowLabel(d.value)/2); }) 
			.attr("width",function(d){return getPxFromRem(scaleFlowLabel(d.value));})
			.attr("height",function(d){return getPxFromRem(scaleFlowLabel(d.value));});

	//enter
	flowLabel.enter().append("image")
				.attr("class",function(d){return "textLabel" + " " + d.parentKey + " " +d.key;})
				.attr("x", function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date) - getPxFromRem(scaleFlowLabel(d.value)/2); })
				.attr("y", function(d) {return yScaleMultiresolution(d.y0 + d.value/2) - getPxFromRem(scaleFlowLabel(d.value)/2); }) 
				.attr("xlink:href",d=>{return d.img;})
				.attr("width",function(d){return getPxFromRem(scaleFlowLabel(d.value));})
				.attr("height",function(d){return getPxFromRem(scaleFlowLabel(d.value));})
				.style({
						"opacity":1,
						"text-anchor":"middle",
						"pointer-events": "none",
				});




//
	//
	//To create RECTANGLES around the text label 
	//
	//
	
	// var rectangleLabel = multiresolution.select("#textsLabels").selectAll(".rect")
	// 			.data(flowWithoutOverlapping,function (d){return d.key;});

	// //update
	// rectangleLabel
	// 			//.style({"opacity":0})	
	// 			.attr("x",function(d){return d.coordinates.x1;})
	// 			.attr("y",function(d){return d.coordinates.y1;})
	// 			.attr("width",(function(d){return d.coordinates.x2-d.coordinates.x1;}))
	// 			.attr("height",(function(d){return d.coordinates.y2-d.coordinates.y1;}))
	// 			.text(function(d) {return d.name;})
	// 			.style({
	// 					"display":"inline",
	// 					"fill":"none",
	// 					"stroke":"black"
	// 			})
	
	// //enter RECTANGLE
	// rectangleLabel.enter().append("rect")
	// 					.attr("class",function(d){return "rect" + " " + d.parentKey + " " +d.key;})
	// 					.attr("x",function(d){return d.coordinates.x1;})
	// 					.attr("y",function(d){return d.coordinates.y1;})
	// 					.attr("width",(function(d){return d.coordinates.x2-d.coordinates.x1;}))
	// 					.attr("height",(function(d){return d.coordinates.y2-d.coordinates.y1;}))
	// 					.style({
	// 						"display":"inline",
	// 						"fill":"none",
	// 						"stroke":"black"
	// 						})
	
	// //exit
	// rectangleLabel.exit()
	// 			.style("opacity",0)
	// 			// .transition()
	// 			// .duration(transitionDuration)
	// 			.style("opacity",0)
	// 			.remove();

}

var dataInZoomAreaDestino = [];

function execAlgosInZoomArea(){

	//get the focusArea data
	let dataInFocusTop = [];
	if(dataCurrentlyMultiresolutionTop==null){
		dataInFocusTop = data_focus_level_top;
	}else{
		dataInFocusTop = dataCurrentlyMultiresolutionTop;
	}
	let dataInZoomAreaOrigin = getSubSetOfData(dataInFocusTop, brushContext.extent()[0],brushContext.extent()[1]);	
	//and pass to the algos
	//flow labels
	flowLabel(dataInZoomAreaOrigin,multiresolutionTop,yScaleMultiresolution);

	let dataInFocusBottom = [];
	if(dataCurrentlyMultiresolutionBottom==null){
		dataInFocusBottom = data_focus_level_bottom;
	}else{
		dataInFocusBottom = dataCurrentlyMultiresolutionBottom;
	}

	dataInZoomAreaDestino = getSubSetOfData(dataInFocusBottom, brushContext.extent()[0],brushContext.extent()[1]);
	

	//flow labels
	flowLabel(dataInZoomAreaDestino,multiresolutionBottom,yScaleMultiresolutionBottom);


	// //point detections
	pointEventDetections = [];
	getPointChanges(dataInZoomAreaOrigin,multiresolutionTop,yScaleMultiresolution,"outflow");
	getPointChanges(dataInZoomAreaDestino,multiresolutionBottom,yScaleMultiresolutionBottom,"inflow");
}

function flowLabel(dataInZoomArea,multiresolutionType,yScale){

	let flowWithoutOverlapping = getFlowLabelWithoutOverlapping(dataInZoomArea);

	switch(layersLabelType){
		case "flowLabelText":
			flowTextLabel(flowWithoutOverlapping,multiresolutionType,yScale);
			break;
		case 'flowLabelImg':
			flowImgLabel(flowWithoutOverlapping);
			break;
	}
}

function ratonOverFlow(selectedFlow,multi){

	multi.select("#flowsInFocus").selectAll(".focus") 	
					.style({
							"fill-opacity":function(d){
								return (selectedFlow.key == d.key || selectedFlow.key == getFatherKey(d.key) ) ? layersOpacitySelected : layersOpacityNotSelected;
							},
							"stroke-opacity":function(d){
								return (selectedFlow.key == d.key || selectedFlow.key == getFatherKey(d.key) ) ? layersOpacitySelected : 0;
							}
					});	

	multi.select("#textsLabels").selectAll(".textLabel")
				.style({
					"opacity":function(d){
						return (selectedFlow.key == d.key || selectedFlow.key == getFatherKey(d.key) ) ? layersOpacitySelected : layersOpacityNotSelected;
					},
					"font-weight":function(d){
						return (selectedFlow.key == d.key || selectedFlow.key == getFatherKey(d.key) ) ? "bold" : "normal";
					}
				});

	multi.select("#gPointChanges").selectAll(".point-detection")
				.style({
					"opacity":function(d){	
						return (selectedFlow.key == d.key || selectedFlow.key == getFatherKey(d.key) ) ? layersOpacitySelected : layersOpacityNotSelected;
					}
				});

}

function ratonOutFlow(multi){
	ratonOutMultiresolutionView();
	setFullOpacityInCurrMulti(multi);

	//MAP behaivor
	clearFeaturesFromLayerMap();
	landLabel();
	setMainTitleVisVisibility(false);
	setMapBarchartVisibility(false);
	setMapLegendVisibility(false);
}

function ratonClickFlow(mouseX,d,orientation){
	//INIT THE OBJSELECTEDFLOWANIMATION

	document.getElementById("animationButton").classList.remove("consin");

	animationButton.style({
		"display":isFlowBloqued?"inline":"none",
	});

	durationTransitionTS = 1000;

	if(isFlowBloqued){
		
		//
		// GET THE MAX INPUT DOMAIN IN THE FOCUS AREA TIME WINDOW
		//
		// Filtering the focus data between dates
		let sinceDate = brushContextDisLeft.extent()[0];
		let untilDate = brushContextDisRight.extent()[1];
		let selectedValuesByDates = d.values.filter(obj=>{return (obj.date>=sinceDate && obj.date<=untilDate);});

		// Calcule 
		let minMaxInputDomain= getMinMaxInputDomain(selectedValuesByDates,[d.category.toLowerCase()]);
	
		let dateSelected = timeTooltip(scalesMultiresolution[selectScaleFocusPixel(mouseX)].invert(mouseX),mouseX); //invert: get the domain, return range and viceversa
		objSelectedFlowAnimation = {
			"d":d,
			"values":selectedValuesByDates,
			"dateSelected":dateSelected,
			"orientation":orientation,
			"maxInputDomain":minMaxInputDomain
		};
	}

}


function getMinMaxInputDomain(selectedValuesByDates, namesToFilter){
	let arrayResultValues = [];
	selectedValuesByDates.forEach(function(aCategory){
		//Get the hierarchy attributes of components 
		let arrayComponents = getComponentsOfCategory(aCategory);
		//Unified level according to the hierarchy
		let unifiedComponents = getUnifiedLevel(jerarquiaOutflow.getBottomLevelNodes(),arrayComponents);
		//Filtering the selected category from the array
		let componentsSansSelectedCategory = unifiedComponents.filter(function(aComponent){
			let indexInNamesToFilter = namesToFilter.indexOf(aComponent.name.toLowerCase());
			if(indexInNamesToFilter==-1){
				return aComponent;
			}
		});
		//adding to the result array
		componentsSansSelectedCategory.forEach(d=>{
			arrayResultValues.push({"value":d.value});
		});
	});

	let minInputDomainValue = 1;
	//apply is a convenient way to pass an array to Math.max
	let maxInputDomainValue = Math.max.apply(null,arrayResultValues.map(d=>d.value));

	return [minInputDomainValue,maxInputDomainValue];
}


function setFullOpacityInCurrMulti(multi){
	
	tooltipFlag = new Date();
	
	multi.select("#flowsInFocus").selectAll(".focus") 	
						.style({
								"fill-opacity" : 1,
								"stroke-opacity" : 1
						});	
								
	multi.select("#textsLabels").selectAll(".textLabel")
						.style({
							"opacity":1,
							"font-weight":"normal"
						});

	multi.select("#gPointChanges").selectAll(".point-detection")
						.style({
							"opacity":1 
						});
	
}


function getCountryFromGeoJson(theCountry){
	theCountry = theCountry.toLowerCase();
	return geoJson.features.filter(d=>d.properties.name == theCountry)[0];
}



function getFatherFromList(child, fatherList,callback){
	let theFather = null;
	fatherList.forEach(function(aPapa){
		isBDownOfA(aPapa,child,function(result){
			if(result){
				// theFather = aPapa;
				// console.log(aPapa)
				theFather = {
					"id":aPapa.id,
					"key":aPapa.key,
					"name":aPapa.name,
					"centroid": aPapa.centroid,
					"coordinates": aPapa.coordinates,
					"geometry": aPapa.geometry,
					"overlaping": aPapa.overlaping,
					"properties": aPapa.properties,
					"refCenterPoint": aPapa.refCenterPoint,
					"type": aPapa.type
				};

				// centroid: (2) [408.13286802302616, 379.9046499039466]
				// children: (17) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
				// color: Color {_rgb: Array(4)}
				// coordinates: {x1: 373.84385129939335, y1: 374.3046499039466, x2: 442.421884746659, y2: 385.5046499039466}
				// depth: 2
				// geometry: {type: "MultiPolygon", coordinates: Array(9)}
				// id: 196
				// key: "R0_4_1"
				// level: "bottom"
				// name: "eastern africa"
				// overlaping: false
				// parent: {name: "africa", children: Array(5), parent: {…}, depth: 1, x: 1090, …}
				// properties: {name: "eastern africa", STATE: "africa"}
				// refCenterPoint: (2) [408.13286802302616, 379.9046499039466]
				// type: "Feature"
				// value: 139510
				// visible: true
				// x: 680
				// x0: 680
				// y: 220
				// y0: 220

			}
		});
	});
	callback(theFather);
}

function getUnifiedLevel(currLevelOfHierarchy, components){

	let resultado = [];

	components.forEach(component=>{

		getFatherFromList(component,currLevelOfHierarchy,(theFather)=>{

				if(theFather!=null){

					let indexFather = resultado.map(d=>d.name).indexOf(theFather.name);

					if(indexFather===-1){
						let countryFatherGeoJson = getCountryFromGeoJson(theFather.name);
						theFather.centroid = countryFatherGeoJson.centroid;
						theFather.coordinates = countryFatherGeoJson.coordinates;
						theFather.geometry = countryFatherGeoJson.geometry;
						theFather.overlaping = countryFatherGeoJson.overlaping;
						theFather.properties = countryFatherGeoJson.properties;
						theFather.refCenterPoint = countryFatherGeoJson.refCenterPoint;
						theFather.type = countryFatherGeoJson.type;
						theFather.value = component.value;

						resultado.push(theFather);
					}else{
						let val = resultado[indexFather].value;
						resultado[indexFather].value = val + component.value;
					}

				}else
				{
					let indexComponent = resultado.map(d=>d.name).indexOf(component.name);
					let countryComponentGeoJson = getCountryFromGeoJson(component.name);

					component.centroid = countryComponentGeoJson.centroid;
					component.coordinates = countryComponentGeoJson.coordinates;
					component.geometry = countryComponentGeoJson.geometry;
					component.overlaping = countryComponentGeoJson.overlaping;
					component.properties = countryComponentGeoJson.properties;
					component.refCenterPoint = countryComponentGeoJson.refCenterPoint;
					component.type = countryComponentGeoJson.type;

					if(indexComponent===-1){
						resultado.push(component);
					}
				}
		});
	});

	return resultado;

}



function getComponentsOfCategory(theCategory){
	let arrayComponents = theCategory.components.filter(d=>d.arraray[0]>0).map(d=>{
		let aComponent = jerarquiaOutflow.getNodeByName(d.name);
		aComponent.value =  d.arraray[0];
		return aComponent;
	});
	return arrayComponents;
}



function flowByDateSelected(d,dateSelected,orientation,durationAnimation){
	
	let mouseSelectedDateIndex = timeWindow.map(Number).indexOf(+dateSelected); //To get the index of the date in array
	
	//If date existe in the array
	if(mouseSelectedDateIndex!=-1 && (dateSelected.getTime() != tooltipFlag.getTime())){

		let selectedCategory = d.values[mouseSelectedDateIndex];
		
		//points for vertical ruler
		let x1 = scalesMultiresolution[selectAxisFocus(dateSelected)](dateSelected); 
		let y1 = orientation==="out"?yScaleMultiresolution(selectedCategory.y0):yScaleMultiresolutionBottom(selectedCategory.y0);
		let x2 = scalesMultiresolution[selectAxisFocus(dateSelected)](dateSelected);  
		let y2 = orientation==="out"?yScaleMultiresolution(selectedCategory.y0 + selectedCategory.y):yScaleMultiresolutionBottom(selectedCategory.y0 + selectedCategory.y);
	
		showVerticalRuler(x1,y1,x2,y2,orientation);

//		showToolTipMultiresolution(customTimeFormatTitle(dateSelected),"","",[selectedCategory],false,"Click to PIN this flow",dataType_outflow,d3.event.pageX ,d3.event.pageY);
		
		let dataType = orientation==="out"?dataType_outflow:dataType_inflow;
		
		updateMainTitleVis(dateSelected,selectedCategory,dataType);
		


		//Adding geoJson attr in the selectedCategory
		let selectedCategoryInGeoJson = getCountryFromGeoJson(selectedCategory.category);
		selectedCategory.centroid = selectedCategoryInGeoJson.centroid;
		selectedCategory.properties = selectedCategoryInGeoJson.properties;
		selectedCategory.type = selectedCategoryInGeoJson.type;
		selectedCategory.geometry = selectedCategoryInGeoJson.geometry;

		//destinations/origins regions
		let arrayComponents = getComponentsOfCategory(selectedCategory);

		let components = getUnifiedLevel(jerarquiaOutflow.getBottomLevelNodes(),arrayComponents);

		//filter the SelectedCategory from Dest
		//
		let namesToFilter = [selectedCategory.category.toLowerCase()];

		let namesOfBottomHierarchy = jerarquiaOutflow.getBottomLevelNodes().map(d=>d.name);

		
		if(arrayRegionesPinned.length>0){
			namesOfBottomHierarchy.forEach(d=>{
				let indexInRegionPinned = arrayRegionesPinned.indexOf(d);
				if(indexInRegionPinned==-1){
					namesToFilter.push(d);
				}
			});

		}


		let componentSansSelectedCategory = getComponentsWithoutNamesToFilter(components,namesToFilter);

		coloring(selectedCategory,componentSansSelectedCategory,orientation,durationAnimation);		

		// d3.select("#multiresolutionBackground").attr("class","backgroundHighlight");						
		// d3.select("#multiresolutionBackground-bottom").attr("class","backgroundHighlight");

		tooltipFlag = dateSelected;
	}
}

//Get the components list without the namesToFilter
function getComponentsWithoutNamesToFilter(components, namesToFilter){
	let componentsSansNamesFiltered = components.filter(function(d){
		let indexInNamesToFilter = namesToFilter.indexOf(d.name.toLowerCase());
		if(indexInNamesToFilter==-1){
			return d;
		}
	});

	return componentsSansNamesFiltered;
}


function getMaxValueOfFlowByTimeWindow(d,sinceDate,untilDate){

	let filterValuesByDates = d.values.filter(obj=>{return (obj.date>=sinceDate && obj.date<=untilDate);}).map(val=>val.value);
	
	let elMax = Math.max.apply(null,filterValuesByDates);

	console.log(d.category,elMax)

	return elMax;

}



function setVisibleButtonSpeed(visible){
	playSpeedUp.style({
		"display":visible?"inline":"none",
		
	});
	playSpeedDown.style({
		"display":visible?"inline":"none",
		
	});
}

async function playAnimation(d,orientation) {
	while(isPlayAnimation){
		setVisibleButtonSpeed(true);
		objSelectedFlowAnimation.dateSelected = getTimeOffset(objSelectedFlowAnimation.dateSelected, stepTemporal, polarityTemporal);

		if(objSelectedFlowAnimation.dateSelected.getTime()>brushContextDisRight.extent()[1].getTime()){
			objSelectedFlowAnimation.dateSelected = brushContextDisLeft.extent()[0];
		}
		await sleep(d,objSelectedFlowAnimation.dateSelected,orientation,durationTransitionTS);
	}
}

function sleep(d,fecha,orientation,sleepMs) {
	flowByDateSelected(d,fecha,orientation,durationTransitionMap);
	return new Promise(resolve => setTimeout(resolve,sleepMs));
}

function releaseFlowClick(){
	isFlowBloqued = false;
	animationButton.style({
		"display":"none"
	});
	setVisibleButtonSpeed(false);
	isPlayAnimation = false;

	//
	isLockedXAxisBarChart = false;
	document.getElementById("candadoXAxis").classList.remove("consin");
	candadoXAxis.attr('xlink:href',pathCandadoOpen);
	//

	document.getElementById("animationButton").classList.remove("consin");
	animationButton.attr('xlink:href',pathAnimationPlay); //set the Play Icon
	ratonOutFlow(multiresolutionTop);
	ratonOutFlow(multiresolutionBottom);
}

function createTooltip(){
	
	multiresolutionTop.select("#multiresolutionBackground")
					.on("mousemove",function(d){
						if(!isFlowBloqued){			
							mousex = d3.mouse(this);
							mousex = mousex[0];// + 5;
							let dateSelected = timeTooltip(scalesMultiresolution[selectScaleFocusPixel(mousex)].invert(mousex),mousex); //invert: get the domain, return range and viceversa
							var mouseDateIndex = timeWindow.map(Number).indexOf(+dateSelected); //To get the index of the date in array
							
							if(mouseDateIndex!=-1 && (dateSelected.getTime() != tooltipFlag.getTime())){
								
								if((getWhereIsPointer(dateSelected) === "Z" || getWhereIsPointer(dateSelected) === "FL" || getWhereIsPointer(dateSelected) === "FR") ){

									let dataInFocusTop = [];
									if(dataCurrentlyMultiresolutionTop==null){
										dataInFocusTop = data_focus_level_top;
									}else{
										dataInFocusTop = dataCurrentlyMultiresolutionTop;
									}
									
									
									let focusTimeWindow = getTimeWindow(brushContextDisLeft.extent()[0],brushContextDisRight.extent()[1],polarityTemporal,stepTemporal);
									let dataInFocus = getSubSetOfData(dataInFocusTop,focusTimeWindow[0], focusTimeWindow[focusTimeWindow.length-1]);
									
									//From all the layer in the Focus area, get only the timelapse where the mouse is over/before
									let mouseIndexInFocusWindows = focusTimeWindow.map(Number).indexOf(+dateSelected);
									let dataOverMouse = getDataByIndex(dataInFocus, mouseIndexInFocusWindows);
									let dataBeforeOverMouse = getDataByIndex(dataInFocus, (mouseIndexInFocusWindows-1));

									//order descending
									dataOverMouse.sort(function(a,b){return b.value-a.value;});
									dataBeforeOverMouse.sort(function(a,b){return b.value-a.value;});
	
									//getting topK elements
									let categoriesArray = getTopKFromArray(topKCategoriesTooltip,dataOverMouse);
									let categoriesBeforeArray = getTopKFromArray(topKCategoriesTooltip,dataBeforeOverMouse);
	
									//ranking the categoriesArray
									rankArray(categoriesArray,categoriesBeforeArray);
	
									let x1 = scalesMultiresolution[selectAxisFocus(dateSelected)](dateSelected);  
									let y1 = 0;
									let x2 = scalesMultiresolution[selectAxisFocus(dateSelected)](dateSelected);  
									let y2 = heightMultiresolutionTop;
	
									showVerticalRuler(x1,y1,x2,y2,"out");
									showToolTipMultiresolution(customTimeFormatTitle(dateSelected),"","",categoriesArray,true,"",dataType_outflow,d3.event.pageX ,d3.event.pageY);

									tooltipFlag = dateSelected;
								}else{
									ratonOutMultiresolutionView();
								}
							}
						}
					})	
					.on("mouseout",function(d){
						if(!isFlowBloqued){
							ratonOutMultiresolutionView();
						}
					})
					.on("click",function(d){
						isFlowBloqued = false;
						releaseFlowClick();
					});

					
	multiresolutionTop.select("#flowsInFocus").selectAll(".focus")
			.on("mouseover",d=>{
				if(!isFlowBloqued){
					ratonOverFlow(d,multiresolutionTop);
				}
			})
			.on("mousemove",function(d, i) {
				if(!isFlowBloqued){
					let mouseX = d3.mouse(this)[0];
					let dateSelected = timeTooltip(scalesMultiresolution[selectScaleFocusPixel(mouseX)].invert(mouseX),mouseX); //invert: get the domain, return range and viceversa
					if(getWhereIsPointer(dateSelected) === "Z" || getWhereIsPointer(dateSelected) === "FL" || getWhereIsPointer(dateSelected) === "FR"){
						flowByDateSelected(d,dateSelected,"out",0);
					}
				}
			})
			.on("mouseout", function() {
				if(!isFlowBloqued){
					ratonOutFlow(multiresolutionTop);
				}
			})
			.on('contextmenu', function(d){
				// updateGraphComparision(d);
				 //stop showing browser menu
				// d3.event.preventDefault();
			})
			.on("click",function(d){
				isFlowBloqued = !isFlowBloqued;
				let mouseX = d3.mouse(this)[0];

				if(isFlowBloqued){
					ratonClickFlow(mouseX,d,"out");
				}else{
					releaseFlowClick();
				}
			});


//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------

multiresolutionBottom.select("#multiresolutionBackground-bottom")
				.on("mousemove",function(d){
					if(!isFlowBloqued){			
						mousex = d3.mouse(this);
						mousex = mousex[0];// + 5;
						let dateSelected = timeTooltip(scalesMultiresolution[selectScaleFocusPixel(mousex)].invert(mousex),mousex); //invert: get the domain, return range and viceversa
						var mouseDateIndex = timeWindow.map(Number).indexOf(+dateSelected); //To get the index of the date in array
						
						//If date existe in the array
						if(mouseDateIndex!=-1 && (dateSelected.getTime() != tooltipFlag.getTime())){

							if((getWhereIsPointer(dateSelected) === "Z" || getWhereIsPointer(dateSelected) === "FL" || getWhereIsPointer(dateSelected) === "FR") ){

								let dataInFocusBottom = [];
								if(dataCurrentlyMultiresolutionBottom==null){
									dataInFocusBottom = data_focus_level_bottom;
								}else{
									dataInFocusBottom = dataCurrentlyMultiresolutionBottom;
								}

								let focusTimeWindow = getTimeWindow(brushContextDisLeft.extent()[0],brushContextDisRight.extent()[1],polarityTemporal,stepTemporal);
								let dataInFocus = getSubSetOfData(dataInFocusBottom,focusTimeWindow[0], focusTimeWindow[focusTimeWindow.length-1]);
								
								//From all the layer in the Focus area, get only the timelapse where the mouse is over/before
								let mouseIndexInFocusWindows = focusTimeWindow.map(Number).indexOf(+dateSelected);
								let dataOverMouse = getDataByIndex(dataInFocus, mouseIndexInFocusWindows);
								let dataBeforeOverMouse = getDataByIndex(dataInFocus, (mouseIndexInFocusWindows-1));

								//order descending
								dataOverMouse.sort(function(a,b){return b.value-a.value;});
								dataBeforeOverMouse.sort(function(a,b){return b.value-a.value;});

								//getting topK elements
								let categoriesArray = getTopKFromArray(topKCategoriesTooltip,dataOverMouse);
								let categoriesBeforeArray = getTopKFromArray(topKCategoriesTooltip,dataBeforeOverMouse);

								//ranking the categoriesArray
								rankArray(categoriesArray,categoriesBeforeArray);

							
								let x1 = scalesMultiresolution[selectAxisFocus(dateSelected)](dateSelected);  
								let y1 = 0;
								let x2 = scalesMultiresolution[selectAxisFocus(dateSelected)](dateSelected);  
								let y2 = heightMultiresolutionBottom;


								showVerticalRuler(x1,y1,x2,y2,"in");
								showToolTipMultiresolution(customTimeFormatTitle(dateSelected),"","",categoriesArray,true,"",dataType_inflow,d3.event.pageX ,d3.event.pageY);
								// clearFeaturesLayerMap();
								tooltipFlag = dateSelected;
							}else{
								ratonOutMultiresolutionView();
							}
						}	
					}
				})

				.on("mouseout",function(d){
					if(!isFlowBloqued){
						ratonOutMultiresolutionView();
					}
				})
				.on("click",function(d){

					isFlowBloqued = false;

					releaseFlowClick();
				});



	multiresolutionBottom.select("#flowsInFocus").selectAll(".focus")
				.on("mouseover",d=>{
					if(!isFlowBloqued){
						ratonOverFlow(d,multiresolutionBottom);
					}
				})
				.on("mousemove",function(d, i) {
					if(!isFlowBloqued){
						let mouseX = d3.mouse(this)[0];
						let dateSelected = timeTooltip(scalesMultiresolution[selectScaleFocusPixel(mouseX)].invert(mouseX),mouseX); //invert: get the domain, return range and viceversa
						if(getWhereIsPointer(dateSelected) === "Z" || getWhereIsPointer(dateSelected) === "FL" || getWhereIsPointer(dateSelected) === "FR"){
							flowByDateSelected(d,dateSelected,"in",0);
						}
					}
				})
				.on("mouseout", ()=> {
					if(!isFlowBloqued){
						ratonOutFlow(multiresolutionBottom);
					}
				})
				.on('contextmenu', ()=>{
					console.log("click right;");
				} )
				.on("click",function(d){
					isFlowBloqued = !isFlowBloqued;
					let mouseX = d3.mouse(this)[0];

					if(isFlowBloqued){
						ratonClickFlow(mouseX,d,"in");
					}else{
						releaseFlowClick();
					}

				});
}


function showDataModal(titleModal,subtitle1Modal, subtitle2Modal, dataModal, footnoteModal){

	let title_line = "<h6>" + titleModal + "</h6>"+"<div><span class='subtitle1'>" + subtitle1Modal  + ": </span><span class='subtitle1 quantitative'>"+ subtitle2Modal +" </span><span class='caption'>" +  dataType + "</span></div>";
	let subtitle1_line = "";
	let subtitle2_line = "";

	let data_lines = "<table class='tableText' style=width:100%>";
	for(let i = 0; i<dataModal.length;i++){

		let currText = dataModal[i].text;
		let currLink = dataModal[i].link;

		var splt = currText.split(" ");
		var string_search = "";
		for(var s=0;s<splt.length;s++){
			if(s==0){
				string_search = splt[0];
			}else{
				string_search = string_search + "+" + splt[s];
			}
		}
		// var line = "<tr><td> <a href=\"https://www.google.com/search?q=" + string_search + "\" target=\"_blank\" </a>" +  textsArraySelected[i] +  "</td></tr>";
		let currLinkSelected = (typeof currLink != 'undefined')?currLink:"https://www.google.com/search?q=" + string_search;
		var line = "<tr><td class='body2'> <a href=\"" +  currLinkSelected + "\" target=\"_blank\" </a>" +  currText +  "</td></tr>";
		//-------------------
		data_lines = data_lines + line;
	}
	data_lines = data_lines + "</table>";

	let footnote_line="";

	d3.select("#data-modal-title").html(title_line);
	d3.select("#data-modal-msg").html(data_lines);
}

function showToolTipEvents(htmlText, tooltipTopPosition){
	tooltipEvents.style({
		"opacity":1,
		"display":"inline"
	});

	tooltipEvents.html(htmlText).style({
		"left":(getTooltipLeftPosition()+ 10) + "px",
		"top":(d3.event.pageY + tooltipTopPosition) + "px"
	});
}

function showVerticalRuler(x1,y1,x2,y2,orientation){
	
	let currVerticalRuler = orientation==="out"? verticalRulerTop : verticalRulerBottom;
	let currVerticalRulerBackground = orientation==="out"? verticalRulerTopBackground : verticalRulerBottomBackground;

	let attributs = {
		"x1":x1+"px",
		"y1":y1+"px",
		"x2":x2+"px",
		"y2":y2+"px",
	};

	let styles = {
		"opacity": 1,
		"display":"inline"
	};

	currVerticalRulerBackground.attr(attributs)
							.style(styles);

	currVerticalRuler.attr(attributs)
				.style(styles);
}


function showToolTipMultiresolution(title,subtitle1, subtitle2,categoriesArray,showRanking,footnote,dataOrientation,leftPositionTooltip,topPositionTooltip){

	let title_line = "<h6>" + title  + "</h6>";
	let subtitle1_line = "<p class='subtitle1'>" + subtitle1  + "</p>";
	let subtitle2_line = "<p class='caption'>" + subtitle2  + "</p>";
	let categories_lines = "";

	for(let i=0;i<categoriesArray.length;i++){
		let currVal = categoriesArray[i];

		let htmlRank ="";
		if(showRanking && typeof currVal.rankPath !='undefined'){
			htmlRank = "<img class='category-rank-img' src='"+ currVal.rankPath +"'>";
		}
		let htmlColor = "<div class='category-color-wrapper' style='background-color:"+ currVal.color + ";'></div>";
		let htmlCategory = "<div class='category-wrapper subtitle2'>" + getCapitalize(currVal.category) + ":&nbsp;"+"</div>";
		let htmlValue = "<div class='value-wrapper'>"+
							" <span class='quantitative-value subtitle2'>" + customNumberFormat(currVal.value) + "</span> "+
							"<span class='overline'>" + dataType +" " + dataOrientation +  "</span>"+
						"</div>";

		categories_lines = categories_lines + 
					"<div class='category-entry-wrapper'>"+
						htmlRank+
						htmlColor+
						htmlCategory+
						htmlValue+
					"</div>";
	}
	
	let footnote_line = "<p class='caption foot'>" + footnote  + "</p>";
	let htmlText = title_line + subtitle1_line+subtitle2_line+categories_lines+footnote_line;

	tooltip.style({
		"opacity":1,
		"display":"inline"
	});

	tooltip.html(htmlText)
		.style("left",leftPositionTooltip + "px")
		.style("top",topPositionTooltip + "px");
}

function getTooltipLeftPosition(){
	let left_position;
	let with_tooltip = $("#tooltipFlow").width();
	if((d3.event.pageX + with_tooltip) >= multistreamVisWidth){
		left_position = d3.event.pageX - with_tooltip - 35; 
	}else{
		left_position = d3.event.pageX; 
	}
	return left_position;
}


function updateMainTitleVis(timePeriod,selectedCategory,dataTypeOrientation){

	setMainTitleVisVisibility(true);

	let quantitative  = selectedCategory.value;
	let category = selectedCategory.category;
	// let date_title = jsCapitalize(category) + "-"+customTimeFormatTitle(timePeriod);
	let date_title = customTimeFormatTitle(timePeriod);
	document.getElementById("date-title").innerHTML = date_title;
	document.getElementById("quantitative-value").innerHTML = customNumberFormat(quantitative);
	document.getElementById("label-value").innerHTML = dataType + " " + "<u>"+dataTypeOrientation+"</u>" +"<br><b>"+jsCapitalize(category)+"</b>";

	selectedDate = timePeriod;
	typeOrientation = dataTypeOrientation;
}

function setMainTitleVisVisibility(visibility){

	document.getElementById("msg-title-wrapper").style.opacity = visibility?1:0;

}


function createGroupForContextBrushes() {
	/**
	 * CONTEXT CREATE BRUSHES
	 */
	var heighBrushContext = heightContext - 2;
//	var widthBrush = 3;
	
	if(optsContext.showBrushNormal){

		context.append("g")
				.attr("class", "brushNorRight")
				.call(brushContextNorRight)
				.selectAll("rect")
					.attr("y", 1)
					.attr('height',heighBrushContext)
					.on("mouseover", brushNorRightOver)
					.on("mouseout", brushOutAll);
			
		context.append("g")
				.attr("class", "brushNorLeft")
				.call(brushContextNorLeft)
				.selectAll("rect")
					.attr("y", 1)
					.attr('height', heighBrushContext)
					.on("mouseover", brushNorLeftOver)
					.on("mouseout", brushOutAll);

	}
	
	if(optsContext.showBrushDistortion){
	
		context.append("g")
				.attr("class", "brushDisLeft")
				.call(brushContextDisLeft)
				.selectAll("rect")
					.attr("y", 1)
					.attr('height', heighBrushContext)
					.on("mouseover", brushDisLeftOver)
					.on("mouseout", brushOutAll);
		
		context.append("g")
				.attr("class", "brushDisRight")
				.call(brushContextDisRight)
				.selectAll("rect")
					.attr("y", 1)
					.attr('height',heighBrushContext)
					.on("mouseover", brushDisRightOver)
					.on("mouseout", brushOutAll);

	}
	
	context.append("g")
			.attr("class", "brushZoom")
			.call(brushContext)
			.selectAll("rect")
				.attr("y", 1)
				.attr('height', heighBrushContext)
				.on("mouseover", brushZoomOver)
				.on("mouseout", brushOutAll)
				
				

	if(optsContext.blockedBrushZoom){
		d3.selectAll(".brushZoom").selectAll(".resize")
									.selectAll("rect")
									.style({
										"pointer-events":"none"
									});
	}				



	context.select(".brushNorLeft .resize.w").selectAll("rect")
	.style("visibility","visible");

	context.select(".brushNorLeft .resize.e").selectAll("rect")
		.style("display","none");

	/*  */
	context.select(".brushDisLeft .resize.w").selectAll("rect")
		.style("visibility","visible")
		;

	context.select(".brushDisLeft .resize.e").selectAll("rect")
		.style("display","none");

	/*  */
	context.select(".brushDisRight .resize.w").selectAll("rect")
		.style("display","none");

	context.select(".brushDisRight .resize.e").selectAll("rect")
		.style("visibility","visible")
		;

	/*  */
	context.select(".brushNorRight .resize.w").selectAll("rect")
		.style("display","none");
		
	context.select(".brushNorRight .resize.e").selectAll("rect")
		.style("visibility","visible")
		;


	/*  */
	context.select(".brushZoom .resize.w").selectAll("rect")
		.style("visibility","visible");

	context.select(".brushZoom .resize.e").selectAll("rect")
		.style("visibility","visible");



}

function brushOutAll(){
	brushZoomOut();
	brushDisLeftOut();
	brushDisRightOut();
	brushNorRightOut();
	brushNorLeftOut();
}



//
function brushZoomOver() {
	if(!optsMultiresolution.showLimitsAreas){
		if(blocage){
			brushOutAll();
		}else{
			multiresolutionTop.select(".focusZoom")
				.style({
					"visibility": "visible"
				});
		}
	}
}
//
function brushZoomOut() {
	if(!optsMultiresolution.showLimitsAreas){
		multiresolutionTop.select(".focusZoom").style({
			"visibility": "hidden"
		});
	}
}
//
//// -------------------------------------------------------
function brushDisLeftOver() {
	if(!optsMultiresolution.showLimitsAreas){
		if(blocage){
			brushOutAll();
		}else{
			multiresolutionTop.selectAll(".focusDisLeft").style({
				"visibility": "visible"
			});
		}
	}
}
//
function brushDisLeftOut() {
	if(!optsMultiresolution.showLimitsAreas){
		multiresolutionTop.selectAll(".focusDisLeft").style({
			"visibility": "hidden"
		});
	}
}
//
//// -------------------------------------------------------
function brushDisRightOver() {
	if(!optsMultiresolution.showLimitsAreas){
		if(blocage){
			brushOutAll();
		}else{
			multiresolutionTop.select(".focusDisRight").style({
				"visibility": "visible"
			});
		}
	}
}
//
function brushDisRightOut() {
	if(!optsMultiresolution.showLimitsAreas){
		multiresolutionTop.select(".focusDisRight").style({
			"visibility": "hidden"
		});
	}
}
//
//// -------------------------------------------------------
function brushNorRightOver() {
	if(!optsMultiresolution.showLimitsAreas){
		if(blocage){
			brushOutAll();
		}else{
			multiresolutionTop.select(".focusNorRight").style({
				"visibility": "visible"
			});
		}
	}
}
//
function brushNorRightOut() {
	if(!optsMultiresolution.showLimitsAreas){
		multiresolutionTop.select(".focusNorRight").style({
			"visibility": "hidden"
		});
	}
}
//
//// -------------------------------------------------------
//
function brushNorLeftOver() {
	if(!optsMultiresolution.showLimitsAreas){
		if(blocage){
			brushOutAll();
		}else{
			multiresolutionTop.select(".focusNorLeft").style({
				"visibility": "visible"
			});
		}
	}
}
//
function brushNorLeftOut() {
	if(!optsMultiresolution.showLimitsAreas){
		multiresolutionTop.select(".focusNorLeft").style({
			"visibility": "hidden"
		});
	}
}

//

// *************************************************
function lineNorLeftEnable() {
	multiresolutionTop.selectAll(".lineNorLeft").style({
		"stroke-opacity" : 1
	})
}
function lineNorLeftDisable() {
	multiresolutionTop.selectAll(".lineNorLeft").style({
		"stroke-opacity" : 0.2
	})
}

function lineNorRightEnable() {
	multiresolutionTop.selectAll(".lineNorRight").style({
		"stroke-opacity" : 1
	})
}
function lineNorRightDisable() {
	multiresolutionTop.selectAll(".lineNorRight").style({
		"stroke-opacity" : 0.2
	})
}

// ***************************************************
function lineDisLeftEnable() {
	multiresolutionTop.selectAll(".lineDisLeft").style({
		"stroke-opacity" : 1
	})
}
function lineDisLeftDisable() {
	multiresolutionTop.selectAll(".lineDisLeft").style({
		"stroke-opacity" : 0.2
	})
}

function lineDisRightEnable() {
	multiresolutionTop.selectAll(".lineDisRight").style({
		"stroke-opacity" : 1
	})
}

function lineDisRightDisable() {
	multiresolutionTop.selectAll(".lineDisRight").style({
		"stroke-opacity" : 0.2
	})
}

/**
 * 
 * Create Scales and Axis in Focus FOCUS : Normal , Zoom , Fisheye
 * 
 *	i 0 : Normal Left 
 *	i 1 : Transition Left
 *	i 2 : Zoom
 *	i 3 : Transition Right
 *	i 4 : Normal Right
 */
function createScalesAxisFocus(rangesDomainMultiresolution) {

	rangesDomainMultiresolution.map(function(element) {
		if (element.key == "NL") {
			element.domain = brushContextNorLeft.extent();
			element.values.map(function(element) {element.domain = brushContextNorLeft.extent();})
		} else if (element.key == "FL") {
			element.domain = brushContextDisLeft.extent();
			element.values.map(function(element, index) {element.domain = calculeExtent(brushContextDisLeft.extent(), index);})
		} else if (element.key == "Z") {
			element.domain = brushContext.extent();
			element.values.map(function(element) {element.domain = brushContext.extent();})
		} else if (element.key == "FR") {
			element.domain = brushContextDisRight.extent();
			element.values.map(function(element, index) {element.domain = calculeExtent(brushContextDisRight.extent(), index);})
		} else if (element.key == "NR") {
			element.domain = brushContextNorRight.extent();
			element.values.map(function(element) {element.domain = brushContextNorRight.extent();})
		}
	});

	// Delete All axis focus
	var div = multiresolutionTop.selectAll(".x.axis").data([]);
	div.exit().remove();
	
	var divGrid = multiresolutionTop.selectAll(".x.grid").data([]);
	divGrid.exit().remove();

	// Delete All axis focus BOTTOM
	var divBottom = multiresolutionBottom.selectAll(".x.axis").data([]);
	divBottom.exit().remove();
	
	var divGridBottom = multiresolutionBottom.selectAll(".x.grid").data([]);
	divGridBottom.exit().remove();	

	scalesMultiresolution = [];
	axisMultiresolution = [];
	
	//xAxisFocus
	for (var i = 0; i < rangesDomainMultiresolution.length; i++) {
		for (var j = 0; j < rangesDomainMultiresolution[i].values.length; j++) {
			
			scalesMultiresolution[scalesMultiresolution.length] = d3.time.scale()
					.clamp(true) // 
					.range([rangesDomainMultiresolution[i].values[j].range[0],rangesDomainMultiresolution[i].values[j].range[1]])
					.domain(rangesDomainMultiresolution[i].values[j].domain);

			axisMultiresolution[axisMultiresolution.length] = d3.svg.axis()
						.scale(scalesMultiresolution[scalesMultiresolution.length - 1])
						.tickFormat(customTimeFormat)
						.tickSize(-heightMultiresolutionTop, 0)
						.tickPadding(5) // space-between-axis-label-and-axis
						.orient("top")
						;
			
			/* Grid Division Chaque interval of time */
			var axisGridDivision = d3.svg.axis()
								.scale(scalesMultiresolution[scalesMultiresolution.length-1])
								.orient("top")
								.tickSize(heightMultiresolutionTop)
								.ticks(getTimePolarity(polarityTemporal),stepTemporal)
								.tickFormat("");
			
			multiresolutionTop.select("#x_grid_focus").append("g")
									.attr("class", "x grid area" +i+" "+j)
									.attr("transform", "translate(" +0 + ","+ heightMultiresolutionTop + ")")
									.call(axisGridDivision)
	//							 .selectAll(".tick")//V4 d3.js ??
	//							 	 .classed("minor", function(d) { return d.getMinutes(); })


			// BOTTOM									
			/* Grid Division Chaque interval of time */

			var axisGridDivisionBottom = d3.svg.axis()
				.scale(scalesMultiresolution[scalesMultiresolution.length-1])
				.orient("top")
				.tickSize(heightMultiresolutionBottom)
				.ticks(getTimePolarity(polarityTemporal),stepTemporal)
				.tickFormat("");

			multiresolutionBottom.select("#x_grid_focus-bottom").append("g")
				.attr("class", "x grid area" +i+" "+j)
				.attr("transform", "translate(" +0 + ","+ heightMultiresolutionBottom + ")")
				.call(axisGridDivisionBottom)




			//Default 1 minute or 1 hour or 1...
			//TEXT TICKS
			//i=1 and i=3 distortion.
			//else normal and zoom
			switch (polarityTemporal) { 
				case "m"://minutes
					if(i==1 || i==3){
						axisMultiresolution[axisMultiresolution.length - 1].ticks(d3.time.minutes, getNumIntervalsDistortion(polarityTemporal, i, j, sDisLeft, sDisRight));
					}else{
						axisMultiresolution[axisMultiresolution.length - 1].ticks(getNumberOfLabels(polarityTemporal, i, j));
					}
					break;
				case "h"://hours
					if(i==1 || i==3){
						axisMultiresolution[axisMultiresolution.length - 1].ticks(d3.time.hours, getNumIntervalsDistortion(polarityTemporal, i, j, sDisLeft, sDisRight));
					}else{
						axisMultiresolution[axisMultiresolution.length - 1].ticks(getNumberOfLabels(polarityTemporal, i, j));
					}
					break;
				case "d":
					if(i==1 || i==3){
						axisMultiresolution[axisMultiresolution.length - 1].ticks(d3.time.days, getNumIntervalsDistortion(polarityTemporal, i, j, sDisLeft, sDisRight));
					}else{
						axisMultiresolution[axisMultiresolution.length - 1].ticks(getNumberOfLabels(polarityTemporal, i, j));
					}
					break;
				case "b":
					if(i==1 || i==3){
						axisMultiresolution[axisMultiresolution.length - 1].ticks(d3.time.months, getNumIntervalsDistortion(polarityTemporal, i, j, sDisLeft, sDisRight));
					}else{
						axisMultiresolution[axisMultiresolution.length - 1].ticks(getNumberOfLabels(polarityTemporal, i, j));
					}
					break;
				case "y":
					if(i==1 || i==3){
						axisMultiresolution[axisMultiresolution.length - 1].ticks(d3.time.years, getNumIntervalsDistortion(polarityTemporal, i, j, sDisLeft, sDisRight));
					}else{
						axisMultiresolution[axisMultiresolution.length - 1].ticks(getNumberOfLabels(polarityTemporal, i, j));
					}
					break;
			}

		}
	}
	

	/* Append Axis Focus */
	for (var k = 0; k < axisMultiresolution.length; k++) {
		multiresolutionTop.select("#x_axis_focus").append("g")
								.attr("class", "x axis focus" + k)
								.attr("transform", "translate(0,0)")
								.call(axisMultiresolution[k]);
	}	

}


/**
 * Get Scale Focus by Mouse Pixel Used for tool tip text
 * 
 * @param mouseCoordenate
 *            Get mouse coordenate
 * @returns {Number}
 */
function selectScaleFocusPixel(mouseCoordenate) {
//	console.log(rangesDomainFocus)
	var index = 0, count = 0;
	for (var i = 0; i < rangesDomainMultiresolution.length; i++) {
		for (var j = 0; j < rangesDomainMultiresolution[i].values.length; j++) {
			if (mouseCoordenate >= (rangesDomainMultiresolution[i].values[j].range[0])
					&& mouseCoordenate <= (rangesDomainMultiresolution[i].values[j].range[1])) {
				index = count;
			}
			count++;
		}
	}
	return index;
}



/**
 * FOCUS CREATION OF GRADIENTS FOR INTERPOLATE COLEURS
 */
function createGradientArrays(bottom_list) {

	multiresolutionTop.append("g").attr("id","linearGradient");
	
	/* Gradient Part */

	var newGradientRight = function(index, colorBegin, colorEnd) {
		
		multiresolutionTop.selectAll("#gradientRight"+index).data([]).exit().remove();
		
		var gradient = multiresolutionTop.select("#linearGradient").append("defs").append("linearGradient")
														.attr("id", "gradientRight" + index)
														.attr("x1", "0%")
														.attr("y1", "0%")
														.attr("x2", "100%")
														.attr("y2", "0%")
														.attr("spreadMethod", "pad"); // pad, repeat, reflect

		gradient.append("stop")
				.attr("offset", "0%")
				.attr("stop-color",colorBegin)
				.attr("stop-opacity", 1)
				.style("fill-opacity", "1");

		gradient.append("stop")
				.attr("offset", "100%")
				.attr("stop-color",colorEnd)
				.attr("stop-opacity", 1);

	}

	// For Stroke line
	var newGradientRightStroke = function(index, colorBegin, colorEnd) {
		
		multiresolutionTop.selectAll("#gradientRightStroke"+index).data([]).exit().remove();
		
		var gradient = multiresolutionTop.select("#linearGradient").append("defs").append("linearGradient")
														.attr("id", "gradientRightStroke" + index)
														.attr("x1", "0%")
														.attr("y1", "0%")
														.attr("x2", "100%")
														.attr("y2", "0%")
														.attr("spreadMethod", "pad"); // pad, repeat, reflect

		gradient.append("stop")
				.attr("offset", "0%")
				.attr("stop-color",colorBegin)
				.attr("stop-opacity", 1)

		gradient.append("stop")
				.attr("offset", "80%")
				.attr("stop-color",colorEnd)
				.attr("stop-opacity", 1);

	}

	var newGradientLeft = function(index, colorBegin, colorEnd) {
		
		multiresolutionTop.selectAll("#gradientLeft"+index).data([]).exit().remove();
		
		var gradient = multiresolutionTop.select("#linearGradient").append("defs").append("linearGradient")
														.attr("id", "gradientLeft" + index)
														.attr("x1", "0%")
														.attr("y1", "0%")
														.attr("x2", "100%")
														.attr("y2", "0%")
														.attr("spreadMethod", "pad"); // pad, repeat, reflect

		gradient.append("stop")
				.attr("offset", "0%")
				.attr("stop-color",colorBegin)
				.attr("stop-opacity", 1);

		gradient.append("stop")
				.attr("offset", "100%")
				.attr("stop-color",colorEnd)
				.attr("stop-opacity", 1);

	}

	// For stroke line
	var newGradientLeftStroke = function(index, colorBegin, colorEnd) {
		
		multiresolutionTop.selectAll("#gradientLeftStroke"+index).data([]).exit().remove();
		
		var gradient = multiresolutionTop.select("#linearGradient").append("defs").append("linearGradient")
														.attr("id", "gradientLeftStroke" + index)
														.attr("x1", "0%")
														.attr("y1", "0%")
														.attr("x2", "100%")
														.attr("y2", "0%")
														.attr("spreadMethod", "pad"); // pad, repeat, reflect

		gradient.append("stop")
					.attr("offset", "20%")
					.attr("stop-color",colorBegin)
					.attr("stop-opacity", 1);

		gradient.append("stop")
					.attr("offset", "100%")
					.attr("stop-color",colorEnd)
					.attr("stop-opacity", 1);

	}

	bottom_list.forEach(function(key_bottom){
		var father_key = getFatherKey(key_bottom.name);
		var hierarchy_father_node = jerarquiaOutflow.getNodeByKey(father_key.name);
		var hierarchy_hijo_node = jerarquiaOutflow.getNodeByKey(key_bottom.name);


		if(optsMultiresolution.layersFadingColors){
			colorBegin = hierarchy_father_node.color.desaturate().brighten(layersFadingColorsFactor);	
		}else{
			colorBegin = hierarchy_father_node.color;
		}
		
		var colorEnd = hierarchy_hijo_node.color; // "red"; // color(index);

		newGradientLeft(hierarchy_hijo_node.key, colorBegin, colorEnd); // Gradient Left
		newGradientLeftStroke(hierarchy_hijo_node.key, colorBegin, colorEnd); // Gradient Left Stroke

		newGradientRight(hierarchy_hijo_node.key, colorEnd, colorBegin); // Gradient Right
		newGradientRightStroke(hierarchy_hijo_node.key, colorEnd, colorBegin); // Gradient Left Stroke			

	})
}


function getFatherKey(node_key){
	for(var i = 0; i < key_context_list_outflow.length; i++){
		var top_key = key_context_list_outflow[i];
		if(node_key.indexOf(top_key.name)!==-1){
			return top_key;
		}
	}
}

function calculateRangeFocus(factNor, factDis, factZoom) {
	
	//on pourrait savoir STi, pero deberia calcular con el # de interavlos del area de transicion y 
	//tomando en cuanta tambien los nuevos SD and SCi
	
	// number-of-minute-in-interval
	let nNorLeft = calculeNumIntervals(brushContextNorLeft,polarityTemporal, stepTemporal); 
	let nDisLeft = calculeNumIntervals(brushContextDisLeft,polarityTemporal, stepTemporal);
	let nZoom = calculeNumIntervals(brushContext,polarityTemporal, stepTemporal);
	let nDisRight = calculeNumIntervals(brushContextDisRight,polarityTemporal, stepTemporal);
	let nNorRight = calculeNumIntervals(brushContextNorRight,polarityTemporal, stepTemporal);
	let nTotal = nNorLeft + nDisLeft + nZoom + nDisRight + nNorRight;

	// Proportions
	let pNorLeft = (factNor * nNorLeft) / nTotal; 
	let pDisLeft = (factDis * nDisLeft) / nTotal; 
	let pZoom = (factZoom * nZoom)/ nTotal;
	let pDisRight = (factDis * nDisRight) / nTotal;
	let pNorRight = (factNor * nNorRight) / nTotal; 
	let pTotal = pNorLeft + pDisLeft + pZoom + pNorRight + pDisRight;
	
	//SNorLeft and SDisLeft are global
	// Size
	let sNorLeft = pNorLeft * ((widthIntern) / pTotal); 
	sDisLeft = pDisLeft * ((widthIntern) / pTotal); 
	let sZoom = pZoom * ((widthIntern) / pTotal);
	sDisRight = pDisRight * ((widthIntern) / pTotal); 
	let sNorRight = pNorRight * ((widthIntern) / pTotal);
	let sTotal = sNorLeft + sDisLeft + sZoom + sDisRight + sNorRight;
	
	// tailles-des-intervals fixes
	let iNorLeft = sNorLeft / nNorLeft;
	let iZoom = sZoom / nZoom;
	let iNorRight = sNorRight / nNorRight;

	//Calcule constante de croissance left distortion
	var stringConstanteLeft = "";
	stringConstanteLeft = stringConstanteLeft+nDisLeft; //#number of intervals
	for (var i = 0; i < nDisLeft; i++) {
		stringConstanteLeft = stringConstanteLeft + "\n" + iNorLeft;
	}
	stringConstanteLeft=stringConstanteLeft+"\n-"+sDisLeft; //add SDISLEFT
	var constanteL = PolyReSolveT(stringConstanteLeft);
	//
	
	//Calcule constante de croissance right distortion
	var stringConstanteRight = "";
	stringConstanteRight = stringConstanteRight+nDisRight;
	for (var i = 0; i < nDisRight; i++) {
		stringConstanteRight = stringConstanteRight + "\n" + iNorRight;
	}
	stringConstanteRight=stringConstanteRight+"\n-"+sDisRight;
	var constanteR = PolyReSolveT(stringConstanteRight);
//	console.log("R-" + optsMultistream.constanteR + "--");
	//
	
	if(optsMultistream.log){
		console.log("FACTEUR : factNor : " + factNor + ", factDis : " + factDis + ", factZoom : " + factZoom);
		console.log("NINTERVALS : nNorLeft : " + nNorLeft + ", nDisLeft : " + nDisLeft + ", nZoom : " + nZoom 
				+ ", nDisRight : " + nDisRight + ", nNorRight : " + nNorRight + ", nTotal : " + nTotal);
		console.log("PROPORTIONS : " + " pNorLeft : " + pNorLeft + ", pDisLeft : " + pDisLeft + ", pZoom : " + pZoom  + 			
				", pDisRight : " + pDisRight + ", pNorRight : " + pNorRight + ", pTotal : " + pTotal);
		console.log("SIZE : " + " sNorLeft : " + sNorLeft + ", sDisLeft : " + sDisLeft + ", sZoom : " + sZoom + 
				" sDisRight : " + sDisRight + ", sNorRight : " + sNorRight + ", sTotal : " + sTotal);
		console.log("SIZE INTERVALS : " + " iNorLeft : " + iNorLeft + ", iZoom : " + iZoom + ", iNorRight : " + iNorRight);
		console.log("--------------------------------")
	}
	
	var rangesFocus = []; // range-Local-Area
	rangesFocus.push({
		key : "NL",
		size : sNorLeft
	});
	
	calculateDistortionL(iNorLeft, nDisLeft, constanteL).forEach(function(element) { // return-valeurs-ascendent
		rangesFocus = rangesFocus.concat({
			key : "FL",
			size : element
		})
	});
	// Range Detail Area
	rangesFocus.push({
		key : "Z",
		size : sZoom
	});

	// Range Distortion Area
	calculateDistortionR(iNorRight, nDisRight,constanteR).forEach(function(element) { // return-valeurs-descendent
			rangesFocus = rangesFocus.concat({
				key : "FR",
				size : element
			})
	});

	// Range Local Area
	rangesFocus.push({
		key : "NR",
		size : sNorRight
	});

	if (validateDistortion(factNor, factDis, factZoom, iNorLeft, iNorRight, iZoom)) {
		return calculateAxisFocusIntervals(rangesFocus);
	} else {
		return null;
	}
}


function calculateAxisFocusIntervals(rangesFocus) {
	var axisFocus = [];

	for (var i = 0; i < rangesFocus.length; i++) {
		var axis = [];
		if (i == 0) {
			axis.push({
				key : rangesFocus[i].key,
				range : [ 0, rangesFocus[i].size ]
			})
		} else {
			axis.push({
				key : rangesFocus[i].key,
				range : [ axisFocus[i - 1].range[1],axisFocus[i - 1].range[1] + rangesFocus[i].size ]
			})
		}
		axisFocus = axisFocus.concat(axis);
	}
	return axisFocus;
}

// DISTORTION
/**
 * @param iNorLeft Size of an interval in NorLeft
 * @param numberInterval Number of intervals in DisLeft
 * @returns {Array}
 */
function calculateDistortionL(iNorLeft, numberInterval, constanteL) {
	iFunctionL = [];
	if(optsMultistream.log){
		console.log("calculando con optsMultistream.constanteL : " + constanteL);
	}
	for (var x = 1; x <= numberInterval; x++) {
		var g = (iNorLeft)*(Math.pow(constanteL, x));
		iFunctionL.push(g);
	}
	
	var sumDisLeft = 0;
	for (var i = 0; i < iFunctionL.length; i++) {
		sumDisLeft = sumDisLeft + iFunctionL[i];
	}
	return iFunctionL;
}

/**
 * @param iNorRight Size of an interval in NorRight
 * @param numberInterval Number of intervals in DisRight
 * @returns
 */
function calculateDistortionR(iNorRight, numberInterval,constanteR) {
	iFunctionR = [];
	if(optsMultistream.log){
		console.log("calculando con optsMultistream.constanteR : " + constanteR);
	}
	for (var x = 1; x <= numberInterval; x++) {
		var g = (iNorRight)*(Math.pow(constanteR, x));					
		iFunctionR.push(g);
	}
	return iFunctionR.reverse();
}

function validateDistortion(factNor, factDis, factZoom, iNorLeft, iNorRight, iZoom) {
	
	var validationIntervals = false;
	var validationDisLeft = false;
	var validationDisRight = false;
	var validationAlphaBetaGamma = false;
	
	let minIntervalNormal = 1;
	let minIntervalDis =  1;
	let minIntervalZoom = 1;


	//validate num intervals minimum for every interval in context brushes
	if((minIntervalNormal <= intervals(polarityTemporal, 0)) //normal left
	&& (minIntervalDis <= intervals(polarityTemporal, 1)) //dist left
	&& (minIntervalZoom <= intervals(polarityTemporal, 2)) //zoom
	&& (minIntervalDis <= intervals(polarityTemporal, 3)) //dist right
	&& (minIntervalNormal <= intervals(polarityTemporal, 4))){ // normal right
		validationIntervals = true;
	}
	
	//validation factZoom>factDis>factNor
	if((factZoom>factDis)&&(factDis>factNor)){
		validationAlphaBetaGamma = true;
	}
	
	//validation left distortion
	if (iFunctionL[0] >= iNorLeft && iFunctionL[iFunctionL.length-1]<=iZoom) {
		validationDisLeft = true
	}

	// validation Right distortion
	if (iFunctionR[0] <= iZoom && iFunctionR[iFunctionR.length-1] >= iNorRight) {
		validationDisRight = true;
	}
	
	if(validationIntervals 
	&& validationDisLeft
	&& validationDisRight
	&& validationAlphaBetaGamma
	){
		return true;
	}
	return false;
}

//This is the hardest process	
function updateFocus(calcule) {

	rangesDomainMultiresolution = (nest_by_key.entries(calcule));

	createScalesAxisFocus(rangesDomainMultiresolution);
	
	//HARD PART
	/* Move area */// 4 it is 3 areas
	for (var index = 0; index < 4; index++) {
		multiresolutionTop.selectAll(".focus.area" + index)
					.attr("d", function(d) {return areaFocus(d, index,yScaleMultiresolution);});

		multiresolutionBottom.selectAll(".focus.area" + index)
					.attr("d", function(d) {return areaFocus(d, index,yScaleMultiresolutionBottom);});					
	}


}

/*  */
function beginValidation() {

	beginContext = [ {
			brushBegin : brushContextNorLeft.extent(),
			scaleDomain : xScaleContextNorLeft.domain(),
			scaleRange : xScaleContextNorLeft.range()
		}, {
			brushBegin : brushContextDisLeft.extent(),
			scaleDomain : xScaleContextDisLeft.domain(),
			scaleRange : xScaleContextDisLeft.range()
		}, {
			brushBegin : brushContext.extent(),
			scaleDomain : xScaleContext.domain(),
			scaleRange : xScaleContext.range()
		}, {
			brushBegin : brushContextDisRight.extent(),
			scaleDomain : xScaleContextDisRight.domain(),
			scaleRange : xScaleContextDisRight.range()
		}, {
			brushBegin : brushContextNorRight.extent(),
			scaleDomain : xScaleContextNorRight.domain(),
			scaleRange : xScaleContextNorRight.range()
		}, {
			facteurZoom : optsMultistream.facteurZoom,
			facteurDis : optsMultistream.facteurDis,
			facteurNor : optsMultistream.facteurNor
		} 
	];

}

/*  */
function backContext() {
	
	console.log("returning back context :(")
	
	/* NorLeft */
	xScaleContextNorLeft.domain(beginContext[0].scaleDomain)
											.range(beginContext[0].scaleRange);

	/* DisLeft */
	xScaleContextDisLeft.domain(beginContext[1].scaleDomain)
											.range(beginContext[1].scaleRange);

	/* Zoom */
	xScaleContext.domain(beginContext[2].scaleDomain)
							.range(beginContext[2].scaleRange);

	/* DisRight */
	xScaleContextDisRight.domain(beginContext[3].scaleDomain)
											.range(beginContext[3].scaleRange);

	/* NorRight */
	xScaleContextNorRight.domain(beginContext[4].scaleDomain)
											.range(beginContext[4].scaleRange);
	

	brushContextNorLeft.extent(beginContext[0].brushBegin);
	brushContextDisLeft.extent(beginContext[1].brushBegin);
	brushContext.extent(beginContext[2].brushBegin);
	brushContextDisRight.extent(beginContext[3].brushBegin);
	brushContextNorRight.extent(beginContext[4].brushBegin);
	
	context.select(".brushNorLeft").call(brushContextNorLeft);
	context.select(".brushDisLeft").call(brushContextDisLeft);
	context.select(".brushZoom").call(brushContext);
	context.select(".brushDisRight").call(brushContextDisRight);
	context.select(".brushNorRight").call(brushContextNorRight);

	
	// candadoLeft = context.selectAll("#candadoLeft");
	candadoLeft.attr("x",xScaleContext(brushContextNorLeft.extent()[0])-8);

	// candadoRight = context.selectAll("#candadoRight");
	candadoRight.attr("x",xScaleContext(brushContextNorRight.extent()[1])-8);
	
	updateRectanglesAndLinksInFocus();
	
}

function totalito(calcule){	
	updateFocus(calcule);
	updateRectanglesAndLinksInFocus();
	//getAgregatedData(nivel_bajo,brushContext.extent()[0],brushContext.extent()[1])
	execAlgosInZoomArea();

	//updateLineFlows
}

function callAnimation() {

	let calcule = calculateRangeFocus(optsMultistream.facteurNor, optsMultistream.facteurDis, optsMultistream.facteurZoom);

	if (calcule != null) {
		beginValidation();
		updateRectanglesAndLinksInFocus();
		if(animation){
			totalito(calcule);
		}
	}else{
		backContext();
	}
}


function loadExtent1(extent0) {
	var extent1;
	var d0;
	var d1;
	d0 = timeParser(extent0[0]), 
	d1 = timeParser(extent0[1]);
	extent1 = [d0,d1];
	return extent1;
}

function timeTooltip(time,mousex){
	let subHalf;
	let addHalf;
	let moyenne;
	
	if(stepTemporal==1){
		return getTimeRound(scalesMultiresolution[selectScaleFocusPixel(mousex)].invert(mousex),polarityTemporal);
	}
	subHalf = getTimeOffset(time, -stepTemporal,polarityTemporal);
	addHalf = getTimeOffset(time, stepTemporal,polarityTemporal);
	moyenne = getTimeOffset(getTimeWindow(subHalf, addHalf, polarityTemporal, stepTemporal)[0], Math.floor(stepTemporal/2),polarityTemporal);
	if(time <= moyenne){
		return getTimeWindow(subHalf, addHalf, polarityTemporal, stepTemporal)[0];
	}else{
		return getTimeWindow(subHalf, addHalf, polarityTemporal, stepTemporal)[1];
	}
	
}

//Used to get the moyen when brush move
//depends de stepTemporal
function timeParser(time) {
	let subHalf = getTimeOffset(getTimeRound(time,polarityTemporal), -stepTemporal, polarityTemporal);
	let addHalf = getTimeOffset(getTimeRound(time,polarityTemporal), stepTemporal, polarityTemporal);
	let timeParse = getTimeWindow(subHalf, addHalf, polarityTemporal, stepTemporal)[1];
//	console.log(timeParse)
	return timeParse;
}


function brushContextMove(brushExtent) {

	ratonOutMultiresolutionView();

	let extent1 = loadExtent1(brushExtent);	
	context.select(".brushZoom").call(brushContext.extent(extent1));

	if(brushContextFlag[0].getTime() != extent1[0].getTime() || brushContextFlag[1].getTime() != extent1[1].getTime()){
		// Distortion Areas
		let facteurBrusDisLeft = getTimeWindow(brushContextDisLeft.extent()[0],brushContextDisLeft.extent()[1], polarityTemporal,stepTemporal).length;
		let facteurBrusDisRight =  getTimeWindow(brushContextDisRight.extent()[0],brushContextDisRight.extent()[1], polarityTemporal,stepTemporal).length; 
		
		let extentDisLeft = [getTimeOffset(extent1[0],-facteurBrusDisLeft*stepTemporal,polarityTemporal), extent1[0]];
		let extentDisRight = [extent1[1], getTimeOffset(extent1[1],+facteurBrusDisRight*stepTemporal,polarityTemporal)];
		
		brushContextDisLeft.extent(extentDisLeft);
		context.select(".brushDisLeft").call(brushContextDisLeft);
	
		brushContextDisRight.extent(extentDisRight);
		context.select(".brushDisRight").call(brushContextDisRight);
		
		
		/* Distortion Area Left */
		// Update Scales por no ver l mouse en forma de cruz fea
		xScaleContextDisLeft.range([ xScaleContext(brushContextNorLeft.extent()[0]), xScaleContext(extent1[0]) ])
							.domain([ brushContextNorLeft.extent()[0], extent1[0] ]);
		
		xScaleContextDisRight.range([ xScaleContext(extent1[1]), xScaleContext(brushContextNorRight.extent()[1]) ])
							.domain([ extent1[1], brushContextNorRight.extent()[1] ]);
		
	
		// Local Areas
		let facteurBrusNorLeft = getTimeWindow(brushContextNorLeft.extent()[0],brushContextNorLeft.extent()[1], polarityTemporal,stepTemporal).length;
		let facteurBrusNorRight =  getTimeWindow(brushContextNorRight.extent()[0],brushContextNorRight.extent()[1], polarityTemporal,stepTemporal).length; 
		
		let extentNorLeft;
		if(lockedLeft){
			extentNorLeft = [brushContextNorLeft.extent()[0], brushContextDisLeft.extent()[0] ];	
		}else{
			extentNorLeft = [getTimeOffset(brushContextDisLeft.extent()[0],-facteurBrusNorLeft*stepTemporal,polarityTemporal), brushContextDisLeft.extent()[0]]
		}
		
		let extentNorRight
		if(lockedRight){
			extentNorRight = [brushContextDisRight.extent()[1],brushContextNorRight.extent()[1] ];
		}else{
			extentNorRight = [brushContextDisRight.extent()[1],getTimeOffset(brushContextDisRight.extent()[1],+facteurBrusNorRight*stepTemporal,polarityTemporal)];
		}
		
		brushContextNorLeft.extent(extentNorLeft);
		context.select(".brushNorLeft").call(brushContextNorLeft);
	
		brushContextNorRight.extent(extentNorRight);
		context.select(".brushNorRight").call(brushContextNorRight);
		
		// Update Scales por no ver l mouse en forma de cruz fea
		xScaleContextNorLeft.range([ 0, xScaleContext(brushContextDisLeft.extent()[0]) ])
							.domain([ dateMinRange, brushContextDisLeft.extent()[0] ]);
		
		xScaleContextNorRight.range([ xScaleContext(brushContextDisRight.extent()[1]), widthIntern ])
							.domain([ brushContextDisRight.extent()[1], dateMaxRange ]);
		

		if(!validatorBrushes()){
			backContext();
			return;
		}

		// ANIMATION
		callAnimation();
		
		//update the Flag
		brushContextFlag = extent1;
	}
}

function brushContextNorLeftMove() {
	
	let extent0 = brushContextNorLeft.extent(); 
	let extent1 = loadExtent1(extent0);
	d3.select(this).call(brushContextNorLeft.extent(extent1));
	
	if(brushContextNorLeftFlag[0].getTime() != extent1[0].getTime() || brushContextNorLeftFlag[1].getTime() != extent1[1].getTime()){
		
		//Changing range and domain in brushContextDifLeft
		xScaleContextDisLeft.range([xScaleContext(brushContextNorLeft.extent()[0]), xScaleContext(brushContext.extent()[0])])
							.domain([brushContextNorLeft.extent()[0], brushContext.extent()[0]]);
		
		context.select(".brushDisLeft").call(brushContextDisLeft);
	
		// ANIMATION
		callAnimation();
		
		brushContextNorLeftFlag = brushContextNorLeft.extent();
	}
}


function brushContextDisLeftMove() {

	let extent0 = brushContextDisLeft.extent();
	let extent1 = loadExtent1(extent0);
	d3.select(this).call(brushContextDisLeft.extent(extent1));
	
	if(brushContextDisLeftFlag[0].getTime() != extent1[0].getTime() || brushContextDisLeftFlag[1].getTime() != extent1[1].getTime()){
		
		let facteurBrusNorLeft = getTimeWindow(brushContextNorLeft.extent()[0],brushContextNorLeft.extent()[1], polarityTemporal,stepTemporal).length;
		let extentNorLeft;
		if(lockedLeft){
			extentNorLeft = [brushContextNorLeft.extent()[0], brushContextDisLeft.extent()[0] ];	
		}else{
			extentNorLeft = [getTimeOffset(brushContextDisLeft.extent()[0],-facteurBrusNorLeft,polarityTemporal), brushContextDisLeft.extent()[0]]
		}
		
		//Changing range and domain in BrushContextNorLeft
		xScaleContextNorLeft.range([0, xScaleContext(brushContextDisLeft.extent()[0])])
							.domain([dateMinRange, brushContextDisLeft.extent()[0]]);
		
		context.select(".brushNorLeft").call(brushContextNorLeft.extent(extentNorLeft));
	
		
		//Changing range and domain in DisLeft
		xScaleContextDisLeft.range([ xScaleContext(extentNorLeft[0]), xScaleContext(brushContext.extent()[0]) ])
							.domain([ extentNorLeft[0], brushContext.extent()[0] ]);
							
		// ANIMATION
		callAnimation();
		
		brushContextDisLeftFlag = brushContextDisLeft.extent();
	}
}

function brushContextDisRightMove() {

	let extent0 = brushContextDisRight.extent(); 
	let extent1 = loadExtent1(extent0);
	d3.select(this).call(brushContextDisRight.extent(extent1));

	if(brushContextDisRightFlag[0].getTime() != extent1[0].getTime() || brushContextDisRightFlag[1].getTime() != extent1[1].getTime()){
		
		let facteurBrusNorRight =  getTimeWindow(brushContextNorRight.extent()[0],brushContextNorRight.extent()[1], polarityTemporal,stepTemporal).length; 
		
		let extentNorRight
		if(lockedRight){
			extentNorRight = [brushContextDisRight.extent()[1],brushContextNorRight.extent()[1] ];
		}else{
			extentNorRight = [brushContextDisRight.extent()[1],getTimeOffset(brushContextDisRight.extent()[1],+facteurBrusNorRight,polarityTemporal)];
		}
		
		//Changing range and domain in BrushContextNorRight
		xScaleContextNorRight.range([xScaleContext(brushContextDisRight.extent()[1]),widthIntern ])
							 .domain([brushContextDisRight.extent()[1], dateMaxRange]);
		
		context.select(".brushNorRight").call(brushContextNorRight.extent(extentNorRight));
		
		//Changing range and domain in DisRight
		xScaleContextDisRight.range([xScaleContext(brushContext.extent()[1]), xScaleContext(extentNorRight[1]) ])
							.domain([ brushContext.extent()[1], extentNorRight[1] ]);
							
	
		// ANIMATION
		callAnimation();
	
		brushContextDisRightFlag = brushContextDisRight.extent();
	}

}

function brushContextNorRightMove() {
	
	let extent0 = brushContextNorRight.extent(); 
	let extent1 = loadExtent1(extent0);
	d3.select(this).call(brushContextNorRight.extent(extent1));
	
	if(brushContextNorRightFlag[0].getTime() != extent1[0].getTime() || brushContextNorRightFlag[1].getTime() != extent1[1].getTime()){
		
		xScaleContextDisRight.range([xScaleContext(brushContext.extent()[1]), xScaleContext(brushContextNorRight.extent()[1])])
							.domain([brushContext.extent()[1], brushContextNorRight.extent()[1]]);
		
		context.select(".brushDisRight").call(brushContextDisRight);
		
		// ANIMATION
		callAnimation();
		
		brushContextNorRightFlag = brushContextNorRight.extent();
	}
	
}


function updateRectanglesAndLinksInFocus(){
	
	var objNl = selectScaleFocus("NL");
	var objFl = selectScaleFocus("FL");
	var objZ = selectScaleFocus("Z");
	var objFr = selectScaleFocus("FR");
	var objNr = selectScaleFocus("NR");
	var heightVertical = heightMultiresolutionBottom + heightGapFocusContext;
	
	if(optsContext.showBrushNormal){

		// --------------------------------------------------------
		var verticalNl = multiresolutionBottom.select("#linksProjetions").selectAll(".lineNorLeft").data(objNl);
		
		// update
		verticalNl.attr("class", "lineNorLeft")
					.attr("x1", function(d) {return scalesMultiresolution[d.index](d.domainMin)})
					.attr("y1", heightMultiresolutionBottom)
					.attr("x2", function(d) {return xScaleContext(brushContextNorLeft.extent()[0])})
					.attr("y2", heightVertical);
		
		// create
		verticalNl.enter().append("line")
				.attr("class", "lineNorLeft")
				.attr("x1", function(d) {return scalesMultiresolution[d.index](d.domainMin)})
				.attr("y1", heightMultiresolutionBottom)
				.attr("x2", function(d) {return xScaleContext(brushContextNorLeft.extent()[0])}) 
				.attr("y2", heightVertical);
		// exit
		verticalNl.exit().remove();

		var verticalNr = multiresolutionBottom.select("#linksProjetions").selectAll(".lineNorRight").data(objNr);
		// update
		verticalNr.attr("class", "lineNorRight")
					.attr("x1", function(d) {return scalesMultiresolution[d.index](d.domainMax)})
					.attr("y1", heightMultiresolutionBottom)
					.attr("x2", function(d) {return xScaleContext(brushContextNorRight.extent()[1])})
					.attr("y2", heightVertical);
		// create
		verticalNr.enter().append("line")
				.attr("class", "lineNorRight")
				.attr("x1",function(d) {return scalesMultiresolution[d.index](d.domainMax)})
				.attr("y1", heightMultiresolutionBottom)
				.attr("x2", function(d) {return xScaleContext(brushContextNorRight.extent()[1])})
				.attr("y2", heightVertical);
				
		// exit
		verticalNr.exit().remove();
	}

	if(optsContext.showBrushDistortion){

		var verticalFl = multiresolutionBottom.select("#linksProjetions").selectAll(".lineDisLeft").data(objNl);
		// update
		verticalFl.attr("class", "lineDisLeft")
					.attr("x1", function(d) {return scalesMultiresolution[d.index](d.domainMax)})
					.attr("y1", heightMultiresolutionBottom)
					.attr("x2", function(d) {return xScaleContext(brushContextDisLeft.extent()[0])})
					.attr("y2", heightVertical);
		// create
		verticalFl.enter().append("line")
				.attr("class", "lineDisLeft")
				.attr("x1",function(d) {return scalesMultiresolution[d.index](d.domainMax)}) //d.index = 0 always in local
				.attr("y1", heightMultiresolutionBottom)
				.attr("x2", function(d) {return xScaleContext(brushContextDisLeft.extent()[0])})
				.attr("y2", heightVertical);
		// exit
		verticalFl.exit().remove();
	
	
	
		var verticalFr = multiresolutionBottom.select("#linksProjetions").selectAll(".lineDisRight").data(objNr);
		// update
		verticalFr.attr("class", "lineDisRight")
					.attr("x1", function(d) {return scalesMultiresolution[d.index](d.domainMin)})
					.attr("y1", heightMultiresolutionBottom)
					.attr("x2", function(d) {return xScaleContext(brushContextNorRight.extent()[0])})
					.attr("y2", heightVertical);
		// create
		verticalFr.enter().append("line")
				.attr("class", "lineDisRight")
				.attr("x1",function(d) {return scalesMultiresolution[d.index](d.domainMin)})
				.attr("y1", heightMultiresolutionBottom)
				.attr("x2", function(d) {return xScaleContext(brushContextNorRight.extent()[0])})
				.attr("y2", heightVertical);
		// exit
		verticalFr.exit().remove();

	}
	
	


	if(optsContext.showContext){

		var verticalZl = multiresolutionBottom.select("#linksProjetions").selectAll(".lineZoomLeft").data(objZ);
		// update
		verticalZl.attr("class", "lineZoomLeft")
					.attr("x1", function(d) {return scalesMultiresolution[d.index](d.domainMin)})
					.attr("y1", heightMultiresolutionBottom)
					.attr("x2", function(d) {return xScaleContext(brushContext.extent()[0])})
					.attr("y2", heightVertical);
		// create
		verticalZl.enter().append("line")
				.attr("class", "lineZoomLeft")
				.attr("x1",function(d) {return scalesMultiresolution[d.index](d.domainMin)})
				.attr("y1", heightMultiresolutionBottom)
				.attr("x2", function(d) {return xScaleContext(brushContext.extent()[0])})
				.attr("y2", heightVertical);
		// exit
		verticalZl.exit().remove();

		var verticalZr = multiresolutionBottom.select("#linksProjetions").selectAll(".lineZoomRight").data(objZ);
		// update
		verticalZr.attr("class", "lineZoomRight")
					.attr("x1", function(d) {return scalesMultiresolution[d.index](d.domainMax)})
					.attr("y1", heightMultiresolutionBottom)
					.attr("x2", function(d) {return xScaleContext(brushContext.extent()[1])})
					.attr("y2", heightVertical);
		// create
		verticalZr.enter().append("line")
				.attr("class", "lineZoomRight")
				.attr("x1",function(d) {return scalesMultiresolution[d.index](d.domainMax)})
				.attr("y1", heightMultiresolutionBottom)
				.attr("x2", function(d) {return xScaleContext(brushContext.extent()[1])})
				.attr("y2", heightVertical);
		// exit
		verticalZr.exit().remove();

	}
	
	
	
	
	
	
	

	
	var nl = multiresolutionTop.select("#linksProjetions").selectAll(".focusNorLeft").data(objNl);
	// update
	nl.attr("class", "focusNorLeft")
			.attr("x", function(d) {return scalesMultiresolution[d.index](d.domainMin)})
			.attr("y", 0)
			.attr("width",function(d) {return (scalesMultiresolution[d.index](d.domainMax) - scalesMultiresolution[d.index](d.domainMin))})
			.attr("height", heightMultiresolutionTop)

	// create
	nl.enter().append("rect")
		.attr("class", "focusNorLeft")
		.attr("x", function(d) {return scalesMultiresolution[0](d.domainMin)})
		.attr("y", 0)
		.attr("width",function(d) {return (scalesMultiresolution[0](d.domainMax) - scalesMultiresolution[0](d.domainMin))})
		.attr("height", heightMultiresolutionTop)

	// exit
	nl.exit().remove()


	var fl = multiresolutionTop.select("#linksProjetions").selectAll(".focusDisLeft").data(objFl);
	// update
	fl.attr("class", "focusDisLeft")
			.attr("x", function(d) {return scalesMultiresolution[1](d.domainMin)})
			.attr("y", 0)
			.attr("width",function(d) {return (scalesMultiresolution[objFl.length](d.domainMax) - scalesMultiresolution[1](d.domainMin))})
			.attr("height", heightMultiresolutionTop)

	// create
	fl.enter().append("rect")
		.attr("class", "focusDisLeft")
		.attr("x",function(d) {return scalesMultiresolution[1](d.domainMin)})
		.attr("y", 0)
		.attr("width",function(d) {return (scalesMultiresolution[objFl.length](d.domainMax) - scalesMultiresolution[1](d.domainMin))})
		.attr("height", heightMultiresolutionTop)

	// exit
	fl.exit().remove()

	var nr = multiresolutionTop.select("#linksProjetions").selectAll(".focusNorRight").data(objNr);
	// update
	nr.attr("class", "focusNorRight")
			.attr("x", function(d) {return scalesMultiresolution[d.index](d.domainMin)})
			.attr("y", 0)
			.attr("width",function(d) {return (scalesMultiresolution[d.index](d.domainMax) - scalesMultiresolution[d.index](d.domainMin))})
			.attr("height", heightMultiresolutionTop)

	// create
	nr.enter().append("rect")
		.attr("class", "focusNorRight")
		.attr("x", function(d) {return scalesMultiresolution[d.index](d.domainMin)})
		.attr("y", 0)
		.attr("width",function(d) {return (scalesMultiresolution[d.index](d.domainMax) - scalesMultiresolution[d.index](d.domainMin))})
		.attr("height", heightMultiresolutionTop)

	// exit
	nr.exit().remove()

	
	var fr = multiresolutionTop.select("#linksProjetions").selectAll(".focusDisRight").data(objFr);

	// update
	fr.attr("class", "focusDisRight")
			.attr("x", function(d) {return scalesMultiresolution[objNr[0].index - objFr.length](d.domainMin)})
			.attr("y", 0)
			.attr("width",function(d) {return (scalesMultiresolution[objNr[0].index - 1](d.domainMax) - scalesMultiresolution[objNr[0].index- objFr.length](d.domainMin))})
			.attr("height", heightMultiresolutionTop)
	
	// create
	fr.enter().append("rect")
		.attr("class", "focusDisRight")
		.attr("x", function(d) {return scalesMultiresolution[objNr[0].index - objFr.length](d.domainMin)})
		.attr("y", 0)
		.attr("width",function(d) {return (scalesMultiresolution[objNr[0].index - 1](d.domainMax) - scalesMultiresolution[objNr[0].index- objFr.length](d.domainMin))})
		.attr("height", heightMultiresolutionTop)

	// exit
	fr.exit().remove()
	
	var z = multiresolutionTop.select("#linksProjetions").selectAll(".focusZoom").data(objZ);
	// update
	z.attr("class", "focusZoom")
			.attr("x", function(d) {return scalesMultiresolution[d.index](d.domainMin)})
			.attr("y", 0)
			.attr("width",function(d) {return (scalesMultiresolution[d.index](d.domainMax) - scalesMultiresolution[d.index](d.domainMin))})
			.attr("height", heightMultiresolutionTop)
	
	// create
	z.enter().append("rect")
			.attr("class", "focusZoom")
			.attr("x", function(d) {return scalesMultiresolution[d.index](d.domainMin)})
			.attr("y", 0)
			.attr("width",function(d) {return (scalesMultiresolution[d.index](d.domainMax) - scalesMultiresolution[d.index](d.domainMin))})
			.attr("height", heightMultiresolutionTop)

	// exit
	z.exit().remove()
	
	
	
	
	
	
	
	
	
	
	
	if(optsContext.showBrushNormal){
	
		//CANDADO
		candadoLeft = context.selectAll("#candadoLeft").data([1]);
			
		//update
		candadoLeft.attr("x",xScaleContext(brushContextNorLeft.extent()[0])-8);
		
		//create
		candadoLeft.enter().append("image")
				.attr("id","candadoLeft")
				.attr("class","candadoLeft")
				.attr({
					'xlink:href': function(){return (optsContext.blockedBrushNormalLeft)?pathCandadoClose:pathCandadoOpen;},  // can also add svg file here
					x: xScaleContext(brushContextNorLeft.extent()[0])-8,
					y: heightContext,
					width: 16,
					height: 16
				})
				.style("cursor","hand")
				;
			
		
		candadoRight = context.selectAll("#candadoRight").data([1]);
			
		//update
		candadoRight.attr("x",xScaleContext(brushContextNorRight.extent()[1])-8);
		
		//create
		candadoRight.enter().append("image")
				.attr("id","candadoRight")
				.attr("class","candadoRight")
				.attr({
					'xlink:href': function(){return (optsContext.blockedBrushNormalRight)?pathCandadoClose:pathCandadoOpen;},  // can also add svg file here
					x: xScaleContext(brushContextNorRight.extent()[1])-8,
					y: heightContext,
					width: 16,
					height: 16
				})
				.style("cursor","hand")
				;

		if(lockedRight){
			document.getElementById("candadoRight").classList.add("consin");
		}
	
		if(lockedLeft){
			document.getElementById("candadoLeft").classList.add("consin");
		}
						
	}
	
}



/**
 * FOCUS Get scale in focus
 * 
 * @param codeScale
 * @returns {Array}
 */
function selectScaleFocus(codeScale) {
	var result = [];
	count = 0;

	for (var i = 0; i < rangesDomainMultiresolution.length; i++) {
		for (var j = 0; j < rangesDomainMultiresolution[i].values.length; j++) {
			if (codeScale == rangesDomainMultiresolution[i].values[j].key
					&& codeScale != "FL" && codeScale != "FR") {
				var obj = {};
				obj.index = count;
				obj.domainMin = rangesDomainMultiresolution[i].values[j].domain[0];
				obj.domainMax = rangesDomainMultiresolution[i].values[j].domain[1];
				result.push(obj);
			} else if (codeScale == rangesDomainMultiresolution[i].values[j].key
					&& codeScale == "FL"
					|| codeScale == rangesDomainMultiresolution[i].values[j].key
					&& codeScale == "FR") {
				var obj = {};
				obj.index = count;
				obj.domainMin = rangesDomainMultiresolution[i].domain[0];
				obj.domainMax = rangesDomainMultiresolution[i].domain[1];
				result.push(obj);
			}
			count++;
		}
	}

	return result;
}

/**
 * FOCUS Get axis in focus given a date
 * 
 * @param date
 * @returns {Number}
 */
function selectAxisFocus(date) {
//	console.log("fecha es:",date)
	var index = 0;
	var count = 0;
	for (var i = 0; i < rangesDomainMultiresolution.length; i++) {
		for (var j = 0; j < rangesDomainMultiresolution[i].values.length; j++) {
			if (date >= (rangesDomainMultiresolution[i].values[j].domain[0]) //>=
					&& date <= (rangesDomainMultiresolution[i].values[j].domain[1])) {
				index = count;
			}
			count++;
		}
	}
	if(date<=brushContextNorLeft.extent()[0]){
		index = 0; //first range
	}else if(date>=brushContextNorRight.extent()[1]){
		index = count - 1;// rangesDomainFocus.length; //last range
	}
	return index;
}


/**
 * FOCUS Append areas
 * 
 * @param index
 * @returns
 */
function areaFocus(d, index,yCurrScale) {
	// Update each x axis in focus : Local, Distortion, Detailed
	
	/* NORMAL AREA */
	areaNormal = d3.svg.area()
			.interpolate(interpolateType)
			.defined(function(d) {
						let var1 = getTimeOffset(brushContextNorLeft.extent()[0], -stepTemporal, polarityTemporal);
						let var2 = getTimeOffset(brushContextNorLeft.extent()[1], stepTemporal, polarityTemporal);
						let var3 = getTimeOffset(brushContextNorRight.extent()[0], -stepTemporal, polarityTemporal);
						let var4 = getTimeOffset(brushContextNorRight.extent()[1], stepTemporal, polarityTemporal);

						let interpolationLeft1 = getTimeOffset(brushContextNorLeft.extent()[0],-1*stepTemporal,polarityTemporal);
						let interpolationLeft2 = getTimeOffset(brushContextNorLeft.extent()[1],-2*stepTemporal,polarityTemporal);
						let interpolationRight1 = getTimeOffset(brushContextNorRight.extent()[0],+3*stepTemporal,polarityTemporal);
						let interpolationRight2 = getTimeOffset(brushContextNorRight.extent()[1],+1*stepTemporal,polarityTemporal);
//						return d.date;
						if(interpolationLeft1 < dateMinRange && interpolationLeft2 < dateMinRange){
							return d.date >= (var3) && d.date <= (var4);
						}else if(interpolationRight1 > dateMaxRange && interpolationRight2 > dateMaxRange){
							return d.date >= (var1) && d.date <= (var2);
						} else{		
							return (d.date >= (var1) && d.date <= (var2))
							||     
							(d.date >= (var3) && d.date <= (var4))
							;
						}
					})	
					.x(function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date);})
					.y0(function(d) {return yCurrScale(d.y0);})
					.y1(function(d) {return yCurrScale(d.y0 + d.y);});

	/* LEFT DISTORTION */
	areaDistortionLeft = d3.svg.area()
				.interpolate(interpolateType)
				.defined(function(d) {
						
						let var1 = getTimeOffset(brushContextDisLeft.extent()[0], -stepTemporal,polarityTemporal);
						let var2 = getTimeOffset(brushContextDisLeft.extent()[1], stepTemporal,polarityTemporal);
						//
						let interpolationLeft1 = getTimeOffset(brushContextDisLeft.extent()[0],-2*stepTemporal,polarityTemporal);
						let interpolationLeft2 = getTimeOffset(brushContextDisLeft.extent()[1],-2*stepTemporal,polarityTemporal);
						
						if(interpolationLeft1 < dateMinRange && interpolationLeft2 < dateMinRange ){
							return false;
						}
						return d.date >= (var1) && d.date <= (var2)
					})
					.x(function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date);})
					.y0(function(d) {return yCurrScale(d.y0);})
					.y1(function(d) {return yCurrScale(d.y0 + d.y);});

	/* ZOOM */
	areaZoom = d3.svg.area() 
			.interpolate(interpolateType)
			.defined(function(d) {
				
				let var1 = getTimeOffset(brushContext.extent()[0],-stepTemporal,polarityTemporal);
				let var2 = getTimeOffset(brushContext.extent()[1],stepTemporal,polarityTemporal);
//				return d.date;
				return d.date >= (var1) && d.date <= (var2);
			})
			.x(function(d) { return scalesMultiresolution[selectAxisFocus(d.date)](d.date);})
			.y0(function(d) { return yCurrScale(d.y0);})
			.y1(function(d) { return yCurrScale(d.y0 + d.y);});

	/* RIGHT DISTORTION */
	areaDistortionRight = d3.svg.area()
			.interpolate(interpolateType)
			.defined(function(d) {
				let var1 = getTimeOffset(brushContextDisRight.extent()[0],-stepTemporal,polarityTemporal);
				let var2 = getTimeOffset(brushContextDisRight.extent()[1], stepTemporal,polarityTemporal);
				//
				let interpolationRight1 = getTimeOffset(brushContextDisRight.extent()[0],+4*stepTemporal,polarityTemporal);
				let interpolationRight2 = getTimeOffset(brushContextDisRight.extent()[1],+4*stepTemporal,polarityTemporal);
				
				if(interpolationRight1 >= dateMaxRange && interpolationRight2 >= dateMaxRange ){
					return false;
				}
				return d.date >= (var1) && d.date <= (var2);
			})
			.x(function(d) {return scalesMultiresolution[selectAxisFocus(d.date)](d.date);})
			.y0(function(d) {return yCurrScale(d.y0);})
			.y1(function(d) {return yCurrScale(d.y0 + d.y);});

	switch (index) {
		case 0:
//			return null;
			return areaNormal(d.values);
			break;
		case 1:
//			return null;
			return areaDistortionLeft(d.values);
			break;
		case 2:
//			return null;
			return areaDistortionRight(d.values);
			break;
		case 3:
			return areaZoom(d.values);
			break;
	}
}

/**
 * CONTEXT Calcule each interval in brushExtent
 * 
 * @param brushExtent
 * @param index
 * @returns {Array}
 */
function calculeExtent(brushExtent, index) {
	let extent = [];
	let d0 = getTimeOffset(brushExtent[0], index * stepTemporal, polarityTemporal);
	let d1 = getTimeOffset(brushExtent[0], index * stepTemporal + stepTemporal, polarityTemporal);
	
	extent = [d0, d1]
	return extent;
}


function ratonOutMultiresolutionView(){

	tooltipFlag = new Date();

	let styles = {
		"opacity":0,
		"display":"none"
	};

	verticalRulerTopBackground.style(styles);
	verticalRulerTop.style(styles);

	verticalRulerBottomBackground.style(styles);
	verticalRulerBottom.style(styles);

	tooltip.style(styles);
	tooltipEvents.style(styles);

	d3.select("#multiresolutionBackground").attr("class","background");
	d3.select("#multiresolutionBackground-bottom").attr("class","background");
}


function brushStart(){
	ratonOutMultiresolutionView();
	blocage = true;
}


function brushEnd(){
	ratonOutMultiresolutionView();
	blocage = false;
	if (!animation) {
		let calcule = calculateRangeFocus(optsMultistream.facteurNor, optsMultistream.facteurDis, optsMultistream.facteurZoom);
		totalito(calcule);
	}
}


function updateScaleDomainRangeBrushContext(barZoomLeft,barZoomRight,barNorLeft,barDisLeft,barDisRight,barNorRight){

	//get domain and range
	/* NorLeft */
	xScaleContextNorLeft.range([ 0, xScaleContext(barDisLeft) ])//px
											.domain([ dateMinRange, barDisLeft ]);//dates

	/* DisLeft */
	xScaleContextDisLeft.range([xScaleContext(barNorLeft), xScaleContext(barZoomLeft)])
											.domain([barNorLeft, barZoomLeft]);

	/* DisRight */
	xScaleContextDisRight.range([ xScaleContext(barZoomRight), xScaleContext(barNorRight)]) //px
												.domain([ barZoomRight, barNorRight ]); //dates
	
	/* NorRight */
	xScaleContextNorRight.range([ xScaleContext(barDisRight), widthIntern ])
												.domain([ barDisRight, dateMaxRange ]);										

	//get extent
	brushContext.extent([barZoomLeft,barZoomRight]);
	brushContextNorRight.extent([barDisRight, barNorRight]);
	brushContextDisRight.extent([barZoomRight,barDisRight]);
	brushContextNorLeft.extent([barNorLeft, barDisLeft]);
	brushContextDisLeft.extent([barDisLeft,barZoomLeft]);

	context.select(".brushNorLeft").call(brushContextNorLeft);
	context.select(".brushDisLeft").call(brushContextDisLeft);
	context.select(".brushZoom").call(brushContext);
	context.select(".brushDisRight").call(brushContextDisRight);
	context.select(".brushNorRight").call(brushContextNorRight);


	//FLAG TO IMPROVE UPDATE TIME
	brushContextFlag = brushContext.extent();
	brushContextNorLeftFlag = brushContextNorLeft.extent();
	brushContextNorRightFlag = brushContextNorRight.extent();
	brushContextDisLeftFlag = brushContextDisLeft.extent();
	brushContextDisRightFlag = brushContextDisRight.extent();

	beginValidation();

}

function updateLocked(stateLockedLeft, stateLockedRight){

	lockedLeft = stateLockedLeft;
	lockedRight = stateLockedRight;

	document.getElementById("candadoLeft").classList.remove("consin")
	document.getElementById("candadoRight").classList.remove("consin")

	//UPDATE CANDADOS
	if(lockedLeft){
		candadoLeft.attr('xlink:href',pathCandadoClose);
		document.getElementById("candadoLeft").classList.add("consin");
	}else{
		candadoLeft.attr('xlink:href',pathCandadoOpen);
	}
	if(lockedRight){
		candadoRight.attr('xlink:href',pathCandadoClose);
		document.getElementById("candadoRight").classList.add("consin");
	}else{
		candadoRight.attr('xlink:href',pathCandadoOpen);
	}

}


function updateOffsetType(stateOffsetType){

	document.getElementById("silhouette").classList.remove("active")
	document.getElementById("zero").classList.remove("active")

	offsetType = stateOffsetType;
	stack.offset(offsetType);
	if(offsetType==="silhouette"){
		document.getElementById("silhouette").classList.add("active");
	}
	if(offsetType==="zero"){
		document.getElementById("zero").classList.add("active");
	}
}


function InitBarPositionBrushInContext(){

	let barZoomLeft;
	let barZoomRight;
	let barNorLeft;
	let barDisLeft;
	let barDisRight;
	let barNorRight;

	if(optsContext.timeIntervalBrushZoom.length == 0 
		&& optsContext.timeIntervalBrushNormalLeft.length==0
		&& optsContext.timeIntervalBrushNormalRight.length ==0
		&& optsContext.timeIntervalBrushDistortionLeft.length ==0
		&& optsContext.timeIntervalBrushDistortionRight.length ==0){
		
		//Getting Averange date depends of stepTemporal
		let indexDateAveRange = Math.round(timeWindow.length/2);
		
		//Colors bars position in scale
		let timeStepUntilZoomLeft = indexDateAveRange - numTimeStepBrushZoom;
		let timeStepUntilZoomRight = indexDateAveRange + numTimeStepBrushZoom;
		let timeStepUntilDisLeft = timeStepUntilZoomLeft - numTimeStepBrushDistortion;
		let timeStepUntilNorLeft = timeStepUntilDisLeft - numTimeStepBrushNormal;
		let timeStepUntilDisRight = timeStepUntilZoomRight + numTimeStepBrushDistortion;
		let timeStepUntilNorRight = timeStepUntilDisRight + numTimeStepBrushNormal;

		//
		barZoomLeft = timeWindow[timeStepUntilZoomLeft];
		barZoomRight = timeWindow[timeStepUntilZoomRight];
		barNorLeft = timeWindow[timeStepUntilNorLeft];
		barDisLeft = timeWindow[timeStepUntilDisLeft];
		barDisRight = timeWindow[timeStepUntilDisRight];
		barNorRight = timeWindow[timeStepUntilNorRight];
		
	}else{
		barZoomLeft = new Date(optsContext.timeIntervalBrushZoom[0]);
		barZoomRight = new Date(optsContext.timeIntervalBrushZoom[1]);
		barNorLeft = new Date(optsContext.timeIntervalBrushNormalLeft[0]);
		barDisLeft = new Date(optsContext.timeIntervalBrushDistortionLeft[0]);
		barDisRight = new Date(optsContext.timeIntervalBrushDistortionRight[1]);
		barNorRight = new Date(optsContext.timeIntervalBrushNormalRight[1]);
	}


	updateScaleDomainRangeBrushContext(barZoomLeft,barZoomRight,barNorLeft,barDisLeft,barDisRight,barNorRight);


}


function createBrushInContext(){

	brushContext.x(xScaleContext)
							.on("brushstart",brushStart)
							// .on("brush",()=>{
							// 	!isFlowBloqued?brushContextMove(brushContext.extent()):backContext();
							// })
							.on("brush",()=>{
								brushContextMove(brushContext.extent());
							})
							.on("brushend", brushEnd);			

	//NorRight
	brushContextNorRight.x(xScaleContextNorRight)
											.on("brushstart", brushStart)
											.on("brush", brushContextNorRightMove)
											.on("brushend", brushEnd);
					

	//DisRight
	brushContextDisRight.x(xScaleContextDisRight)
											.on("brushstart", brushStart)
											.on("brush", brushContextDisRightMove)
											.on("brushend", brushEnd);

	//////////////////

	
	//NorLeft
	brushContextNorLeft.x(xScaleContextNorLeft)
											.on("brushstart", brushStart)
											.on("brush", brushContextNorLeftMove)
											.on("brushend", brushEnd);
	
	
	//DisLeft
	brushContextDisLeft.x(xScaleContextDisLeft)
											.on("brushstart", brushStart) // click down
											.on("brush", brushContextDisLeftMove) // move
											.on("brushend", brushEnd); // 
		




}


function validatorBrushes(){

	let limitNorLeft = brushContextNorLeft.extent()[0];
	let limitDisLeft = brushContextDisLeft.extent()[0];
	let limitZoomLeft = brushContext.extent()[0];
	let limitZoomRight = brushContext.extent()[1];
	let limitDisRight = brushContextDisRight.extent()[1];
	let limitNorRight = brushContextNorRight.extent()[1];

	let timeWindowInFocus = getTimeWindow(limitZoomLeft, limitZoomRight, polarityTemporal,stepTemporal);
	
	if(timeWindowInFocus.length >0 
		&& limitNorLeft<limitDisLeft 
		&& limitDisLeft<limitZoomLeft 
		&& limitZoomRight<limitDisRight
		&& limitDisRight<limitNorRight){
			return true;
		}

	return false;
}

// function moveContextByKeyboard(cuantosPasosTemporal, blockLeft, blockRight){

// 	let currLeftTimeStep = brushContext.extent()[0];
// 	let newTimeExtentLeft = blockLeft? currLeftTimeStep : getNewTimeStep(currLeftTimeStep,cuantosPasosTemporal);
	
// 	let currRightTimeStep = brushContext.extent()[1];
// 	let newTimeExtentRight = blockRight? currRightTimeStep : getNewTimeStep(currRightTimeStep,cuantosPasosTemporal);

// 	brushContextMove([newTimeExtentLeft,newTimeExtentRight]);
// 	brushEnd();
// }

function getNewTimeStep(aTimeStep,howManySteps){
	return getTimeOffset(aTimeStep,howManySteps*stepTemporal,polarityTemporal);
}


