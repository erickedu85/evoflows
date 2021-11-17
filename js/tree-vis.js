var opts_tree = {
	hDepth : 110, //90 
	wraps : 45,
	transition_links_duration : 500,
	strokeWidthNodeSelected : 2.3,
	strokeWidthNodeDeselected : 1
};

var margin = {top: 0, right: 60, bottom: 0, left: 90},
    height = 0 - margin.top - margin.bottom;

var diagonal = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });

var i = 0;
var root;
var svg_tree_vis;
var tooltip_tree;
var nodes;
var links;
var linkNivelTop=[];
var linkNivelBottom=[];
var svg_vrai;

function loadTreeVis(){
	
	svg_vrai = d3.select("#svg-tree-vis")
				    .attr("width", treeVisWidth)
					.attr("height", treeVisHeight);
	
//	svg_vrai.attr('viewBox', '0 0 ' +  ( treeVisWidth) + ' ' 
//										+ ( treeVisHeight) )
//							.attr('height', treeVisHeight)
//							.attr('width', '100%')
//							.attr('preserveAspectRatio', 'none')
	
	svg_tree_vis = svg_vrai.append("g")
				    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
							
	
//	d3.select("#tree-vis")
//    .call(d3.behavior.zoom()
//      .scaleExtent([0.5, 5])
//      .on("zoom", zoom));
	root = jerarquiaOutflow.hierarchy; //hierarchy[0] => root
	root.x0 = 0;
	root.y0 = 0;

	update(root);
	
	tooltip_tree = d3.select("body").append("div")
							.attr("id","tooltip-tree")
							// .attr("class", "tooltip")
							// .style({
							// 	"opacity":0,
							// 	"display":"none"
							// });

	
}

function zoom() {
	svg_tree_vis.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function update(source) {

  // Compute the new tree layout.
  nodes = jerarquiaOutflow.hierarchy; // tree.nodes(root);
  links = tree.links(nodes);
  
  d3.select("#svg-tree-vis").on("mousemove",treeVisMove);
  
  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * opts_tree.hDepth;  });

  // Update the nodes…
  var node = svg_tree_vis.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });
  
  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
					.attr("id",function(d){return d.key;})
					.attr("class", "node")
					.attr("transform", function(d) {  return "translate(" + source.y0 + "," + source.x0 + ")"; });
  
  nodeEnter.append("circle")
			      .attr("r",node_radius)
			      .on("click", nodeClick)
			      .on("mouseover", function(d){
			    	  nodeOver(this,d);
			      })
			      .style({
			    	  "fill": function(d) { return d.visible ? d.color : "white";},
			    	  "stroke": "grey",
			    	  "stroke-width": opts_tree.strokeWidthNodeDeselected
			      });

  nodeEnter.append("text")
		      .attr("x", function(d) { return d.children || d._children ? -15 : 15; })
		      .attr("dy", ".35em")
		      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
		      .text(function (d) { return d.name;})
		      .call(wrap, 50)
		      .style("fill-opacity", 1);
  
  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
			      .duration(durationTransition)
			      .attr("transform", function(d) {
			    	  return "translate(" + d.y + "," + d.x + ")"; 
			    	  });
//  					.attr("transform", function(d) {return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
		      .attr("r", node_radius)
		      .style({
		    	  "fill": function(d) { return d.visible ? d.color : "white";},
		    	  "stroke": "grey",
		    	  "stroke-width": opts_tree.strokeWidthNodeDeselected
		      });

  
  nodeUpdate.select("text")
      		.style("fill-opacity", 1);
  
  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(durationTransition)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg_tree_vis.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(durationTransition)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(durationTransition)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y
		};
		return diagonal({
			source : o,
			target : o
		});
	}).remove();

	// Stash the old positions for transition.
	nodes.forEach(function(d) {
		d.x0 = d.x;
		d.y0 = d.y;
	});
	
	
  // Adding Top and Bottom line Hierarchy
  lineTopAndBottomHierarchy(links);
}

