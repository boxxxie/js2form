$(document)
    .ready(function() {
	       var testData = {
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
			   "23452435",
			   "23452345",
			   "23452345"
		       ],
		       "emails": [
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

	       /*
		* The 3 functions below are for transforming the js datastructure to conform to the form structure in the HTML
		* extract/simplify these so that a user only needs to implement one function and that it is simple.
		* */
	       function recursiveTrav(obj,travel){
		   if(_.isEmpty(travel)){
		       return obj;
		   }
		   if(!obj){
		       return null;
		   }
		   var prop = travel.shift();
		   return recursiveTrav(obj[prop],travel);
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
	       function transformer(obj,node){
		   node = $(node);
		   var nodeClass = node.attr('class');//TODO:change to var_name and var_type
		   var nodeName = node.attr('name');
		   var objPropToChange = recursiveTrav(obj,nodeName.split("."));

		   if(!nodeName){
		       return obj;
		   }
		   if(!objPropToChange){
		       return obj;
		   }
		   if(!nodeClass){
		       return obj;
		   }

		   switch (nodeClass){
		   case "string_array_field":{
		       obj = recursiveAssign(obj,nodeName.split("."), objPropToChange.join("\n"));
		       console.log(recursiveTrav(obj,nodeName.split(".")));
		       break;}
		   }
		   return obj;
	       };

	       populateForm(testData,transformer);
	   });