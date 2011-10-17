/*
 * requires: 
 * underscore.js
 * jQuery.js
 */
var populateForm = (function (){
     function isSimpleVal(val){
	 if(_.isArray(val)){return false;}
	 if(_.isString(val)||
	    _.isNumber(val)||
	    _.isBoolean(val)||
	    _.isDate(val)||
	    _.isNaN(val)||
	    _.isNull(val)||
	    _.isUndefined(val)){return true;}
	 return false;
     }
     function valueIsSimple(item){
	 return isSimpleVal(item.value);
     }
     function valueIsComplex(item){
	 return !valueIsSimple(item);
     }
     function applyPrefix(name,prefix){
	 if(_.isUndefined(prefix)){
	     return name;
	 }
	 else if(_.isNumber(parseInt(name))){
	     return prefix + "["+ name +"]";
	 }
	 else{
	     return prefix + "." + name;
	 }
     };
     function object2array(obj,prefix){

	 var keys = _.keys(obj);
	 var vals = _.values(obj);
	 var firstStep = _(_.zip(keys,vals)).chain()
	     .map(function(keyVal){
		      var key = keyVal[0];
		      var val = keyVal[1];
		      return {name: applyPrefix(key,prefix), value:val};
		  })
	     .value();
	 var completed = _.filter(firstStep,valueIsSimple);
	 var toBeWorkedOn = _.filter(firstStep,valueIsComplex);

	 if(_.isEmpty(toBeWorkedOn)){
	     return completed;
	 }
	 else{
	     return _(toBeWorkedOn)
		 .chain()
		 .map(function(item)
		      {return object2array(item.value,item.name);})
		 .flatten()
		 .union(completed)
		 .value();
	 }
     };

     function recursiveTrav(obj,travel){
	 if(_.isEmpty(travel)){
	     return obj;
	 }
	 if(!obj){
	     return null;
	 }
	 var prop = _.first(travel);
	 return recursiveTrav(obj[prop],_.rest(travel));
     };

     function recursiveAssign(obj,travel,toAssign){
	 if(_.isEmpty(travel)){
	     obj = toAssign;
	     return obj;
	 }
	 if(!obj){
	     return null;
	 }
	 var prop = _.first(travel);
	 obj[prop] = recursiveAssign(obj[prop],_.rest(travel),toAssign);
	 return obj;
     };
     //matches a name from {name: ...} to a string
     function nameMatch(name){
	 return function(item){
	     return (item.name == name);
	 };
     };

     function nodesProcessor(obj,nodes,callback){
	 _.each(nodes,function(node){ 
		    var $node = $(node);
		    var varType = $node.attr('var_type');
		    var nodeName = $node.attr('name');
		    var varPath = nodeName.split(".");
		    var objPropToChange = recursiveTrav(obj,varPath);

		    if(nodeName || objPropToChange){
			obj = recursiveAssign(obj,
					      varPath,
					      callback(objPropToChange,$node));
		    }
		});
	 return obj;
     };
     function nodesProcessor_old(jsObj,nodes,callback){
	 function jsNodeProcessor(obj){
	     return function nodeProcessor(node){
		 return callback(obj,node);
	     };
	 };
	 var jsObjNodeProcessor = jsNodeProcessor(jsObj);
	 _.each(nodes,function(node){ 
		    jsObj = jsObjNodeProcessor(node);
		});
	 return jsObj;
     };

     function formElementPopulator($node,value){
	 $node.val(value);
	 if($node.attr('type') == 'checkbox' && value){
	     $node.attr('checked',value);
	 }
     };

     function populateForm(js,transformer){
	 var nodesToPopulate = document.querySelectorAll('[name]');
	 if(!_.isUndefined(transformer)){
	     js = nodesProcessor(js,nodesToPopulate,transformer);
	 }

	 var arr = object2array(js);
	 _(nodesToPopulate)
	     .chain()
	     .each(function(item){
		       var $item = $(item);
		       var nameAtt = $item.attr('name');
		       var itemForForm = _.detect(arr,nameMatch(nameAtt));
		       var valForForm = itemForForm.value;
		       formElementPopulator($item,valForForm);
		   });
     }
})();