function nodeOver(t, d){
	var k = d3.select(t);
	if(d.level == ""){
		k.style("cursor", "default")
	}else{
		k.style("cursor", "pointer")
	}
}

function nodeOut(){
	// ratonOutFlow();
	// ratonOutTree();
	tooltip_tree.html("").style({"opacity":0});
}

function fillTopBottomArray(links){

	var nivelTop = [];
	var nivelBottom = [];
	
	links.forEach(function(element){
		var source = element.source;
		var target = element.target;

		// top
		if(source.level == "top"){
			var contains = nivelTop.find( function( ele ) { 
			    return ele.key == source.key;
			} );
			if(!contains){
				nivelTop.push({
					"depth" : source.depth,
					"name" : source.name,
					"level" : source.level,
					"key" : source.key,
					"x" : source.x,
					"y" : source.y,
					"visible" : source.visible
				})	
			}
		}
		
		//bottom
		if(target.level == "bottom"){
			var contains = nivelBottom.find( function( ele ) { 
				// return ele.key == source.key;
				return ele.key == target.key;
			} );
			if(!contains){
				nivelBottom.push({
					"depth" : target.depth,
					"name" : target.name,
					"level" : target.level,
					"key" : target.key,
					"x" : target.x,
					"y" : target.y,
					"visible" : target.visible
				})	
			}
		}
	})
	
	nivelBottom.sort(function (a, b) {
		  if (a.x > b.x) {
			    return 1;
			  }
			  if (a.x < b.x) {
			    return -1;
			  }
			  return 0;
			});
	
	
	linkNivelTop=[];
	linkNivelBottom=[];
	
	for(var i = 0; i < nivelTop.length-1; i++){
		var s = nivelTop[i];
		var t = nivelTop[(i+1)];
		linkNivelTop.push({
					"key":t.key,
					"x1":s.x,
					"y1":s.y,
					"x2":t.x,
					"y2":t.y
				})
	}
	
	for(var i = 0; i < nivelBottom.length-1; i++){
		var s = nivelBottom[i];
		var t = nivelBottom[(i+1)];
		
		linkNivelBottom.push({
					"key":t.key,
					"x1":s.x,
					"y1":s.y,
					"x2":t.x,
					"y2":t.y
				})
	}

}

function lineTopAndBottomHierarchy(links){
	
	//LINKS ARE RELATED TO THE HIERARCHY
	fillTopBottomArray(links);

	var topH;
	if(linkNivelTop.length == 0){
		//its root level
		var hierarchy_node = jerarquiaOutflow.getNodeByKey(root_key);
		var x1 = hierarchy_node.x - (3*node_radius);
		var y1 = hierarchy_node.y;
		var x2 = hierarchy_node.x + (3*node_radius) ;
		var y2 = hierarchy_node.y;
		var nivel_root = [{"key":root_key,"x1":x1,"y1":y1,"x2":x2,"y2":y2}];
		topH = svg_tree_vis.selectAll(".lineTopHierarchy").data(nivel_root,function(d) { return d.key; });
	}else{
		topH = svg_tree_vis.selectAll(".lineTopHierarchy").data(linkNivelTop,function(d) { return d.key; });
	}	
		
	//update
	topH.transition()
					.duration(durationTransition)
						.attr("x1", function(d){return d.y1;})
			            .attr("y1", function(d){return d.x1;})
			            .attr("x2", function(d){return d.y2;})
			            .attr("y2", function(d){return d.x2;});
	//create
	topH.enter().append("line")
				.style("opacity",0)
			.transition(t)
			.duration(durationTransition)
				.attr("class","lineTopHierarchy")
				.attr("x1", function(d){return d.y1;})
	            .attr("y1", function(d){return d.x1;})
	            .attr("x2", function(d){return d.y2;})
	            .attr("y2", function(d){return d.x2;})
	            .style({
						"opacity" : 1,
					});	
	//exit
	topH.exit().transition(t)
				.duration(durationTransition)
					.style("opacity", 0)
					.remove();
	
	var bottomH = svg_tree_vis.selectAll(".lineBottomHierarchy").data(linkNivelBottom,function(d) { return d.key; });
	
	//update
	bottomH.transition(t)
					.duration(durationTransition)
						.attr("x1", function(d){return d.y1;})
				        .attr("y1", function(d){return d.x1;})
				        .attr("x2", function(d){return d.y2;})
				        .attr("y2", function(d){return d.x2;});
	
	//enter
	bottomH.enter().append("line")
				.style("opacity",0)
			.transition(t)
			.duration(durationTransition)
				.attr("class","lineBottomHierarchy")
				.attr("x1", function(d){return d.y1;})
		        .attr("y1", function(d){return d.x1;})
		        .attr("x2", function(d){return d.y2;})
		        .attr("y2", function(d){return d.x2;})
		        .style({
						"opacity" : 1,
					});	
	//exit
	bottomH.exit().transition(t)
			.duration(durationTransition)
				.style("opacity", 0)
				.remove();
}
// Node, btn availables for this node
function showTooltipTree(node, btn_contents) {
	
	tooltip_tree.html(btn_contents)
				.style({
					"z-index": 1,
					"opacity" : 1,
					"left" : (node.y + margin.left + node_radius) + "px",
					"top" : (d3.event.pageY-margin.top-20) + "px" // (node.x - node_radius) + "px"
				});
}

