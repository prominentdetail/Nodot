/*
By Alex Hanson-White
*/

var tool = new toolData();
function toolData(){
	
	this.mode = "pencil";	//pencil, eraser
	this.preventDraw = false;		//used if pressing alt when first clicking- signals not to draw
	this.hasDrawn=false;
	
	this.mouse = {x:0,y:0,prevX:0,prevY:0,lastX:0,lastY:0,lastPrevX:0,lastPrevY:0};	//lastX etc is the previous stroke data
	this.properties = {size:5,opacity:100,hardness:100,levels:1,dither:{x:0,y:0},pressure:1,tilt:{x:0,y:0,amount:0},
		offsetX:0,offsetY:0,contiguous:false,straight:"none",lineX:-1,lineY:-1,line:false};
	
	this.canvas;	//copy of tile we're editing
	this.context;
	this.editCanvas;	//the drawing part that will be added/removed when mouseup
	this.editContext;
	this.brushEditCanvas;	//when using brush or magic eraser, we need to record where we've drawn, to check whether to change color based on it.
	this.brushEditContext;
	this.brushCanvas;	//the brush
	this.brushContext;
	
	
	this.button = {eraser:null,pencil:null,magiceraser:null,brush:null,eyedropper:null,paintbucket:null,lasso:null,marquee:null,magicwand:null,hand:null,arrow:null};
	this.eraserTimeout;
	this.eraserType = (typeof(Storage) !== "undefined" && checkJSON('eraserType')!=null ? JSON.parse(localStorage.eraserType) : "eraser");
	this.pencilTimeout;
	this.pencilType = (typeof(Storage) !== "undefined" && checkJSON('pencilType')!=null ? JSON.parse(localStorage.pencilType) : "pencil");
	
	//brush stuff
	this.pen = {s:"none",o:"none",h:"none",l:"none"};
	this.current_preset = 0;
	this.preset = (typeof(Storage) !== "undefined" && checkJSON('brushpreset')!=null ? JSON.parse(localStorage.brushpreset) : [
	{size:10,opacity:255,hardness:20,levels:10,pen:{s:'none',o:'none',h:'none',l:'none'}},
	{size:0.5,opacity:255,hardness:20,levels:1,pen:{s:'none',o:'none',h:'none',l:'none'}},
	{size:5,opacity:255,hardness:20,levels:10,pen:{s:'none',o:'none',h:'none',l:'none'}},
	{size:10,opacity:255,hardness:20,levels:10,pen:{s:'none',o:'none',h:'none',l:'none'}},
	{size:10,opacity:255,hardness:1,levels:4,pen:{s:'none',o:'none',h:'none',l:'none'}},
	{size:10,opacity:255,hardness:1,levels:6,pen:{s:'none',o:'none',h:'none',l:'none'}},
	{size:10,opacity:255,hardness:10,levels:10,pen:{s:'none',o:'none',h:'none',l:'none'}},
	{size:10,opacity:255,hardness:20,levels:10,pen:{s:'none',o:'none',h:'none',l:'none'}},
	{size:10,opacity:255,hardness:20,levels:10,pen:{s:'none',o:'none',h:'none',l:'none'}},
	{size:10,opacity:255,hardness:20,levels:10,pen:{s:'none',o:'none',h:'none',l:'none'}}
	]);	//array of brush presets 
	
	
	this.init = function(){
	
		//when app loads, it will get preset data from localstorage. We then assign the pen this information so that tablet works from the start.
		this.pen = this.preset[this.current_preset].pen;
		
		this.canvas = scene.canvas[0];
		this.context = scene.context[0];
		
		this.editCanvas = document.createElement('canvas');
		this.editCanvas.width = 512;
		this.editCanvas.height = 512;
		this.editContext = this.editCanvas.getContext('2d');
		this.brushEditCanvas = document.createElement('canvas');
		this.brushEditCanvas.width = 512;
		this.brushEditCanvas.height = 512;
		this.brushEditContext = this.brushEditCanvas.getContext('2d');
		this.brushCanvas = document.createElement('canvas');
		this.brushCanvas.width = 54;
		this.brushCanvas.height = 54;
		this.brushContext = this.brushCanvas.getContext('2d');
		
		//this.brushContext  = document.getCSSCanvasContext('2d', 'brush', 16, 16);
		//this.brushCanvas = this.brushContext.canvas;
		
	}
	
	this.refreshTool = function(){
	
	}
}