
var scene = new sceneData();
function sceneData(){
	this.canvas = [];
	this.context = [];
	this.layer = 0;	//the index number of the current canvas
	this.thumbCanvas = [];		//for the thumbnails in the layers panel
	this.thumbContext = [];

	//this.strokeCanvas = document.createElement("canvas");		//draw the whole stroke/line separately to this canvas(when mouse is held down) before applying to actual layer canvas(when mouse released)
	//this.strokeContext = scene.strokeCanvas.getContext('2d');
	
	this.init = function(){
		this.setupCanvas();
	}
	
	this.setupCanvas = function(){
		this.layer = 0;
	
		//scene.strokeCanvas.width = 512;
		//scene.strokeCanvas.height = 512;
		
		for(var i=0; i<this.canvas.length; i++){
			this.canvas[i] = null;
			this.context[i] = null;
			this.thumbCanvas[i] = null;
			this.thumbContext[i] = null;
		}
		this.canvas = new Array(3);
		this.context = new Array(3);
		this.thumbCanvas = new Array(3);
		this.thumbContext = new Array(3);
		var elements = document.getElementsByClassName('layer');
		for(var i=0; i<this.canvas.length; i++){
			scene.canvas[i] = document.createElement("canvas");
			scene.context[i] = scene.canvas[i].getContext('2d');
			scene.canvas[i].width = 512;
			scene.canvas[i].height = 512;
			scene.canvas[i].style.position = 'absolute';
			scene.canvas[i].style.zIndex = i;
			scene.canvas[i].style.pointerEvents = 'none';
			scene.canvas[i].className = 'layerCanvas';
			canvasDiv.insertBefore(scene.canvas[i], canvasDiv.firstChild);
			//canvasDiv.appendChild(scene.canvas[i] );
			
			scene.thumbCanvas[i] = document.createElement("canvas");
			scene.thumbContext[i] = scene.thumbCanvas[i].getContext('2d');
			scene.thumbCanvas[i].width = 24;
			scene.thumbCanvas[i].height = 24;
			scene.thumbCanvas[i].style.pointerEvents = 'none';
			scene.thumbCanvas[i].className = "thumbnail";
			elements[2-i].insertBefore(scene.thumbCanvas[i], elements[2-i].firstChild.nextSibling);
			//elements[i].appendChild( );
		}
	}
}