var listNodeBottomToMove = [];
var listNodeTopToMove = [];

function upInTheHierarchy(element) {

	var hierarchy_node = jerarquiaOutflow.getNodeByKey(element.id);

	var father_node = hierarchy_node.parent;
	
	if(hierarchy_node.level == "bottom"){
		listNodeBottomToMove = [];
		father_node.children.forEach(getAllChildrenInBottom);
	}

	if(hierarchy_node.level == "top"){
		listNodeTopToMove = [];
		father_node.children.forEach(getAllChildrenInTop);
	}
	
	father_node.level = hierarchy_node.level;
	father_node.visible = true;
	
	if(hierarchy_node.level == "bottom"){
		listNodeBottomToMove.forEach(function(child){
			child.level = "";
			child.visible = false;
		});
	}

	if(hierarchy_node.level == "top"){
		listNodeTopToMove.forEach(function(child){
			child.level = "";
			child.visible = false;
		});
	}
	
	callUpdate();
}

function getAllChildrenInBottom(node){
//	var index_node = key_bottom_list.indexOf(node.key);
//	if(index_node != -1){
		var hierarchy_node = jerarquiaOutflow.getNodeByKey(node.key)
		if(hierarchy_node.level == "bottom")
			listNodeBottomToMove.push(hierarchy_node);
//	}
	if(node.children){
		node.children.forEach(getAllChildrenInBottom);
	}
}

function getAllChildrenInTop(node){
//	var index_node = key_top_list.indexOf(node.key);
//	if(index_node != -1){
		var hierarchy_node = jerarquiaOutflow.getNodeByKey(node.key)
		if(hierarchy_node.level == "top")
			listNodeTopToMove.push(hierarchy_node);
//	}
	if(node.children){
		node.children.forEach(getAllChildrenInTop);
	}
}

function downInTheHierarchy(element){

	let hierarchy_node = jerarquiaOutflow.getNodeByKey(element.id);
	
	hierarchy_node.children.forEach(function(child){
		child.level = hierarchy_node.level;
		child.visible = true;
	});
	
	hierarchy_node.level = "";
	hierarchy_node.visible = false;

	callUpdate();
}

//Toggle children on click.
function nodeClick(d) {

	switch (d.level) {
		case "bottom":
				jerarquiaOutflow.changeNodeVisibility(d.key);
				if(jerarquiaOutflow.getVisibleBottomLevelNodes().length==0){
					jerarquiaOutflow.changeNodeVisibility(d.key);
				}
				callUpdate();
				break;
		case "top":
			if(d.depth !=0){//it is not root node
				jerarquiaOutflow.changeNodeVisibilityRecursive(d.key, !d.visible);
				if(jerarquiaOutflow.getVisibleTopLevelNodes().length==0){
					jerarquiaOutflow.changeNodeVisibilityRecursive(d.key, true);
				}
				callUpdate();
			}
			break;
	}
	
}

