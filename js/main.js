var gui = null;//require('nw.gui');	//used in loading bins and auth to allow loading of website in browser.
var myWindow = null;//gui.Window.get();

var wacom;

var midTable;
var iframe;
var jframe;
var innerDoc;
var canvasDiv;			//the canvases/layers reside in this div.
var canvasOverlay;		//used for drawing the brush indicator and selection marquee stuff.
var contextOverlay;

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

	this.init = function(){
		//wacom = document.getElementById('wtPlugin');
		
		iframe = document.getElementById('tilesetIframe');
		//midTable = document.getElementById('midTable');
		//jframe = $('#tilesetIframe');
		innerDoc = (iframe.contentDocument) ? iframe.contentDocument : iframe.contentWindow.document;		
		canvasDiv = innerDoc.getElementById('canvasDiv');
		canvasOverlay = innerDoc.getElementById('tilesetIframeCanvasOverlay');
		contextOverlay = canvasOverlay.getContext('2d');
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
}
/*
end of mouse
###############################################################
*/

function iframeLoaded(){
	try{
		gui = require('nw.gui');
		myWindow = gui.Window.get();
    } catch (e){
    }
	window.onload = loadElements();
}

function loadElements(){

	/* setup the main stuff */
		
	master.e['colorPanel'] = document.getElementById('colorPanel');
	
	master.init();
	scene.init();
	tool.init();
	color.init();

	document.body.onmousemove = function(e){
		e = e || window.event;
		
		mouse.x = e.clientX;     // Get the horizontal coordinate
		mouse.y = e.clientY;     // Get the vertical coordinate
		
		update();
	}
	document.body.onmousedown = function(e){
		e = e || window.event;
		
		mouse.clickX = e.clientX;
		mouse.clickY = e.clientY;
		
		master.clickedElement = e.target || e.srcElement;
		
		if(master.clickedElement.classList.contains("colorValue")){
				if(!isNaN(parseInt(master.clickedElement.value)))master.clickedElement.dataset.clickvalue = master.clickedElement.value;
		}
		
		update();
	}
	document.body.onmouseup = function(e){
		e = e || window.event;
		
		mouse.releaseX = e.clientX;
		mouse.releaseY = e.clientY;
		
		master.clickedElement = null;
	}
	document.body.onmouseleave = function(e){
		e = e || window.event;
		//console.log(e.which);
	}
	document.body.onmouseenter = function(e){
		e = e || window.event;
		
		if(e.which!==1){
			master.clickedElement = null;
			mouse.releaseX = e.clientX;
			mouse.releaseY = e.clientY;			
		}
	}	
	
	document.body.onkeydown = function(e){
		e = e || window.event;
		
		console.log(e.which);
		
		master.keyedElement = e.target || e.srcElement;
		
		if(master.keyedElement.classList.contains("colorValue")){
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
			if(e.which!==38 && e.which!==40 && master.keyedElement.classList.contains("colorValue")){
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

function update(){	
	var e = master.clickedElement || master.keyedElement;
	
	if( typeof e !== 'undefined' && e !== null ){
		switch(e.id){
			case("red"):
			case("green"):
			case("blue"):	//red and green have no break; so they'll continue into blue.
				var rect = e.firstChild.getBoundingClientRect();	//get the position of the slider
				
				var c = color.swatch[color.currentColor];
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
				var c = color.swatch[color.currentColor];
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
			default:
			
		}
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

function toggleIcon(e) {
	//e.classList.contains("ui-rgb-icon")		
    //e.style.backgroundColor = "#ffff00";
	
	var count = e.classList.length;
	var i=0;
	for(i=0; i<count; i++){
		var item = e.classList.item(i);
		var c = color.swatch[color.currentColor];
		switch(item){
			case("ui-rgb-icon"):
				color.mode = "hsl";
				e.classList.remove(item);
				e.classList.add("ui-hsl-icon");
				e.classList.toggle("highlightIcon");
				var hsl = rgbToHsl(c.r,c.g,c.b);
				c.h = hsl[0];
				c.s = hsl[1];
				c.l = hsl[2];
				//console.log(c);
				color.updatePicker();
				break;
			case("ui-hsl-icon"):
				color.mode = "rgb";
				e.classList.remove(item);
				e.classList.add("ui-rgb-icon");
				e.classList.toggle("highlightIcon");
				var rgb = hslToRgb(c.h,c.s,c.l);
				c.r = Math.round(rgb[0]);
				c.g = Math.round(rgb[1]);
				c.b = Math.round(rgb[2]);
				//console.log(c);
				color.updatePicker();
				break;
			default:
			
		}
	}
}

function refreshColorSliders(e){
	e = e || window.event;
	//console.log(e.button);
	console.log(e.which);
	
	switch(e.type){
		case("mousedown"):
			break;
		case("mousemove"):
			break;
		case("mouseup"):
			break;
		default:
		
	}
}

