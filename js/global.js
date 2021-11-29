var jerarquiaOutflow;
var jerarquiaInflow;

var key_focus_list_outflow = [];
var key_context_list_outflow = [];
var nivel_focus_outflow = [];
var nivel_context_outflow = [];


var key_focus_list_inflow = [];
var key_context_list_inflow = [];
var nivel_focus_inflow = [];
var nivel_context_inflow = [];


var legend_y_outflow = "outflow";
var sub_legend_y_outflow = "num. of refugees leaving";
var dataType_outflow = "leaving";
var leyend_y_inflow = "inflow";
var sub_leyend_y_inflow = "num. of refugees entering";
var dataType_inflow = "entering";

var arraySubIndicators = [0];

var t = d3.transition();
var customNumberFormat = d3.format(".2s");
//  d3.format(".2s");

	



var customTimeFormatTitle = d3.time.format.multi([
	["%I:%M", function(d) { return d.getMinutes(); }],
	["%I %p", function(d) { return d.getHours(); }],
	["%a %d %b", function(d) { return d.getDay() && d.getDate() != 1; }],
	["%b %d", function(d) { return d.getDate() != 1; }],
	["%B", function(d) { return d.getMonth(); }],
	["%Y", function() { return true; }]
  ]);
					
var customTimeFormat = d3.time.format.multi([
  [".%L", function(d) { return d.getMilliseconds(); }],
  [":%S", function(d) { return d.getSeconds(); }],
  ["%I:%M", function(d) { return d.getMinutes(); }],
  ["%I %p", function(d) { return d.getHours(); }],
  ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
  ["%b %d", function(d) { return d.getDate() != 1; }],
  ["%B", function(d) { return d.getMonth(); }],
  ["%Y", function() { return true; }]
]);					



// VAR GLOBALES
//General
var log;
var title;
var dataType;
var durationTransition;
//Multistream
var polarityTemporal;
var stepTemporal;
var animation;
var interpolateType;
var orderType;
//Multiresolution
var layersFadingColorsFactor;
var layersBorderlineColor;
var layersOpacitySelected;
var layersOpacityNotSelected;
var layersOutputRangeLabelScale;
var layersLabelType;
//Context
var numTimeStepBrushZoom;
var numTimeStepBrushDistortion;
var numTimeStepBrushNormal;
//DATA POINT DETECTION
var pointEventDetections = [];
//Map
var outputRangeColorScaleMap;
var featuresOutputRangeLabelScale;
var typeMapVisualization;
var showMapArrow = true;
let projectionMap = d3.geo.equirectangular() ////mercator();
						.scale(200)
						.center([0, 0])
						.translate([mapVisWidth / 2, mapVisHeight / 2]);

var pathMap = d3.geo.path()
					.projection(projectionMap);
					
var durationTransitionTS = 1000; //Multistream Time Series
var durationTransitionMap = 750; //alwas < than durationTransitionTS
//FLOWMAP
var pointRadiusBackground = 10;
var pointRadius = 7;
// var fmLineExtent = [1,8]; //line extend of the flowmap
var fmArrowHeight = 9; 
var fmArrowWidth = 9;

//BARCHART
let topKBarchart = 5;

//Tree

//Events
var eventWidthSizeLabelScale;
var eventHeightSizeLabelScale;



//OPTS
var optsGeneral;
var optsMultistream;
var optsMultiresolution;
var optsContext;
var optsEvents;
var optsMap;
var optsTree;

// Configuration List
var confList = [];






var timeWindow;
//userd in multistream text label and map land label
var text_font_family = "Roboto";
var nameFilter="";

// =========================
// TREE
var hierarchyOrigen;
var hierarchyDestino;
var root_key = "R0";
var root_color = "#a65628";
var color_begin_range = "white";
var num_initial_color;
var color_range_children;
var num_leaf_children;
var node_radius = 10; // px
var node_gap = 5;//20; // px
var tree = d3.layout.tree();

///
var geoJson;

// ==========================
// MULTIRESOLUTION
var dataset;
var leaf_level;
var dateExtRange; 
var dateMinRange; 
var dateMaxRange; 
var countries;

// ==========================
//MAP
var land_label_font_size = 12; //the same in the style-map.css (.land-label)

// ==========================
// LOG
var timerStart;




function setNumChildrenLeaf(d){
	if(d.children){
		d.children.forEach(setNumChildrenLeaf);
	}else{
		num_leaf_children ++;
	}
}

