const u = require("./underscore");

//this is mainly for testing

var testVal = {
   "_id": "HB - test",
   "_rev": "1-a8cb317e9e4faf750d675843cb91c58e",
   "ids": {
       "chain": "hero burger",
       "chain_min": "HB",
       "store": "test store",
       "store_min": "test",
       "store_num": -1
   },
   "address": {
       "country": "Canada",
       "street": [
           "adfaf",
           "asdfasdf",
           "asdf"
       ],
       "city": "Toronto",
       "state_prov": "Ontario",
       "zip_postal": "M5N L7z",
       "phones": [
	   [123,456,789],
           "23452435",
           "23452345",
           "23452345"
       ],
       "emails": [
	   {"emails": [
               "a@a",
               "b@b",
               "c@c"
	   ]},
           "a@a",
           "b@b",
           "c@c"
       ]
   },
   "contact": "tony",
   "operation_hours": [
       {
           "days": "asdfasfd",
           "hours": "asfdasdf"
       },
       {
           "days": "wrtt",
           "hours": "rw"
       }
   ],
   "taxes": [
       {
           "taxId": "0",
           "number": "23452345",
           "percent": 4
       },
       {
           "taxId": "1",
           "number": "24352345",
           "percent": 5
       },
       {
           "taxId": "2",
           "number": "235235",
           "percent": 6
       }
   ],
   "exemption": {
       "amount": "5.99",
       "enabled": true
   },
   "website": "www.heroburger.com"
};

function isSimpleVal(val){
    if(u.isArray(val)){return false;}
    if(u.isString(val)||
       u.isNumber(val)||
       u.isBoolean(val)||
       u.isDate(val)||
       u.isNaN(val)||
       u.isNull(val)||
       u.isUndefined(val)){return true;}
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
    var firstStep = u(u.zip(keys,vals)).chain()
	.map(function(keyVal){
		 var key = keyVal[0];
		 var val = keyVal[1];
		 return {name: applyPrefix(key,prefix), value:val};
	     })
	.value();
    var completed = u.filter(firstStep,valueIsSimple);
    var toBeWorkedOn = u.filter(firstStep,valueIsComplex);

    if(u.isEmpty(toBeWorkedOn)){
	return completed;
    }
    else{
	return u(toBeWorkedOn)
	    .chain()
	    .map(function(item)
		 {return o2a(item.value,item.name);})
	    .flatten()
	    .union(completed)
	    .value();
    }
};

console.log(o2a(testVal));