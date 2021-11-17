var confList = [];

function eventsToSnapshots(){

    //the points events
    pointEventDetections.forEach(flowType=>{

        flowType.forEach(eventInFlow=>{

            let currConfig = getCurrConfiguration(optsGeneral);

            //setting the Brush extention
            let numTimeStepBrushDistortion = 2;
            let numTimeStepBrushNormal = 1;

            let brushZoomExtentLeft = getTimeOffset(eventInFlow.date, -stepTemporal, polarityTemporal);
            console.log(brushZoomExtentLeft)
            let brushZoomExtentRight = getTimeOffset(eventInFlow.date, stepTemporal, polarityTemporal);

            let brushDistortionLeft = getTimeOffset(brushZoomExtentLeft, -numTimeStepBrushDistortion, polarityTemporal);
            let brushNormalLeft =getTimeOffset(brushDistortionLeft, -numTimeStepBrushNormal, polarityTemporal);;
            let brushDistortionRight = getTimeOffset(brushZoomExtentRight, numTimeStepBrushDistortion, polarityTemporal);
            let brushNormalRight = getTimeOffset(brushDistortionRight, numTimeStepBrushNormal, polarityTemporal);

            currConfig.optsMultistream.optsContext.timeIntervalBrushNormalLeft = [brushNormalLeft,brushDistortionLeft];
            currConfig.optsMultistream.optsContext.timeIntervalBrushDistortionLeft = [brushDistortionLeft,brushZoomExtentLeft];
            currConfig.optsMultistream.optsContext.timeIntervalBrushZoom = [brushZoomExtentLeft,brushZoomExtentRight];
            currConfig.optsMultistream.optsContext.timeIntervalBrushDistortionRight = [brushZoomExtentRight,brushDistortionRight];
            currConfig.optsMultistream.optsContext.timeIntervalBrushNormalRight = [brushDistortionRight,brushNormalRight];

            let key_focus_list = key_focus_list_outflow.map(d=>{
                return {"name":d.name,"visible":d.name==eventInFlow.key?true:false};
            });
                                
            //tree
            currConfig.optsTree.key_focus_list_outflow = key_focus_list;
            currConfig.optsTree.key_context_list_outflow = key_context_list_outflow;
            currConfig.optsTree.key_focus_list_inflow = key_focus_list;
            currConfig.optsTree.key_context_list_inflow = key_context_list_inflow;

            
            //TITRE
            currConfig.optsGeneral.title = eventInFlow.category.toUpperCase() + " (" + eventInFlow.dataType +")" ;
            //DATE
            currConfig.optsGeneral.date = customTimeFormatTitle(eventInFlow.date);
            
            addCurrConfiguration(currConfig);				
        });

    });
    
}

function clearAllSnapshots(){
    removeAllChildrenOfAList("col-list-states");
}


function addSnapshot(){

    let currConfig = getCurrConfiguration(optsGeneral);
    let title = document.getElementById("titleAddState").value;	
    currConfig.optsGeneral.title = title;

    addCurrConfiguration(currConfig);

    console.log(currConfig)
}


function addCurrConfiguration(currConfig){
    
    confList.unshift(currConfig);	
    updateConfListView("col-list-states", confList);
    document.getElementById("titleAddState").value = "";
}

function removeAConfiguration(element){
    removeItemInList(element.id,confList);
    updateConfListView("col-list-states", confList);
}


function updateConfListView(idConfigList, confList){
    
    removeAllChildrenOfAList(idConfigList);
    for(var i=0;i<confList.length;i++){
        let config = confList[i];

        let removeBtn = "<a id="+ i +" class='snapshot-remove' onclick='event.stopPropagation();  removeAConfiguration(this);'><i class='fas fa-times-circle'></i></a>"
        let htmlText = "<div>"+
                            "<p class='body2 snapshot-detail'>" + config.optsGeneral.title + "</p>"+
                            "<span class='overline snapshot-date'>" + config.optsGeneral.date + "</span>"+
                            removeBtn+
                        "</div>";
        let element = addElement(idConfigList, "button", "button"+i, htmlText);
        element.classList.add("btn");
        element.classList.add("btn-outline-info");
        element.classList.add("snapshot-entry");				
        element.setAttribute("type", "button");

        element.addEventListener("click",()=>{
            event.stopPropagation(); 
            assignGlobalVariablesFromOpts(config); 
        });

    }
}