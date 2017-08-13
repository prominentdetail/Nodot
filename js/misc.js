
function setupDom(){
	document.getElementById('colorPanel').innerHTML = '\
			<table width="100%"><tr><td>\
				<button id="rgbhslButton" class="buttonIcon ui-rgb-icon" onclick="toggleIcon(this)">&nbsp;</button>\
			</td><td width="1px">\
			<div style="position:relative; vertical-align:top;">\
				<div style="position:relative; width:54px; height:54px; background:none;">\
					<div id="primary" class="picked" style="z-index:1; position:absolute; top:0px; left;0px; width:40px; height:40px;" onclick="color.currentColor=0; color.updatePicker(); this.style.zIndex=1; this.nextElementSibling.style.zIndex=0; "></div>\
					<div id="secondary" class="picked" style="z-index:0; position:absolute; bottom:0px; right:0px; width:40px; height:40px;" onclick="color.currentColor=1; color.updatePicker(); this.style.zIndex=1; this.previousElementSibling.style.zIndex=0; "></div>\
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
		
	document.getElementById('toolPropertyPanel').innerHTML = '\
			<div style="display:inline-block; vertical-align:middle; padding-left:21px;">\
				<div id="size" class="sliderBG"><div id="sizeSlider" class="slider"></div></div>\
			</div>\
			<div style="display:inline-block; vertical-align:middle; font-size:10px;">\
				<input type="text" id="sizeValue" data-clickvalue="0" class="value" maxlength="3"><br>\
			</div>\
		';
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