function addingKeyNuevo(d,index){

	d.name = d.name.toLowerCase();
	d.key =  d.parent.key + "_" + index;
	
	let child_index;

	if(d.depth == 1){
		num_initial_color < 5 ? color_root = colores_d3(index) : color_root = colores_brewer(index);
		if(!d.color)
		d.color = chroma(color_root).desaturate().brighten(0.4);
		num_leaf_children = 0;
		child_index = 0;
		setNumChildrenLeaf(d);

		let color_finish_range = chroma(color_root).saturate().darken();

		if(num_leaf_children>10){
			num_leaf_children = num_leaf_children+3;
		}else{
			num_leaf_children = num_leaf_children+1;
		}
		color_range_children =  chroma.scale([color_begin_range,color_finish_range]).colors(num_leaf_children);
		
	}
	if(d.children){
	    d.children.forEach(addingKeyNuevo,index);
	}else{
		child_index = --num_leaf_children;
		if(!d.color)
		d.color = color_range_children[child_index];
		d.visible = true;

		if(!d.img)
		d.img = "";
	}
}

function formatDate(date) {
	return date.getFullYear() + '/' + 
	  (date.getMonth() + 1) + '/' + 
	  date.getDate() + ' ' + 
	  '00:00:00';
  }

function preProcessingRawData(rawData){
	rawData.inflows.forEach(function(d){
		d.date = new Date(formatDate(new Date(d.date)))
	});
	rawData.outflows.forEach(function(d){
		d.date = new Date(formatDate(new Date(d.date)))
	});
}

// Preprocessinf of the GeoJson file
function preProcessingGeoJSON(geoJson){
	geoJson.features.forEach(function(d){
		d.properties.name = d.properties.name.toLowerCase();
		d.centroid = pathMap.centroid(getGeoJsonElementBiggestCoordinate(d));
		d.value = 0;
	});
}


function preProcessingHierarchyColors(jerarquiaInstance){
	// BUILDING leaf_level for superior levels
	jerarquiaInstance.forEach(function(node){
		if(node.children){
			if(!node.color){
				if(node.children.length == 1){
					node.color = node.children[0].color;
				}else{
					for(var i=0;i<node.children.length-1;i++){
						node.color = chroma.blend(node.children[i].color, node.children[(i+1)].color, 'darken');	
					}
				}
			}
		}
	});
}

function initOpts(init){

	//General
	log = init.optsGeneral.log;
	title = init.optsGeneral.title;
	dataType = init.optsGeneral.dataType;
	durationTransition = init.optsGeneral.durationTransition;
	//Multistream
	polarityTemporal = init.optsMultistream.polarityTemporal;
	stepTemporal = init.optsMultistream.stepTemporal;
	animation = init.optsMultistream.animation;
	interpolateType = init.optsMultistream.interpolateType;
	orderType = init.optsMultistream.orderType;
	//Multiresolution
	layersFadingColorsFactor = init.optsMultistream.optsMultiresolution.layersFadingColorsFactor;
	layersBorderlineColor = init.optsMultistream.optsMultiresolution.layersBorderlineColor;
	layersOpacitySelected = init.optsMultistream.optsMultiresolution.layersOpacitySelected;
	layersOpacityNotSelected = init.optsMultistream.optsMultiresolution.layersOpacityNotSelected;
	layersOutputRangeLabelScale = init.optsMultistream.optsMultiresolution.layersOutputRangeLabelScale;
	layersLabelType = init.optsMultistream.optsMultiresolution.layersLabelType;
	//Context
	numTimeStepBrushZoom = init.optsMultistream.optsContext.numTimeStepBrushZoom;
	numTimeStepBrushDistortion = init.optsMultistream.optsContext.numTimeStepBrushDistortion;
	numTimeStepBrushNormal = init.optsMultistream.optsContext.numTimeStepBrushNormal;

	//Map
	outputRangeColorScaleMap = init.optsMap.outputRangeColorScaleMap;
	featuresOutputRangeLabelScale = init.optsMap.featuresOutputRangeLabelScale;
	typeMapVisualization = init.optsMap.typeMapVisualization;

	//Tree

	//Events
	eventWidthSizeLabelScale = init.optsEvents.eventWidthSizeLabelScale;
	eventHeightSizeLabelScale = init.optsEvents.eventHeightSizeLabelScale;
}

function initOptsVariables(list){
	list.forEach(item=>{
		if(item.optsGeneral.active){
			//LOAD OPTS
			optsGeneral = item.optsGeneral;
			optsMultistream = item.optsMultistream;
			optsMultiresolution = item.optsMultistream.optsMultiresolution;
			optsContext = item.optsMultistream.optsContext;
			optsEvents = item.optsEvents;
			optsMap = item.optsMap;
			optsTree = item.optsTree;
		}
	});

}

