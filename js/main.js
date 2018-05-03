/*
Alex Hanson-White
http://www.alexhw.com
support me via patreon!
*/

var canvasDiv;			//the canvases/layers reside in this div.
var canvasIndicator;		//used for drawing the brush indicator and selection marquee stuff.
var contextIndicator;

/*#############################################################
The master object holds the main components
The init function is run after the iframe has loaded, allowing jquery objects to be setup, 
and everything else loaded or assigned to variables.
*/
var master = new masterData();
function masterData(){
	this.e = {};
	this.j = {};

	this.clickedElement = null;
	this.keyedElement = null;
	
	this.zoom = 1;

	this.init = function(){
		master.e['colorPanel'] = document.getElementById('colorPanel');
		master.e['toolPropertyPanel'] = document.getElementById('toolPropertyPanel');
		master.e['layerPanel'] = document.getElementById('layerPanel');
		
		master.e['canvasScroll'] = document.getElementById('canvasScroll');
		master.e['canvasFrame'] = document.getElementById('canvasFrame');
		master.e['overlayDiv'] = document.getElementById('overlayDiv');
		canvasDiv = document.getElementById('canvasDiv');
		canvasIndicator = document.getElementById('canvasIndicator');
		contextIndicator = canvasIndicator.getContext('2d');
	}
	
}
/*
end of master
###############################################################
*/

/*#############################################################
The mouse object
for position, etc.
*/
var mouse = new mouseData();
function mouseData(){
	this.x = 0;
	this.y = 0;	
	this.clickX = 0;
	this.clickY = 0;	
	this.releaseX = 0;
	this.releaseY = 0;
	
	this.canvasX = 0;
	this.canvasY = 0;
	this.canvasPrevX = 0;
	this.canvasPrevY = 0;
}
/*
end of mouse
###############################################################
*/

function initiate(){

	/* setup thedom elements */
	setupDom();
	
	/* setup the main stuff */	
	master.init();
	scene.init();
	color.init();
	tool.init();
	imageLoader.init();
	
	document.body.onmousemove = function(e){
		e = e || window.event;
		
		mouse.x = e.clientX;     // Get the horizontal coordinate
		mouse.y = e.clientY;     // Get the vertical coordinate
		
		
		//the actual pixel location on the canvas
		var rect = canvasDiv.getBoundingClientRect();
		var pixelX = (mouse.x-rect.left*master.zoom)/master.zoom;
		var pixelY = (mouse.y-rect.top*master.zoom)/master.zoom;
		
		mouse.canvasPreX = mouse.canvasX;
		mouse.canvasPreY = mouse.canvasY;
		mouse.canvasX = Math.floor(pixelX);
		mouse.canvasY = Math.floor(pixelY);
		
		//the indicator position
		var pad = parseFloat(window.getComputedStyle(master.e.canvasFrame,null).getPropertyValue("padding"),10);
		var sx = (Math.floor(pixelX)+1+pad)*master.zoom;
		var sy = (Math.floor(pixelY)+1+pad)*master.zoom;		
		canvasIndicator.style.left = sx-parseInt(canvasIndicator.width*0.5,10)+"px";
		canvasIndicator.style.top = sy-parseInt(canvasIndicator.height*0.5,10)+"px";
		
		
		update();
	}
	document.body.onmousedown = function(e){
		e = e || window.event;
		
		mouse.clickX = e.clientX;
		mouse.clickY = e.clientY;
		
		master.clickedElement = e.target || e.srcElement;
		
		if(master.clickedElement.classList.contains("colorValue") ||
		master.clickedElement.classList.contains("value")){
				if(!isNaN(parseInt(master.clickedElement.value)))master.clickedElement.dataset.clickvalue = master.clickedElement.value;
		}
		
		clickDown();
		update();
	}
	document.body.onmouseup = function(e){
		e = e || window.event;
		
		mouse.releaseX = e.clientX;
		mouse.releaseY = e.clientY;
		
		clickUp();
		
		master.clickedElement = null;
	}
	document.body.onmouseleave = function(e){
		e = e || window.event;
		//console.log(e.which);
	}
	document.body.onmouseenter = function(e){
		e = e || window.event;
		//console.log(e.which);
		
		if(e.which!==1){
			master.clickedElement = null;
			mouse.releaseX = e.clientX;
			mouse.releaseY = e.clientY;			
		}
	}	
	
	document.body.onkeydown = function(e){
		e = e || window.event;		
		//console.log(e.which);
		
		master.keyedElement = e.target || e.srcElement;
		
		if(master.keyedElement.classList.contains("colorValue") ||
		master.keyedElement.classList.contains("value")){
			//master.keyedElement.dataset.clickvalue = master.keyedElement.value;
			switch(e.which){
				case(38):
					if(!isNaN(parseInt(master.keyedElement.value)))master.keyedElement.dataset.clickvalue = parseInt(master.keyedElement.value)+1;
					update();
					break;
				case(40):
					if(!isNaN(parseInt(master.keyedElement.value)))master.keyedElement.dataset.clickvalue = parseInt(master.keyedElement.value)-1;
					update();
					break;
				/*case(13):
					if(!isNaN(parseInt(master.keyedElement.value)))master.keyedElement.dataset.clickvalue = parseInt(master.keyedElement.value);
					update();
					break;*/
			}
		}
		
	}		
	document.body.onkeyup = function(e){
		e = e || window.event;
	
		if( typeof master.keyedElement !== 'undefined' && master.keyedElement !== null ){
			if(e.which!==38 && e.which!==40 && (
			master.keyedElement.classList.contains("colorValue") ||
			master.keyedElement.classList.contains("value")
			) ){
		console.log(e.which);
				if(!isNaN(parseInt(master.keyedElement.value)))master.keyedElement.dataset.clickvalue = parseInt(master.keyedElement.value);
				update();
			}
		}

		master.keyedElement = null;
	}
	/*document.getElementById("bodyBlock").onclick = function(e){
		e.stopPropagation();
		e.preventDefault();
		e.stopImmediatePropagation();
		return false;
	}*/
	
}

