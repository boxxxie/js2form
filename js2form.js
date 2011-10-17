/*
 * requires: 
 * underscore.js
 * jQuery.js
 */
var populateForm = 
    (function (){
	 function getFromPath(obj,travel){
	     //walks a path defined by an array of fields, returns the last field walked
	     if(_.isEmpty(travel)){
		 return obj;
	     }
	     if(!obj){
		 return null;
	     }
	     var prop = _.first(travel);
	     return getFromPath(obj[prop],_.rest(travel));
	 };
	 function assignFromPath(obj,travel,assignVal){
	     //walks a path defined by an array of fields, assigns a value to the last field walked
	     if(_.isEmpty(travel)){
		 obj = assignVal;
		 return obj;
	     }
	     if(!obj){
		 return null;
	     }
	     var prop = _.first(travel);
	     obj[prop] = assignFromPath(obj[prop],_.rest(travel),assignVal);
	     return obj;
	 };	 
	 function jsPather(pathStr){
	     //converts js obj notation into a path array
	    return pathStr
		 .replace(/\[/g,'.')
		 .replace(/\]/g,'')
		 .split(".");
	 };
	 function nodesProcessor(obj,nodes,callback,pather){
	     /*changes the shape of the obj to suit the form
	      *e.g. {i : ["1","2","3"]} -> {i:"123"} 
	      */
	     if(_.isUndefined(pather)){
		 pather = jsPather;
	     }
	     _.each(nodes,function(node){ 
			var $node = $(node);
			var varType = $node.attr('var_type');
			var nodeName = $node.attr('name');
			var varPath = pather(nodeName);
			var objPropToChange = getFromPath(obj,varPath);
			if(nodeName || objPropToChange){
			    obj = assignFromPath(obj,
						  varPath,
						  callback(objPropToChange,$node));
			}
		    });
	     return obj;
	 };
	 function formElementPopulator($node,value){
	     //sets the value of an element in a form. some elements require special treatment (checkboxs)
	     $node.val(value);
	     if($node.attr('type') == 'checkbox' && value){
		 $node.attr('checked',value);
	     }
	 };
	 //FIXME: make it so that this will work on a single form. right now it operates on the whole page
	 return function populateForm(obj,transformer,pather){
	     var nodesToPopulate = document.querySelectorAll('[name]');
	     if(_.isUndefined(pather)){
		 pather = jsPather;
	     }
	     if(!_.isUndefined(transformer)){
		 obj = nodesProcessor(obj,nodesToPopulate,transformer,pather);
	     }
	     _.each(nodesToPopulate,function(item){
			var $item = $(item);
			var nameAtt = $item.attr('name');
			var path = pather(nameAtt);
			var valForForm = getFromPath(obj,path);
			formElementPopulator($item,valForForm);
		    });
	 };
     })();