function ready(error, rawHierarchy, rawGeoJson, rawData, rawConfiguration){

	if (error){
		alert(error);
		setLoader(false);
		throw error;
	}

	dataset = [];
	geoJson = rawGeoJson;
	leaf_level = [];
	hierarchyOrigen = [];
	hierarchyDestino = [];
	color_range_children = [];
	//
	//
	d3.select("#svg-map-vis").selectAll("g").remove();
	removeElement("tooltip-map");
	//
	d3.select("#svg-tree-vis").selectAll("g").remove();
	removeElement("tooltip-tree");
	//
	d3.select("#svg-multiresolution-vis").selectAll("g").remove();
	removeElement("tooltip-flow");

	//PREPROCESSING
	preProcessingRawData(rawData);
	preProcessingGeoJSON(rawGeoJson);
	

	//INIT OPTS
	initOpts(rawConfiguration.init);

	//OPTS VARIABLES
	initOptsVariables(rawConfiguration.list);
	
	// BUILDING categories. Match rawGeoJson and entity in rawData
	timerStart = Date.now();
	let categoriesIntoGeoJson = rawGeoJson.features.map(d=>d.properties.name);

	let categoriesOriginRawData = d3.nest().key(function(d) {return d;}).entries(rawData.outflows.map(d=>d.category)).map(d=>d.key);
	let categoriesDestinationRawData = d3.nest().key(function(d) {return d;}).entries(rawData.inflows.map(d=>d.category)).map(d=>d.key);

	let categoriesIntoRawData = d3.nest().key(function(d) {return d;}).entries(categoriesOriginRawData.concat(categoriesDestinationRawData)).map(d=>d.key);

	
	//RAWDATA == GEOJSON == HIERARCHY COUNTRIES

	countries = categoriesIntoRawData.filter(function(entity){
											if(categoriesIntoGeoJson.indexOf(entity)!=-1){
												return entity;
											}else{
												console.log("Exist in RAW data but not in the GeoJson:",entity);
											}
										});
	
	printLog(timerStart, "getting categories");

	// =======================================================================
	// BUILDING hierachy
	// setting the tree height according the number of leaves and the node
	// radius
	timerStart = Date.now();
	let node_diameter = node_radius*2;
	treeVisHeight = (countries.length * node_diameter) + (countries.length * node_gap);

	tree.size([treeVisHeight - gapWindowsTop, treeVisWidth]); // width
	// tree.nodes adds: children, depth, name, x, y
	hierarchyOrigen = tree.nodes(rawHierarchy.ranges).reverse();// array of objects
	hierarchyOrigen[hierarchyOrigen.length-1].key = root_key;
	hierarchyOrigen[hierarchyOrigen.length-1].color = root_color;
	num_initial_color = 6; //getNodesByDepth(1).length;
	// hierarchyOrigen[hierarchyOrigen.length-1].children.reverse().forEach(addingKey);
	hierarchyOrigen[hierarchyOrigen.length-1].children.reverse().forEach((curr,index)=>{
		addingKeyNuevo(curr,index);
	});

	preProcessingHierarchyColors(hierarchyOrigen);
// 
	hierarchyDestino = hierarchyOrigen; // tree.nodes(rawHierarchy.ranges).reverse();// array of objects
	// hierarchyDestino[hierarchyDestino.length-1].children.forEach((curr,index)=>{
	// 	addingKeyNuevo(curr,index);
	// });

	
	printLog(timerStart, "getting hierarchy");

	hierarchyOrigen.forEach(function(node){
		node.level = "";
		node.visible = false;
	});

	// =======================================================================
	// BUILDING dataset
	timerStart = Date.now();
	let yearsExtent = d3.extent(rawData.inflows,d=>d.date);
	
	var start = new Date(yearsExtent[0]);
	var stop = getTimeOffset(new Date(yearsExtent[1]), 2*stepTemporal, polarityTemporal);
	timeWindow = getTimeWindow(start,stop,polarityTemporal,stepTemporal);


	dateExtRange = d3.extent(timeWindow); // max and min date
	dateMinRange = dateExtRange[0]; // min date
	dateMaxRange = dateExtRange[1]; // max date

	jerarquiaOutflow = new Jerarquia(hierarchyOrigen);
	jerarquiaOutflow.my_leaf_level = rawData.outflows;
	// jerarquiaOutflow.setBottomNodes(jerarquiaOutflow.getLeafNodes());
	// jerarquiaOutflow.setTopNodes(jerarquiaOutflow.getNodesByDepth(1));
	
	//name:"",visible:true
	jerarquiaOutflow.setBottomNodes(jerarquiaOutflow.getNodesByDepth(2).map(d=>{return {"name":d,"visible":true};}));
	jerarquiaOutflow.setTopNodes(jerarquiaOutflow.getNodesByDepth(0).map(d=>{return {"name":d,"visible":true};}));
		

	nivel_focus_outflow = jerarquiaOutflow.hijos();
	key_focus_list_outflow = jerarquiaOutflow.key_bottom_list;
		
	nivel_context_outflow = jerarquiaOutflow.papa();
	key_context_list_outflow = jerarquiaOutflow.key_top_list;

	//-------------------------------

	jerarquiaInflow = new Jerarquia(hierarchyDestino);
	jerarquiaInflow.my_leaf_level = rawData.inflows; 
	// jerarquiaInflow.setBottomNodes(jerarquiaInflow.getLeafNodes());
	// jerarquiaInflow.setTopNodes(jerarquiaInflow.getNodesByDepth(1));
	jerarquiaInflow.setBottomNodes(jerarquiaInflow.getNodesByDepth(2).map(d=>{return {"name":d,"visible":true};}));
	jerarquiaInflow.setTopNodes(jerarquiaInflow.getNodesByDepth(0).map(d=>{return {"name":d,"visible":true};}));

	nivel_focus_inflow = jerarquiaInflow.hijos();
	key_focus_list_inflow = jerarquiaInflow.key_bottom_list;
	

	nivel_context_inflow = jerarquiaInflow.papa();
	key_context_list_inflow = jerarquiaInflow.key_top_list;

	// Loading VIS 
	loadMultiresolutionVis();
	loadTreeVis();
	loadMapVis(rawGeoJson);
	//

	setLoader(false);
}