function clickDown(){	
	var e = master.clickedElement || master.keyedElement;
	
	if( typeof e !== 'undefined' && e !== null ){
		switch(e.id){
			case("layer"):
				var elements = document.getElementsByClassName('layerSelected');
				while(elements.length > 0){
					elements[0].classList.remove('layerSelected');
				}
				e.className += " layerSelected";
				var node = e;
				for (var i=0; (node=node.previousSibling); i++);
				
				scene.layer = scene.canvas.length-1-i;
				break;
			default:
			
		}
	}
	
}

function clickUp(){	
	var e = master.clickedElement || master.keyedElement;
	
	if( typeof e !== 'undefined' && e !== null ){
		switch(e.id){
			case("canvasDiv"):
				scene.thumbContext[scene.layer].drawImage(scene.canvas[scene.layer],0,0,24,24);
				break;
			default:
			
		}
	}
	
}

function update(){	
	var e = master.clickedElement || master.keyedElement;
	
	if( typeof e !== 'undefined' && e !== null ){
		switch(e.id){
			case("size"):
				var rect = e.firstChild.getBoundingClientRect();	//get the position of the slider
				
				tool.properties.size = parseInt((clamp(mouse.x-rect.left,0,100)/100)*50);
				tool.updateBrush();
				break;				
			case("sizeValue"):
				if(e==master.clickedElement){
					tool.properties.size = clamp(parseInt(e.dataset.clickvalue)+mouse.clickY-mouse.y,0,50);
				}else{	//typing
					tool.properties.size = clamp(parseInt(e.dataset.clickvalue),0,50);
				}
				tool.updateBrush();
				break;
			case("red"):
			case("green"):
			case("blue"):	//red and green have no break; so they'll continue into blue.
				var rect = e.firstChild.getBoundingClientRect();	//get the position of the slider
				
				var c = color.picked[color.currentColor];
				if(color.mode=="rgb")c[e.dataset.rgb] = parseInt((clamp(mouse.x-rect.left,0,100)/100)*255);
				else{
					if(e.dataset.hsl=="h")c.h = parseInt((clamp(mouse.x-rect.left,0,100)/100)*360);
					else c[e.dataset.hsl] = parseInt(clamp(mouse.x-rect.left,0,100));
				}
				color.updatePicker();
				break;
			case("redValue"):
			case("greenValue"):
			case("blueValue"):
				var c = color.picked[color.currentColor];
				if(e==master.clickedElement){
					if(color.mode=="rgb")c[e.dataset.rgb] = clamp(parseInt(e.dataset.clickvalue)+mouse.clickY-mouse.y,0,255);
					else{
						if(e.id=="redValue")c.h = clamp(parseInt(e.dataset.clickvalue)+mouse.clickY-mouse.y,0,360);
						else c[e.dataset.hsl] = clamp(parseInt(e.dataset.clickvalue)+mouse.clickY-mouse.y,0,100);
					}
				}else{	//typing
					if(color.mode=="rgb")c[e.dataset.rgb] = clamp(parseInt(e.dataset.clickvalue),0,255);
					else{
						if(e.id=="redValue")c.h = clamp(parseInt(e.dataset.clickvalue),0,360);
						else c[e.dataset.hsl] = clamp(parseInt(e.dataset.clickvalue),0,100);
					}
				}
				color.updatePicker();
				break;
			case("canvasDiv"):
				//tool.drawPencil();
				tool.drawLine(mouse.canvasPreX,mouse.canvasPreY,mouse.canvasX,mouse.canvasY);
				break;
			default:
			
		}
	}
	
}

