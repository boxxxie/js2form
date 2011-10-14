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
    if(u.isUndefined(prefix)){
	return name;
    }
    else if(u.isNumber(parseInt(name))){
	return prefix + "["+ name +"]";
    }
    else{
	return prefix + "." + name;
    }
};
function o2a(obj,prefix){

    var keys = u.keys(obj);
    var vals = u.values(obj);
    var firstStep = _(_.zip(keys,vals)).chain()
	.map(function(keyVal){
		 var key = keyVal[0];
		 var val = keyVal[1];
		 return {name: applyPrefix(key,prefix), value:val};
	     })
	.value();
    var completed = _.filter(firstStep,valueIsSimple);
    var toBeWorkedOn = _.filter(firstStep,valueIsComplex);

    if(u.isEmpty(toBeWorkedOn)){
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

function nameMatch(name){
    return function(item){
	return (item.name == name);
    };
};

function populateForm(js){
    var arr = o2a(js);
    _(document.querySelectorAll('[name]'))
	.chain()
	.each(function(item){
		 var nameAtt = $(item).attr('name');
		 var formVal = _.detect(arr,nameMatch).value;
		 $(item).val(formVal);
	     })
	.value();
}