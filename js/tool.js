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
	
	this.drawPencil = function(){
		scene.context[scene.layer].drawImage(tool.brushCanvas,mouse.canvasX-tool.properties.offsetX,mouse.canvasY-tool.properties.offsetY);
		//ctx.drawImage(img,10,10);
	}
	
	this.drawLine = function(sx,sy,ex,ey){
		
		this.hasDrawn=true;
		//masked will be used in case of selection tool (when/if implemented), to prevent drawing outside of selection
		//var masked=selection.edge.length>0?true:false;

		//bresenham's line algorith via wiki
		var x0 = sx;
		var y0 = sy;
		var x1 = ex;
		var y1 = ey;
		var t1 = ex;
		var t2 = ey;
		
		var steep = 0;
		if(Math.abs(y1 - y0) > Math.abs(x1 - x0)) steep = 1;
		if (steep == 1){
			t1 = x0;
			t2 = x1;
			x0 = y0;
			x1 = y1;
			y0 = t1;
			y1 = t2;
		}
		if (x0 > x1){
			t1 = x0;
			t2 = y0;
			x0 = x1;
			y0 = y1;
			x1 = t1;
			y1 = t2;
		}
		var deltax = x1 - x0;
		var deltay = Math.abs(y1 - y0);
		var error = deltax / 2;
		var ystep;
		var y = y0;
		if (y0 < y1){
			ystep = 1;
		} else {
			ystep = -1;
		}
		
		var savederror = error;
		var savedy = y;
		
		y = savedy;
		error = savederror;
		
		for( var x = x0; x != x1; x = x - ((x-x1)/Math.abs(x-x1)) ){
			if (steep == 1){
				scene.context[scene.layer].drawImage(tool.brushCanvas,y-tool.properties.offsetX,x-tool.properties.offsetY);
				/*if(masked){
					this.editContext.globalCompositeOperation = 'destination-in';
					this.editContext.drawImage(selection.resizedCanvas,selection.resize.x,selection.resize.y);
					this.editContext.globalCompositeOperation = 'source-over';
				}*/
				//this.signalDraw(y,x,color,mode);
						
			} else {
				scene.context[scene.layer].drawImage(tool.brushCanvas,x-tool.properties.offsetX,y-tool.properties.offsetY);
				/*if(masked){
					this.editContext.globalCompositeOperation = 'destination-in';
					this.editContext.drawImage(selection.resizedCanvas,selection.resize.x,selection.resize.y);
					this.editContext.globalCompositeOperation = 'source-over';
				}*/
				//this.signalDraw(x,y,color,mode);
			
			}
			var error = error - deltay;
			if (error < 0){
				y = y + ystep;
				error = error + deltax;
			}
		}
		
		scene.context[scene.layer].drawImage(tool.brushCanvas,ex-tool.properties.offsetX,ey-tool.properties.offsetY);
		/*if(masked){
			this.editContext.globalCompositeOperation = 'destination-in';
			this.editContext.drawImage(selection.resizedCanvas,selection.resize.x,selection.resize.y);
			this.editContext.globalCompositeOperation = 'source-over';
		}*/
		//this.signalDraw(ex,ey,color,mode);
		

	}
	
	
}