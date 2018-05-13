

/*#############################################################
The layerPanel object
for layer handling, etc.
*/
var layers = new layersData();
function layersData(){
	this.list;		//element of div that holds list of layers
	this.dragging = null;
	this.draggingOver = null;	//the current layer element that the mouse is hovering over while dragging
	this.dropAbove = true; 	//whether to drop above or below element;
	this.dragX = 0;
	this.dragY = 0;	
	this.indicator = null;
	this.dragTo = 0;	//the index to drag to
	this.groupIndex = null;		//the index of the first layer in a folder being dragged 
	this.groupSize = 0;			//the number of layers inside a folder and any subfolders
	this.groupNewIndex = null;	//the new index position of the group after dragged
}
/*
end of layers
###############################################################
*/


/*#############################################################
The imageloader object
for imageloading, etc.
*/
var imageLoader = new imageLoaderData();
function imageLoaderData(){
	this.input;
	this.img;	//the loading image that will be visualized
	
	this.init = function(){
		this.input = document.getElementById('imageLoader');
		this.input.addEventListener('change', imageLoader.loadImage, false);
	}
	
	this.loadImage = function(e){
		var reader = new FileReader();
		
		reader.onload = function(event){
			imageLoader.img = new Image();
			imageLoader.img.onload = function(){
				//source.canvas.width = source.img.width;
				//source.canvas.height = source.img.height;
				scene.context[scene.layer].drawImage(imageLoader.img,0,0);
			}
			imageLoader.img.src = event.target.result;
		}
		reader.readAsDataURL(e.target.files[0]);
		
		//clear the input box
		try{
			imageLoader.input.value = '';
			if(imageLoader.input.value){
				imageLoader.input.type = "text";
				imageLoader.input.type = "file";
			}
		}catch(e){}
	}
	
}
/*
end of layers
###############################################################
*/


function setupDom(){
	 
	document.getElementById('colorPanel').innerHTML = '\
			<table width="100%"><tr><td>\
				<button id="rgbhslButton" class="buttonIcon ui-rgb-icon" onclick="toggleIcon(this)">&nbsp;</button>\
			</td><td width="1px">\
			<div style="position:relative; vertical-align:top;">\
				<div style="position:relative; width:54px; height:54px; background:none;">\
					<div id="primary" class="picked" style="z-index:1; position:absolute; top:0px; left;0px; width:40px; height:40px;" onclick="color.currentColor=0; color.updatePicker(); this.style.zIndex=1; this.nextElementSibling.style.zIndex=0; "></div>\
					<div id="secondary" class="picked" style="z-index:0; position:absolute; bottom:0px; right:0px; width:40px; height:40px;" onclick="color.currentColor=1; color.updatePicker(); this.style.zIndex=1; this.previousElementSibling.style.zIndex=0; "></div>\
				</div>\
			</div>\
			</td></tr></table>\
			<div style="display:inline-block; vertical-align:middle; padding-left:21px;">\
			<div id="red" data-rgb="r" data-hsl="h" class="colorSliderBG"><div class="colorSlider"></div></div>\
			<div id="green" data-rgb="g" data-hsl="s" class="colorSliderBG"><div class="colorSlider"></div></div>\
			<div id="blue" data-rgb="b" data-hsl="l" class="colorSliderBG"><div class="colorSlider"></div></div>\
			<div id="multi" class="colorSliderBG"><div class="colorSlider"></div></div>\
			</div>\
			<div style="display:inline-block; vertical-align:middle; font-size:10px;">\
			<input type="text" id="redValue" data-rgb="r" data-hsl="h" data-clickvalue="0" class="colorValue" maxlength="3"><br>\
			<input type="text" id="greenValue" data-rgb="g" data-hsl="s" data-clickvalue="0" class="colorValue" maxlength="3"><br>\
			<input type="text" id="blueValue" data-rgb="b" data-hsl="l" data-clickvalue="0" class="colorValue" maxlength="3"><br>\
			<input type="text" id="multiValue" ><br>\
			</div>\
			<div style="display:inline-block; position:relative; vertical-align:top;">\
				<div id="brushCanvasDiv" style="position:relative; width:54px; height:54px; background:none;">\
				</div>\
			</div>\
		';
		
	document.getElementById('toolPropertyPanel').innerHTML = '\
			<div style="display:inline-block; vertical-align:middle; padding-left:21px;">\
				<div id="size" class="sliderBG"><div id="sizeSlider" class="slider"></div></div>\
			</div>\
			<div style="display:inline-block; vertical-align:middle; font-size:10px;">\
				<input type="text" id="sizeValue" data-clickvalue="0" class="value" maxlength="2"><br>\
			</div>\
		';
		
		
	document.getElementById('layerPanel').innerHTML = '\
<button id="" class="buttonIcon" onclick="toggleIcon(this)">+</button>\
<button id="" class="buttonIcon" onclick="toggleIcon(this)">-</button>\
<button id="" class="buttonIcon" onclick="toggleIcon(this)">&#8679;</button>\
<button id="" class="buttonIcon" onclick="toggleIcon(this)">&#8681;</button>\
			<div id="layerList" style="position:relative; width:180px; height:150px; overflow-y:scroll; border: inset 3px #ccc; background-color: #888; padding:2px">\
<div id="folder" class="folder" draggable="true" ondragstart="layerDragStart(this)" ondragover="layerDragOver(this)" ondragend="layerDragEnd(this)"><div class="buttonIcon ui-collapsed-icon" onclick="toggleIcon(this)">&nbsp;</div>Folder<div class="folderContent" ondragover="layerDragOver(this)"></div></div>\
<div id="folder" class="folder" draggable="true" ondragstart="layerDragStart(this)" ondragover="layerDragOver(this)" ondragend="layerDragEnd(this)"><div class="buttonIcon ui-collapsed-icon" onclick="toggleIcon(this)">&nbsp;</div>Folder<div class="folderContent" ondragover="layerDragOver(this)"></div></div>\
<div id="folder" class="folder" draggable="true" ondragstart="layerDragStart(this)" ondragover="layerDragOver(this)" ondragend="layerDragEnd(this)"><div class="buttonIcon ui-collapsed-icon" onclick="toggleIcon(this)">&nbsp;</div>Folder<div class="folderContent" ondragover="layerDragOver(this)"></div></div>\
<div id="layer" class="layer" draggable="true" ondragstart="layerDragStart(this)" ondragover="layerDragOver(this)" ondragend="layerDragEnd(this)"><div class="buttonIcon ui-eye-icon" onclick="toggleIcon(this)">&nbsp;</div>Layer 2</div>\
<div id="layer" class="layer" draggable="true" ondragstart="layerDragStart(this)" ondragover="layerDragOver(this)" ondragend="layerDragEnd(this)"><div class="buttonIcon ui-eye-icon" onclick="toggleIcon(this)">&nbsp;</div>Layer 1</div>\
<div id="layer" class="layer layerSelected" draggable="true" ondragstart="layerDragStart(this)" ondragover="layerDragOver(this)" ondragend="layerDragEnd(this)"><div class="buttonIcon ui-eye-icon" onclick="toggleIcon(this)">&nbsp;</div>Layer 0</div>\
			</div>\
		';
		
		
	//store any miscellaneous elements that we need to reference later
	layers.list = document.getElementById('layerList');
	
	/*
	layers.list.ondragover = function(e) {
		e = e || window.event;
		//var rect = e.currentTarget.getBoundingClientRect();
		var rect = layers.list.getBoundingClientRect();
		layers.dragX = e.clientX - rect.left;
		layers.dragY = e.clientY - rect.top + layers.list.scrollTop;

		layers.dragTo = Math.round(layers.dragY/layers.dragging.offsetHeight);
		layers.indicator.style.top = layers.dragTo*layers.dragging.offsetHeight+'px'; 
		//console.log(x, y);
	}*/
}

