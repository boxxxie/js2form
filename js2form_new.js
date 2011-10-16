/*
 * requires: 
 * underscore.js
 * jQuery.js
 */

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
function o2a(obj,prefix){

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
		 {return o2a(item.value,item.name);})
	    .flatten()
	    .union(completed)
	    .value();
    }
};

//matches a name from {name: ...} to a string
function nameMatch(name){
    return function(item){
	return (item.name == name);
    };
};

function nodesProcessor(jsObj,nodes,callback){
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

    var arr = o2a(js);
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