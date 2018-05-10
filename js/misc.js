

/*#############################################################
The layerPanel object
for layer handling, etc.
*/
var layers = new layersData();
function layersData(){
	this.list;		//element of div that holds list of layers
	this.dragging = null;
	this.dragX = 0;
	this.dragY = 0;	
	this.indicator = null;
	this.dragTo = 0;	//the index to drag to
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
<div id="layer" class="layer" draggable="true" ondragstart="layerDragStart(this)" ondragend="layerDragEnd(this)"><div class="buttonIcon ui-eye-icon" onclick="toggleIcon(this)">&nbsp;</div>Layer 2</div>\
<div id="layer" class="layer" draggable="true" ondragstart="layerDragStart(this)" ondragend="layerDragEnd(this)"><div class="buttonIcon ui-eye-icon" onclick="toggleIcon(this)">&nbsp;</div>Layer 1</div>\
<div id="layer" class="layer layerSelected" draggable="true" ondragstart="layerDragStart(this)" ondragend="layerDragEnd(this)"><div class="buttonIcon ui-eye-icon" onclick="toggleIcon(this)">&nbsp;</div>Layer 0</div>\
			</div>\
		';
		
		
	//store any miscellaneous elements that we need to reference later
	layers.list = document.getElementById('layerList');
	
	
	layers.list.ondragover = function(e) {
		e = e || window.event;
		//var rect = e.currentTarget.getBoundingClientRect();
		var rect = layers.list.getBoundingClientRect();
		layers.dragX = e.clientX - rect.left;
		layers.dragY = e.clientY - rect.top + layers.list.scrollTop;

		layers.dragTo = Math.round(layers.dragY/layers.dragging.offsetHeight);
		layers.indicator.style.top = layers.dragTo*layers.dragging.offsetHeight+'px'; 
		//console.log(x, y);
	}
}

function layerDragStart(e){
	layers.dragging=e;
	layers.indicator = document.createElement("div");
	layers.indicator.className = 'dragIndicator';
	layers.list.appendChild(layers.indicator);
}

function layerDragEnd(e){
	
	var elements = document.getElementsByClassName('layer');
	if(layers.dragTo<elements.length)
		layers.list.insertBefore(layers.dragging, elements[layers.dragTo]);
	else
		layers.list.insertBefore(layers.dragging, layers.indicator.previousSibling);		//for some reason have to use previous Sibling position (maybe there is an invisible dom element??)
		//layers.list.appendChild(layers.dragging);
	
	layers.list.removeChild(layers.indicator);
	layers.indicator = null;
	
	//reorder the canvas arrays
	var node = layers.dragging;
	for (var i=0; (node=node.previousSibling); i++);
	var moveTo = scene.canvas.length-1-i;
	if(scene.layer!=moveTo){
		scene.canvas.splice(moveTo, 0, scene.canvas.splice(scene.layer, 1)[0]);
		scene.context.splice(moveTo, 0, scene.context.splice(scene.layer, 1)[0]);
		scene.thumbCanvas.splice(moveTo, 0, scene.thumbCanvas.splice(scene.layer, 1)[0]);
		scene.thumbContext.splice(moveTo, 0, scene.thumbContext.splice(scene.layer, 1)[0]);
		
		scene.layer = moveTo;
	}
	//refresh canvas dom order/zindex
	for(var i=0; i<scene.canvas.length; i++){	
		scene.canvas[i].style.zIndex = i;
		canvasDiv.insertBefore(scene.canvas[i], canvasDiv.firstChild);
	}
	
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