function layerDragStart(e){
	layers.dragging=e;
	layers.indicator = document.createElement("div");
	layers.indicator.className = 'dragIndicator';
	layers.list.appendChild(layers.indicator);
	
	//if we start dragging a folder, record the start index of the first layer within the folder, as well as the number of layers within it
	if(layers.dragging.className=="folder"){
		layers.groupIndex = null;
		layers.groupSize = 0;
		var folderElements = layers.dragging.getElementsByClassName('layer');
		if(folderElements.length>0){
			var listElements = layers.list.getElementsByClassName('layer');
			for (var i=0; i<listElements.length; i++){
				if(folderElements[0]==listElements[i]){
					layers.groupIndex = scene.canvas.length-i-folderElements.length;		//this is the bottom layer in the folder(since order is inverted in the canvas arrays)
					layers.groupSize = folderElements.length;
					break;
				}
			}
		}
	}
	
	//this helps so we dont start multiple drags if clicking layer inside folder
	window.event.stopPropagation();
	window.event.stopImmediatePropagation();
}

function layerDragOver(e){
	if(layers.dragging==null)return;
	
	layers.draggingOver = e;
	var rectLayer = e.getBoundingClientRect();
	var rectList = layers.list.getBoundingClientRect();
	layers.dragX = window.event.clientX - rectList.left;
	layers.dragY = window.event.clientY - rectList.top + layers.list.scrollTop;
	
	if(layers.dragY<=e.offsetTop+e.offsetHeight*0.5)
		layers.dropAbove = true;
	else
		layers.dropAbove = false;
	
	layers.indicator.style.top = (layers.dropAbove?e.offsetTop:e.offsetTop+e.offsetHeight)+'px'; 
	
	//this helps so that we can drop into nested elements(folders)
	window.event.stopPropagation();
	window.event.preventDefault();
	window.event.stopImmediatePropagation();
	return false;
	
	//console.log(window.event.clientY,rectLayer.top);
}

