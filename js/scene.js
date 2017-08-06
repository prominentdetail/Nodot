
var scene = new sceneData();
function sceneData(){
	this.canvas = [];
	this.context = [];
	this.layer = 0;	//the index number of the current canvas

	this.init = function(){
		this.setupCanvas();
	}
	
	this.setupCanvas = function(){
		this.layer = 0;
		
		for(var i=0; i<this.canvas.length; i++){
			this.canvas[i] = null;
			this.context[i] = null;
		}
		this.canvas = new Array(5);
		this.context = new Array(5);
		for(var i=0; i<this.canvas.length; i++){
			scene.canvas[i] = document.createElement("canvas");
			scene.context[i] = scene.canvas[i].getContext('2d');
			scene.canvas[i].width = 512;
			scene.canvas[i].height = 512;
			scene.canvas[i].style.position = 'absolute';
			scene.canvas[i].style.zIndex = i;
			scene.canvas[i].style.pointerEvents = 'none';
			canvasDiv.appendChild(scene.canvas[i] );
		}
	}
}