function setNodeColor(){
	svg_tree_vis.selectAll("circle")
		.data(jerarquiaOutflow.hierarchy)
		.style({
			"fill":function(d){
						var nodeColor;
						if(optsMultiresolution.layersFadingColors && d.level == "top"){
							nodeColor = chroma(d.color).desaturate().brighten(optsMultiresolution.layersFadingColorsFactor);
						}else{
							nodeColor = d.color;
						}
						return d.visible ? nodeColor : "white";
					},
			"stroke":function(d){return d.visible ? d.color : "grey";},
		});
}

//used in assignGlobalVariablesFromOpts
function updateHierarchy(key_focus_list_outflow,key_context_list_outflow, key_focus_list_inflow,key_context_list_inflow){

	// OUTFLOW
	jerarquiaOutflow.voidHierarchy();

	jerarquiaOutflow.setBottomNodes(key_focus_list_outflow);
	jerarquiaOutflow.setTopNodes(key_context_list_outflow);
	nivel_focus_outflow = jerarquiaOutflow.hijos();
	key_focus_list_outflow = jerarquiaOutflow.key_bottom_list;
	nivel_context_outflow = jerarquiaOutflow.papa();
	key_context_list_outflow = jerarquiaOutflow.key_top_list;

	//INFLOW
	jerarquiaInflow.voidHierarchy();

	jerarquiaInflow.setBottomNodes(key_focus_list_inflow);
	jerarquiaInflow.setTopNodes(key_context_list_inflow);
	nivel_focus_inflow = jerarquiaInflow.hijos();
	key_focus_list_inflow = jerarquiaInflow.key_bottom_list;
	nivel_context_inflow = jerarquiaInflow.papa();
	key_context_list_inflow = jerarquiaInflow.key_top_list;

	//createGradientArrays(key_focus_list_outflow);
	
	lineTopAndBottomHierarchy(links);
		
	setNodeColor();

	landMap();
}


function callUpdate(){

	console.log("calling update from hierarchy")

	// OUTFLOW
	// jerarquiaOutflow.setBottomNodes(jerarquiaOutflow.getVisibleBottomLevelNodes());
	jerarquiaOutflow.setBottomNodes(jerarquiaOutflow.getKeyBottomLevelNodes());
	jerarquiaOutflow.setTopNodes(jerarquiaOutflow.getKeyTopLevelNodes());
	nivel_focus_outflow = jerarquiaOutflow.hijos();
	key_focus_list_outflow = jerarquiaOutflow.key_bottom_list;
	nivel_context_outflow = jerarquiaOutflow.papa();
	key_context_list_outflow = jerarquiaOutflow.key_top_list;

	//INFLOW
	// jerarquiaInflow.setBottomNodes(jerarquiaOutflow.getVisibleBottomLevelNodes());
	jerarquiaInflow.setBottomNodes(jerarquiaOutflow.getKeyBottomLevelNodes());
	jerarquiaInflow.setTopNodes(jerarquiaOutflow.getKeyTopLevelNodes());
	nivel_focus_inflow = jerarquiaInflow.hijos();
	key_focus_list_inflow = jerarquiaInflow.key_bottom_list;
	nivel_context_inflow = jerarquiaInflow.papa();
	key_context_list_inflow = jerarquiaInflow.key_top_list;
	
	createGradientArrays(key_focus_list_outflow);
	
	updateFlows();

	// updateMapLands();
	
	lineTopAndBottomHierarchy(links);
	
	setNodeColor();

	nodeOut();
	
	landMap();

	releaseFlowClick();
}


