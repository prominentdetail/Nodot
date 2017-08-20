/*
By Alex Hanson-White
*/

var tool = new toolData();
function toolData(){
	
	this.button = {eraser:null,pencil:null,magiceraser:null,brush:null,eyedropper:null,paintbucket:null,lasso:null,marquee:null,magicwand:null,hand:null,arrow:null};
	this.properties = {size:50,offsetX:0,offsetY:0,contiguous:false};
	
	this.brushCanvas;	//the brush
	this.brushContext;
	
	this.brushEdge = []; //holds data that is used when creating the brush indicator. This data is updated when adjusting brush size.
	
	
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
		
		var s = document.getElementById('sizeSlider');
		var v = document.getElementById('sizeValue');
		s.style.width = (tool.properties.size/50*100)+"px";
		if(v.value!=tool.properties.size)v.value = tool.properties.size;
				
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
			
			tool.traceBrush();
		}
	}
	
	this.traceBrush = function(){
		var w = tool.brushCanvas.width, h = tool.brushCanvas.height;
		var imgData = tool.brushContext.getImageData(0,0,w,h);
		this.brushEdge = [];
		var sx,sy;
		//find starting point
		for(var y=0; y<h; y++){
			for(var x=0; x<w; x++){
				if(imgData.data[((((y+1)*w)+x+1)*4)+3] > 0){
					sx=x , sy=y;
					x=w, y=h;	//breaks both loops
				}
			}
		}
		if(sx!=null && sy!=null){
			tool.brushEdge.push({x:sx,y:sy} );
			var step = [];
			do{
				step = tool.stepEdge(imgData.data[((((sy)*w)+sx)*4)+3],
					imgData.data[((((sy)*w)+sx+1)*4)+3],
					imgData.data[((((sy+1)*w)+sx)*4)+3],
					imgData.data[((((sy+1)*w)+sx+1)*4)+3]);
				sx+=step[0];
				sy+=step[1];
				tool.brushEdge.push({x:sx,y:sy});
			}while(sx !== tool.brushEdge[0].x || sy !== tool.brushEdge[0].y);
		}
		tool.drawBrushEdge();
	}
	
	this.stepEdge = function(a,b,c,d){
		var sx=0,sy=0;
		//check which way to go
		/*
			if(
			a|b
			-  -
			c|d
			){}
		*/
		if( a == 0 && b == 0 && c == 0 && d == 0 ) sx+=1;
		else if(a == 0 && b > 0 && c == 0 &&	d == 0 ) sx+=1;
		else if(a == 0 && b > 0 && c == 0 && d > 0 ) sy+=1;
		else if(a == 0 && b == 0 && c == 0 && d > 0 ) sy+=1;
		else if(a > 0 && b > 0 && c == 0 && d == 0 ) sx+=1;
		else if(a > 0 && b == 0 && c == 0 && d == 0 ) sy-=1;
		else if(a > 0 && b == 0 && c > 0 && d == 0 ) sy-=1;
		else if(a == 0 && b == 0 && c > 0 && d == 0 ) sx-=1;
		else if(a == 0 && b == 0 && c > 0 && d > 0 ) sx-=1;
		else if(a > 0 && b == 0 && c > 0 && d > 0 ) sy-=1;
		else if(a == 0 && b > 0 && c > 0 && d > 0 ) sx-=1;
		else if(a > 0 && b > 0 && c == 0 && d > 0 ) sy+=1;
		else if(a > 0 && b > 0 && c > 0 && d == 0 ) sx+=1;
		else if(a > 0 && b == 0 && c == 0 && d > 0 ) sy-=1;
		else if(a == 0 && b > 0 && c > 0 && d == 0 ) sx-=1;
		else if(a > 0 && b > 0 && c > 0 && d > 0 ) return;
		return [sx,sy];
	}
	
	this.drawBrushEdge = function(){
		var z = master.zoom;
		contextIndicator.clearRect(0,0,canvasIndicator.width,canvasIndicator.height);
		canvasIndicator.width = tool.brushCanvas.width*z;
		canvasIndicator.height = tool.brushCanvas.height*z;
		
		var strokeColor = 'rgb(255,255,255)';
		//var strokeColor = 'rgb('+Math.round(((255-tileSet.colorbelow.r)*(255-tileSet.prevcolorbelow.r))/255)+','+Math.round(((255-tileSet.colorbelow.g)*(255-tileSet.prevcolorbelow.g))/255)+','+Math.round(((255-tileSet.colorbelow.b)*(255-tileSet.prevcolorbelow.b))/255)+')';
			
		//adding 0.5 ensures the stroke is within a pixel(not between pixels) so that it is drawn crisp
		contextIndicator.beginPath();
		tool.brushEdge.forEach(function(entry){
			if(tool.brushEdge.indexOf(entry)==0)
				contextIndicator.moveTo(0.5+entry.x*z,0.5+entry.y*z);
			else
				contextIndicator.lineTo(0.5+entry.x*z,0.5+entry.y*z);
		});
		contextIndicator.lineTo(0.5+tool.brushEdge[0].x*z,0.5+tool.brushEdge[0].y*z);
	
		contextIndicator.lineWidth = 1;
		contextIndicator.strokeStyle = strokeColor;
		contextIndicator.stroke();
		
	}
	
}