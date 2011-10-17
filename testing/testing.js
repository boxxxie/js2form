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
	       
	       function transformer(obj,$node){
		   var varType = $node.attr('var_type');
		   if(varType){
		       switch (varType){
		       case "string_array_field":{return obj.join("\n");}
		       }
		   }
		   return obj;
	       };

	       var $form = $("#testForm").find("[name]");
	       populateForm($form,testData,'name',transformer);
	   });