function setLoader(display){
	if(display){
		document.getElementById("overlay").style.display = "block";
		document.getElementById("loader").style.display = "block";
		document.getElementById("vistas").setAttribute( 'style', 'opacity: 0 !important' );
	}else{
		document.getElementById("loader").style.display = "none";
		document.getElementById("overlay").style.display = "none";
		document.getElementById("vistas").setAttribute( 'style', 'opacity: 1 !important' );
	}
}



function assignGlobalVariablesFromOpts(config){
	// console.log('config',config)
	updateConfigTree(config.optsTree);

	updateConfigMultistream(config.optsMultistream);
	
	updateConfigMap(config.optsMap);
}

function updateConfigTree(optsTree){
		// "key_focus_list_outflow":key_focus_list_outflow,
		// "key_context_list_outflow":key_context_list_outflow,
		// "key_focus_list_inflow":key_focus_list_inflow,
		// "key_context_list_inflow":key_context_list_inflow
	updateHierarchy(optsTree.key_focus_list_outflow,optsTree.key_context_list_outflow,optsTree.key_focus_list_inflow,optsTree.key_context_list_inflow);
}

function updateConfigMap(optsMap){
	updateScaleTranslate(optsMap.scale,optsMap.translate);
}

function updateConfigMultistream(optsMultistream){

	console.log(optsMultistream.optsContext.timeIntervalBrushNormalLeft[0])

	barZoomLeft = new Date(optsMultistream.optsContext.timeIntervalBrushZoom[0]);
	barZoomRight = new Date(optsMultistream.optsContext.timeIntervalBrushZoom[1]);
	barNorLeft = new Date(optsMultistream.optsContext.timeIntervalBrushNormalLeft[0]);
	barDisLeft = new Date(optsMultistream.optsContext.timeIntervalBrushDistortionLeft[0]);
	barDisRight = new Date(optsMultistream.optsContext.timeIntervalBrushDistortionRight[1]);
	barNorRight = new Date(optsMultistream.optsContext.timeIntervalBrushNormalRight[1]);

	updateScaleDomainRangeBrushContext(barZoomLeft,barZoomRight,barNorLeft,barDisLeft,barDisRight,barNorRight);

	updateLocked(optsMultistream.optsContext.blockedBrushNormalLeft,optsMultistream.optsContext.blockedBrushNormalRight);

	updateOffsetType(optsMultistream.offsetType);

	let calcule = calculateRangeFocus(optsMultistream.facteurNor, optsMultistream.facteurDis, optsMultistream.facteurZoom);
	totalito(calcule);

	updateFlows();
	
}


