/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1]..
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }
  //alert(h*360+","+ s*100+","+ l*100 );
  return [ h*360, s*100, l*100 ];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] (CHANGED, they get divided in function so that they are within 0,1)and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l) {
	h=h/360,s=s/100,l=l/100;
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
//alert(r * 255+","+ g * 255+","+ b * 255);
  return [ r * 255, g * 255, b * 255 ];
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
function rgbToHsv(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;

  var d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h*360, s*100, v*100 ];
/*	var var_R = ( r / 255 );                     //RGB from 0 to 255
	var var_G = ( g / 255 );
	var var_B = ( b / 255 );

	var var_Min = Math.min( var_R, var_G, var_B );    //Min. value of RGB
	var var_Max = Math.max( var_R, var_G, var_B );    //Max. value of RGB
	var del_Max = var_Max - var_Min;             //Delta RGB value 

	var H,S,V = var_Max;

	if ( del_Max == 0 )                     //This is a gray, no chroma...
	{
		H = 0;                                //HSV results from 0 to 1
		S = 0;
	}
	else                                    //Chromatic data...
	{
		S = del_Max / var_Max;

		var del_R = ( ( ( var_Max - var_R ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
		var del_G = ( ( ( var_Max - var_G ) / 6 ) + ( del_Max / 2 ) ) / del_Max;
		var del_B = ( ( ( var_Max - var_B ) / 6 ) + ( del_Max / 2 ) ) / del_Max;

		if ( var_R == var_Max ) H = del_B - del_G;
		else if ( var_G == var_Max ) H = ( 1 / 3 ) + del_R - del_B;
		else if ( var_B == var_Max ) H = ( 2 / 3 ) + del_G - del_R;

		if ( H < 0 ) H += 1;
		if ( H > 1 ) H -= 1;
	}
	return [ H*360, S*100, V*100 ];*/
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function hsvToRgb(h, s, v) {
	h=h/360,s=s/100,v=v/100;
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  return [ r * 255, g * 255, b * 255 ];
}

function rgbToGray(r,g,b){
	//return ((0.2125 * r) + (0.7154 * g) + (0.0721 * b));
	//return ((0.3 * r) + (0.59 * g) + (0.11 * b));
	return ((0.299 * r) + (0.587 * g) + (0.114 * b));
	//return ((0.3 * r) + (0.6 * g) + (0.1 * b));
}

function rgbToXyz(r,g,b){
	var var_R = ( r / 255 );        //R from 0 to 255
	var var_G = ( g / 255 );        //G from 0 to 255
	var var_B = ( b / 255 );        //B from 0 to 255

	if ( var_R > 0.04045 ) var_R = Math.pow( ( var_R + 0.055 ) / 1.055 , 2.4);
	else var_R = var_R / 12.92;
	if ( var_G > 0.04045 ) var_G = Math.pow( ( var_G + 0.055 ) / 1.055 , 2.4);
	else var_G = var_G / 12.92;
	if ( var_B > 0.04045 ) var_B = Math.pow( ( var_B + 0.055 ) / 1.055 , 2.4);
	else var_B = var_B / 12.92;

	var_R = var_R * 100;
	var_G = var_G * 100;
	var_B = var_B * 100;

	//Observer. = 2°, Illuminant = D65
	X = var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805;
	Y = var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722;
	Z = var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505;
	return [ X,Y,Z ];
}

function xyzToLab(x,y,z){
	var var_X = x / 95.047;   //Observer= 2°, Illuminant= D65
	var var_Y = y / 100.000;
	var var_Z = z / 108.883;

	if ( var_X > 0.008856 ) var_X = Math.pow(var_X , 1/3 );
	else var_X = ( 7.787 * var_X ) + ( 16 / 116 );
	if ( var_Y > 0.008856 ) var_Y = Math.pow(var_Y , 1/3 );
	else var_Y = ( 7.787 * var_Y ) + ( 16 / 116 );
	if ( var_Z > 0.008856 ) var_Z = Math.pow(var_Z , 1/3 );
	else var_Z = ( 7.787 * var_Z ) + ( 16 / 116 );

	var L = ( 116 * var_Y ) - 16;
	var a = 500 * ( var_X - var_Y );
	var b = 200 * ( var_Y - var_Z );
	return [L,a,b];
}

function rgbToLab(r,g,b){
	var xyz = rgbToXyz(r,g,b);
	var lab = xyzToLab(xyz[0],xyz[1],xyz[2]);
	return [lab[0],lab[1],lab[2]];
}