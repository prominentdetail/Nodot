
var color = new colorData();
function colorData(){

	this.mode = 'rgb';
	
	this.picked = [{color:'rgba(0,255,0,1)', e:null, r:0,g:0,b:0, h:0,s:0,l:0},{color:'rgba(255,255,255,1)', e:null, r:255,g:255,b:255, h:0,s:100,l:100}];	
	this.currentColor = 0;
	
	this.init = function(){
		this.picked[0] = JSON.parse(localStorage.getItem("primary")) || {color:'rgba(0,255,0,1)', e:null, r:0,g:0,b:0, h:0,s:0,l:0};
		this.picked[1] = JSON.parse(localStorage.getItem("secondary")) || {color:'rgba(255,255,255,1)', e:null, r:255,g:255,b:255, h:0,s:100,l:100};
		//github was giving an error when trying to access a localStorage variable that hadn't been assigned a value yet. Trying getItem, so see if it solves the issue.
		
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