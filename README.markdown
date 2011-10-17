An easy way to put a JS object into a structured HTML form.

This library relies on underscore.js and jQuery.js

This is a library based off of the dev branch of form2js https://github.com/maxatwork/form2js .


Adding a name field to a input field will match that against the object you give it and try to fill in the field appropiately.

```
<label>Store number <input type="text" name="ids.store_num" value="" var_type="integer_field" readonly=true/></label>
```

in thise case:
```
test = { id : { store_num : 4} };
```
will place "4" in the value of this input field by calling ``` populateForm(test); ```

it is also possilbe to transform some of the data to fit into the form via a transformer function.

```
function transformer(obj,$node){
    var varType = $node.attr('var_type');
    if(varType){
	switch (varType){
	case "string_array_field":{return obj.join("\n");}
	}
    }
    return obj;
};

populateForm(testData,transformer);
```

the above function will transform data that is supposed to be put into an input with a field of var_type = "string_array_field". the data being submitted is in the form of an array, but the input wants a string, so the case resolves this issue with obj.join("\n");

this is completely controlled by the user. the obj variable is the branch of the object that matches, not the root of the object.

the transformation callback function's second variable is a jQuery object.