function ratonOverTree(d){
	var selectedNode = d; //get d selectione for use later in transition
	
	svg_tree_vis.selectAll("circle")
		.transition()
		.duration(10)
			.style({
					"stroke":function(d){
						return (selectedNode.key == d.key || selectedNode.key == getFatherKey(d.key) && d.level != ""  ) ? "black" : "grey";
					},
					"stroke-width":function(d){
						return (selectedNode.key == d.key || selectedNode.key == getFatherKey(d.key) && d.level != ""  ) ? opts_tree.strokeWidthNodeSelected : opts_tree.strokeWidthNodeDeselected;
					}
				})
}

function ratonOutTree(){
	svg_tree_vis.selectAll("circle")
				.transition()
				.duration(10)
					.style({
						"stroke":"grey",
						"stroke-width":opts_tree.strokeWidthNodeDeselected
					})
}

function treeVisMove(){
	
	var mouse_coordinates = d3.mouse(this);
	
	//TO FIX BUG DE FIREFOX
	var browser = getBrowser();
	if(browser == "Firefox"){
		mouse_coordinates[0] = mouse_coordinates[0] - 600;
	}
	//
	
	var mouse_x = mouse_coordinates[0] - margin.left; 
	var mouse_y = mouse_coordinates[1] + margin.top;
	
	var node_over_mouse = getNodeOverMouse(mouse_x, mouse_y);
	
	if(node_over_mouse!=null && node_over_mouse.level != "" && node_over_mouse.visible){

		// ratonOverFlow(node_over_mouse);
		// ratonOverTree(node_over_mouse);
		
		var node_key = node_over_mouse.key;
		
		var btnUpHierarchy = "<button id=" + node_key
				+ " class='btnUpHierarchy' onclick='upInTheHierarchy(this)'></button>";
		var btnDownHierarchy = "<button id=" + node_key
				+ " class='btnDownHierarchy' onclick='downInTheHierarchy(this)'></button>";
		
		var btn_contents = "";
		
		var father_disponible =  jerarquiaOutflow.getFatherDisponible(node_key);
		var children_disponible = jerarquiaOutflow.getChildrenDisponible(node_key);
		
		if(father_disponible!=null){
			btn_contents += btnUpHierarchy;
		}
		if(children_disponible!=null){
			btn_contents += btnDownHierarchy;
		}
		if(father_disponible!=null || children_disponible!=null){
			
			showTooltipTree(node_over_mouse, btn_contents);
			
		}
	}else{
		nodeOut();
	}
}

function getNodeOverMouse(mouse_x, mouse_y){
	var length_limit = 40;
	for(var i = 0; i < jerarquiaOutflow.hierarchy.length;i++){
		var node = jerarquiaOutflow.hierarchy[i];
		var a = (node.y-mouse_x);
		var b = (node.x-mouse_y);
		var dist = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
		if((dist <= node_radius) || (((mouse_x - node.y) <= (length_limit)) && (mouse_x >= node.y) && ((mouse_y - node.x) <= node_radius) && (mouse_y >= (node.x - node_radius)) )){
			return node;
		}
	}
}

function wrap(text, width) {
    text.each(function (element) {
    	if(element.depth <= 1){//just for root and depth 1
    		var text = d3.select(this),
    		words = text.text().split(/\s+/).reverse(),
    		word,
    		line = [],
    		lineNumber = 0,
    		lineHeight = 1.1, // ems
    		x = text.attr('x'),
    		y = text.attr('y'),
    		dy = 0, //parseFloat(text.attr('dy')),
    		tspan = text.text(null)
    		.append('tspan')
    		.attr('x', x)
    		.attr('y', y)
    		.attr('dy', dy + 'em');
    		while (word = words.pop()) {
    			line.push(word);
    			tspan.text(line.join(' '));
    			if (tspan.node().getComputedTextLength() > width) {
    				line.pop();
    				tspan.text(line.join(' '));
    				line = [word];
    				tspan = text.append('tspan')
    				.attr('x', x)
    				.attr('y', y)
    				.attr('dy', lineHeight + dy + 'em')
    				.text(word);
    			}
    		}
    	}
    });
}