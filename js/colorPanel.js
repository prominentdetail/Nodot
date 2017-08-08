
var color = new colorData();
function colorData(){

	this.mode = 'rgb';
	
	this.picked = [{color:'rgba(0,255,0,1)', e:null, r:0,g:0,b:0, h:0,s:0,l:0},{color:'rgba(255,255,255,1)', e:null, r:255,g:255,b:255, h:0,s:100,l:100}];	
	this.currentColor = 0;
	
	this.init = function(){
		try{
			this.picked[0] = JSON.parse(localStorage.primary) || {color:'rgba(0,255,0,1)', e:null, r:0,g:0,b:0, h:0,s:0,l:0};
			this.picked[1] = JSON.parse(localStorage.secondary) || {color:'rgba(255,255,255,1)', e:null, r:255,g:255,b:255, h:0,s:100,l:100};
		}
		catch(e){
			this.picked[0] = {color:'rgba(0,255,0,1)', e:null, r:0,g:0,b:0, h:0,s:0,l:0};
			this.picked[1] = {color:'rgba(255,255,255,1)', e:null, r:255,g:255,b:255, h:0,s:100,l:100};
			//for some reason I had to do a try/catch because github was giving an error when trying to access a localStorage variable that hadn't been assigned a value yet.
		}
		
		master.e.colorPanel.innerHTML = '\
			<table width="100%"><tr><td>\
				<button id="rgbhslButton" class="buttonIcon ui-rgb-icon" onclick="toggleIcon(this)">&nbsp;</button>\
			</td><td width="1px">\
			<div style="position:relative; vertical-align:top;">\
				<div style="position:relative; width:54px; height:54px; background:none;">\
					<div id="primary" class="picked" style="z-index:1; position:absolute; top:0px; left;0px; width:40px; height:40px;" onclick="color.currentColor=0; this.style.zIndex=1; this.nextElementSibling.style.zIndex=0; "></div>\
					<div id="secondary" class="picked" style="z-index:0; position:absolute; bottom:0px; right:0px; width:40px; height:40px;" onclick="color.currentColor=1; this.style.zIndex=1; this.previousElementSibling.style.zIndex=0; "></div>\
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
		
		color.picked[0].e = document.getElementById('primary');
		color.picked[1].e = document.getElementById('secondary');
		color.picked[0].e.style.backgroundColor = color.picked[0].color;
		color.picked[1].e.style.backgroundColor = color.picked[1].color;
		color.updatePicker();
	}

	this.updatePicker = function(){
		var s = document.getElementsByClassName('colorSlider');
		var v = document.getElementsByClassName('colorValue');
		var c = color.picked[color.currentColor];
		for(i=0; i<s.length; i++) {
			if(color.mode=="rgb"){
				if(i==0){
					s[i].style.width = (c.r/255*100)+"px";
					s[i].parentNode.style.background = 'linear-gradient(to right, rgb(0,'+c.g+','+c.b+') 0%,rgb(255,'+c.g+','+c.b+') 100%)';
					if(v[i].value!=c.r)v[i].value = c.r;
				}else if(i==1){
					s[i].style.width = (c.g/255*100)+"px";
					s[i].parentNode.style.background = 'linear-gradient(to right, rgb('+c.r+',0,'+c.b+') 0%,rgb('+c.r+',255,'+c.b+') 100%)';
					if(v[i].value!=c.g)v[i].value = c.g;
				}else if(i==2){
					s[i].style.width = (c.b/255*100)+"px";
					s[i].parentNode.style.background = 'linear-gradient(to right, rgb('+c.r+','+c.g+',0) 0%,rgb('+c.r+','+c.g+',255) 100%)';
					if(v[i].value!=c.b)v[i].value = c.b;
				}
				c.color = "rgba("+c.r+","+c.g+","+c.b+",1)";
				s[i].style.backgroundColor = c.color;
				c.e.style.backgroundColor = c.color;
			}else{
				if(i==0){
					s[i].style.width = (c.h/360*100)+"px";
					s[i].parentNode.style.background = 'linear-gradient(to right, hsl(0,100%,50%) 0%,hsl(60,100%,50%) 17%,hsl(120,100%,50%) 33%,hsl(180,100%,50%) 50%,hsl(240,100%,50%) 67%,hsl(300,100%,50%) 83%,hsl(0,100%,50%) 100%)';
					if(v[i].value!=c.h)v[i].value = c.h;
				}else if(i==1){
					s[i].style.width = c.s+"px";
					s[i].parentNode.style.background = 'linear-gradient(to right, hsl('+c.h+',0%,'+c.l+'%) 0%,hsl('+c.h+',100%,'+c.l+'%) 100%)';
					if(v[i].value!=c.s)v[i].value = c.s;
				}else if(i==2){
					s[i].style.width = c.l+"px";
					s[i].parentNode.style.background = 'linear-gradient(to right, hsl('+c.h+','+c.s+'%,0%) 0%,hsl('+c.h+','+c.s+'%,100%) 100%)';
					if(v[i].value!=c.l)v[i].value = c.l;
				}
				c.color = 'hsl('+c.h+','+c.s+'%,'+c.l+'%)';
				s[i].style.backgroundColor = c.color;
				c.e.style.backgroundColor = c.color;
			}
		}
		localStorage.primary = JSON.stringify(color.picked[0]);
		localStorage.secondary = JSON.stringify(color.picked[1]);
	}
		
}