function layerDragEnd(e){
	/*
	var elements = document.getElementsByClassName('layer');
	if(layers.dragTo<elements.length)
		layers.list.insertBefore(layers.dragging, elements[layers.dragTo]);
	else
		layers.list.insertBefore(layers.dragging, layers.indicator.previousSibling);		//for some reason have to use previous Sibling position (maybe there is an invisible dom element??)
		//layers.list.appendChild(layers.dragging);
	*/
	
	if(layers.indicator == null)return;
	layers.list.removeChild(layers.indicator);
	layers.indicator = null;
	
	//We use try/catch to remove errors, since browser will prevent dropping folders into sub-folders of itself- we don't need to code that ourself.
	if(layers.draggingOver.className=="folderContent"){
		try{
			layers.draggingOver.appendChild(layers.dragging);
		}catch(err){return;}
	}
	else{
		if(layers.dropAbove){
			try{
				layers.draggingOver.parentElement.insertBefore(layers.dragging, layers.draggingOver);
			}catch(err){return;}
		}else{
			try{
				layers.draggingOver.parentElement.insertBefore(layers.dragging, layers.draggingOver);
				layers.draggingOver.parentElement.insertBefore(layers.draggingOver, layers.dragging);
			}catch(err){return;}
		}		
	}
	
	//reorder the canvas arrays
	if(layers.dragging.className=="layer layerSelected"){
		var moveTo;
		var elements = layers.list.getElementsByClassName('layer');
		for (var i=0; i<elements.length; i++){
			if(layers.dragging==elements[i]){	
				moveTo = scene.canvas.length-1-i;
				break;
			}
		}
		if(scene.layer!=moveTo){
			scene.canvas.splice(moveTo, 0, scene.canvas.splice(scene.layer, 1)[0]);
			scene.context.splice(moveTo, 0, scene.context.splice(scene.layer, 1)[0]);
			scene.thumbCanvas.splice(moveTo, 0, scene.thumbCanvas.splice(scene.layer, 1)[0]);
			scene.thumbContext.splice(moveTo, 0, scene.thumbContext.splice(scene.layer, 1)[0]);
			
			scene.layer = moveTo;
		}
	}else if(layers.dragging.className=="folder"){
		//since a folder may contain more than one layer, we must move a section of values in the arrays.
		/*
		//example
		var ta=[0,1,2,3,4,5,6,7];
		var ar=ta.splice(3, 2);	//we take 2 value out beginning at index 3 and store in a variable
		ar.unshift(0);					//0 means we are inserting
		ar.unshift(1);					//1 means we are inserting at index 1
		ta.splice.apply(ta,ar);		//we use apply() to use the array as the parameters- inserting the group back in at the new index
		//this would be [0,3,4,1,2,5,6,7]
		*/
		
		//if we have dragged a folder/group, find the new index position of the first layer in the group
		layers.groupNewIndex = null;
		var folderElements = layers.dragging.getElementsByClassName('layer');
		if(folderElements.length>0){
			var listElements = layers.list.getElementsByClassName('layer');
			for (var i=0; i<listElements.length; i++){
				if(folderElements[0]==listElements[i]){
					layers.groupNewIndex = scene.canvas.length-i-layers.groupSize;	//the index corresponds to the bottom layer inside the folder because canvas arrays are inverted
				}
				//find currently selected layer(since it may have been reordered)
				if(listElements[i].className=="layer layerSelected")scene.layer = scene.canvas.length-1-i;
			}
			//reorder the canvas arrays
			var temp = scene.canvas.splice(layers.groupIndex,layers.groupSize);
			temp.unshift(0);
			temp.unshift(layers.groupNewIndex);
			scene.canvas.splice.apply(scene.canvas,temp);
			
			temp = scene.context.splice(layers.groupIndex,layers.groupSize);
			temp.unshift(0);
			temp.unshift(layers.groupNewIndex);
			scene.context.splice.apply(scene.context,temp);
			
			temp = scene.thumbCanvas.splice(layers.groupIndex,layers.groupSize);
			temp.unshift(0);
			temp.unshift(layers.groupNewIndex);
			scene.thumbCanvas.splice.apply(scene.thumbCanvas,temp);
			
			temp = scene.thumbContext.splice(layers.groupIndex,layers.groupSize);
			temp.unshift(0);
			temp.unshift(layers.groupNewIndex);
			scene.thumbContext.splice.apply(scene.thumbContext,temp);
		}
		
	}
	
	//refresh canvas dom order/zindex
	for(var i=0; i<scene.canvas.length; i++){	
		scene.canvas[i].style.zIndex = i;
		canvasDiv.insertBefore(scene.canvas[i], canvasDiv.firstChild);
	}
	
	layers.dragging = null;
	
	//if dropping onto nested elements- prevents firing multiple times
	window.event.stopPropagation();
	window.event.stopImmediatePropagation();
}

function checkJSON(j){
	if (j){
		try{
			a=JSON.parse( localStorage.getItem(j) );
			return a;
		}catch(e){
			return null;
		}
	}else return null
}

function clamp(num,min,max){
  return Math.min(Math.max(min,num),max);
}

