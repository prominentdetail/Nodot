
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