function zoom(e) {
	master.zoom = parseFloat(e.value);
	canvasFrame.style.zoom = master.zoom;
	canvasIndicator.style.zoom = 1/master.zoom;
	tool.drawBrushEdge();
}

function toggleIcon(e) {
	//e.classList.contains("ui-rgb-icon")		
    //e.style.backgroundColor = "#ffff00";
	
	var count = e.classList.length;
	var i=0;
	for(i=0; i<count; i++){
		var item = e.classList.item(i);
		var c = color.picked[0];
		switch(item){
			case("ui-rgb-icon"):
				color.mode = "hsl";
				e.classList.remove(item);
				e.classList.add("ui-hsl-icon");
				e.classList.toggle("highlightIcon");
				
				//convert both primary and secondary colors
				var hsl = rgbToHsl(c.r,c.g,c.b);
				c.h = hsl[0];
				c.s = hsl[1];
				c.l = hsl[2];
				c = color.picked[1];
				hsl = rgbToHsl(c.r,c.g,c.b);
				c.h = hsl[0];
				c.s = hsl[1];
				c.l = hsl[2];
				
				color.updatePicker();
				break;
			case("ui-hsl-icon"):
				color.mode = "rgb";
				e.classList.remove(item);
				e.classList.add("ui-rgb-icon");
				e.classList.toggle("highlightIcon");
				
				//convert both primary and secondary colors
				var rgb = hslToRgb(c.h,c.s,c.l);
				c.r = Math.round(rgb[0]);
				c.g = Math.round(rgb[1]);
				c.b = Math.round(rgb[2]);
				c = color.picked[1];
				rgb = hslToRgb(c.h,c.s,c.l);
				c.r = Math.round(rgb[0]);
				c.g = Math.round(rgb[1]);
				c.b = Math.round(rgb[2]);
				
				color.updatePicker();
				break;
			case("ui-eye-icon"):
				e.classList.remove(item);
				e.classList.add("ui-shuteye-icon");
				
				var node = e.parentNode;
				for (var j=0; (node=node.previousSibling); j++);
				var elements = document.getElementsByClassName('layerCanvas');
				elements[j].style.visibility='hidden'
				break;
			case("ui-shuteye-icon"):
				e.classList.remove(item);
				e.classList.add("ui-eye-icon");
				
				var node = e.parentNode;
				for (var j=0; (node=node.previousSibling); j++);
				var elements = document.getElementsByClassName('layerCanvas');
				elements[j].style.visibility='visible'
				break;
			default:
			
		}
	}
	
}