function groupComponentTypeByName(arrayComponents){
	var agrouped = arrayComponents.reduce(function (acc, obj) {
		var cle = obj["name"];
		if(!acc[cle]){
			acc[cle] = [];
		}
		acc[cle].push(obj);
		return acc;
	}, {});
	
	var result = Object.values(agrouped).map(function(groupedElements){
		if(groupedElements.length==1){
			return groupedElements[0];	
		}else{
			
			// agroupar los arrays en groupedElements
			let tmp = [];
			groupedElements.forEach(function(d){
				d.arraray.forEach(function(ray){
					tmp.push(ray)
				});
			});
			// console.log(tmp)
			let groupeArraray = tmp.reduce(function (acc, obj) {
				let cle = obj.item;
				if(!acc[cle]){
					acc[cle] = [];
				}
				acc[cle].push(obj);
				return acc;
			}, {});
			let types = Object.values(groupeArraray).map(function(gg){
				return{
					"item":gg[0].item,
					"value": gg.reduce(function (acc, curr) {
						return acc + curr.value;
					}, 0)
				};
			});

			return {
				// "type":groupedElements[0].type,
				// "id":groupedElements[0].ide,
				// "properties":groupedElements[0].properties,
				// "geometry":groupedElements[0].geometry,
				// "value":0,
				"name":groupedElements[0].name,
				"arraray":types
			};
		}
	});
	
	// console.log("array",result["arraray"])
	return result;
}

function groupIndicatorByName(arrayIndicators){

	var agrouped = arrayIndicators.reduce(function (acc, obj) {
		var cle = obj.indicator;
		if(!acc[cle]){
			acc[cle] = [];
		}
		acc[cle].push(obj);
		return acc;
	}, {});
	
	var result = Object.values(agrouped).map(function(element){
		if(element.length==1){
			return element[0];	
		}else{	
			let tmp = [];
			element.forEach(function(d){
	 			d.components.forEach(function(elem){
					tmp.push(elem);
	 			});
	 		});
	 		
			let nameIndicator = element[0].indicator;
			let componentIndicator = groupComponentTypeByName(tmp);
			
			//
			return {
				"indicator": nameIndicator,
				"components":componentIndicator
			};
		}
	});

	return result;
}

//Indicator : inflow, outflow
function fusionValuesByIndicator(arrayObjets){
	var tmp = [];
	arrayObjets.forEach(function(d){
		d.indicators.forEach(function(indicator){
			//indicator = inflow,
			tmp.push(indicator);
		});
	});
	return groupIndicatorByName(tmp);
}

function load_d3(configurationPathFile) {

	setLoader(true);

	setTimeout(function(){ 
		
		// FILES PATHS
		// let source_path = "source/travels/"
		let source_path = "source/refugees/"

		let myGeoJSONPath = source_path+"geojson.json";
		let myHierarchyJSONPath = source_path+"hierarchy.json";
		let myRawDataPath = source_path+"data.json";
		if(configurationPathFile==null){
			myConfiguration = source_path+"config.json";
		}else{
			myConfiguration = configurationPathFile;
		}

		d3.queue(4)
			.defer(d3.json,myHierarchyJSONPath)
			.defer(d3.json,myGeoJSONPath)
			.defer(d3.json,myRawDataPath)
			.defer(d3.json,myConfiguration)
			.await(ready);
		
	},50);
	
}

function getHijosFromPadreId(idPadre, hijosTagName) {
	let padre = document.getElementById(idPadre);

	let hijos = padre.getElementsByTagName(hijosTagName);

	let ary = [];
	for(let i = 0; i<hijos.length;i++){
		let currElem = hijos[i];
		if (currElem.classList.contains("active")) {
			ary.push(currElem);
		}
	}
	return ary;
}

function colores_brewer(n){
	var colors = [
		"#ff7f00" // orange
		,"#984ea3" // purple
		,"#e41a1c" // red
		,"#377eb8" // blue
		,"#ffff33" // jaune			
		,"#4daf4a" // green
		,"#a65628"
		,"#f781bf"
	]
	// var colors = [
	// 				"#ffff33" // jaune			
	// 				,"#377eb8" // blue
	// 				,"#e41a1c" // red
	// 				,"#984ea3" // purple
	// 				,"#ff7f00" // orange
	// 				,"#4daf4a" // green
	// 				,"#a65628"
	// 				,"#f781bf"
	// 			]
	
	return colors[n % colors.length];
}

var colores_d3 =  d3.scale.category10(); 