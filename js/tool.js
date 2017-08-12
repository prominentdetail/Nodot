/*
By Alex Hanson-White
*/

var tool = new toolData();
function toolData(){
	
	this.button = {eraser:null,pencil:null,magiceraser:null,brush:null,eyedropper:null,paintbucket:null,lasso:null,marquee:null,magicwand:null,hand:null,arrow:null};
	this.properties = {size:50,offsetX:0,offsetY:0,contiguous:false};
	
	this.brushCanvas;	//the brush
	this.brushContext;
	
	
	this.init = function(){
		
		this.brushCanvas = document.createElement('canvas');
		this.brushCanvas.width = 50;
		this.brushCanvas.height = 50;
		this.brushContext = this.brushCanvas.getContext('2d');
		
		//tool.brushCanvas.style.position = 'absolute';
		//tool.brushCanvas.style.zIndex = i;
		tool.brushCanvas.style.pointerEvents = 'none';
		master.e.toolPropertyPanel.appendChild(tool.brushCanvas );
		
		tool.updateBrush();
	}
	
	this.updateBrush = function(){
		var size = tool.properties.size;
		if(size==0)size=0.5;
		
		if(typeof tool.brushContext === 'undefined'){
		}else{
			var canvas = tool.brushCanvas;
			var ctx = tool.brushContext;
			
			var odd = ( (size*2) % 2 == 1 ? 1 : 0 );
			canvas.width = (size*2)+4+odd;	//if odd number, add 1 to the width/height so that the brushline function deals with stuff accurately
			canvas.height = (size*2)+4+odd;
			
			var centerX = (canvas.width * 0.5)+0.5-(size==0.5?0.5:0);
			var centerY = (canvas.height * 0.5)+0.5-(size==0.5?0.5:0);
			
			tool.properties.offsetX = Math.floor(tool.brushCanvas.width*0.5);
			tool.properties.offsetY = Math.floor(tool.brushCanvas.height*0.5);
			
			ctx.fillStyle = color.picked[color.currentColor].color;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			var radius = size * size;
			for(var y=0; y<canvas.height; y++){
				for(var x=0; x<canvas.width; x++){
					var dx = x - centerX;
					var dy = y - centerY;
					var distance = dx * dx + dy * dy;

					if (distance <= radius ){
						//imgData.data[(((y*canvas.width)+x)*4)+3] = 1;
						ctx.fillRect(x, y, 1, 1);
					}
				}
			}
			
			//selection.traceBrush();
		}
	}
}