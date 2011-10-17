An easy way to put a JS object into a structured HTML form.

This library relies on underscore.js and jQuery.js

This is a library based off of the dev branch of form2js https://github.com/maxatwork/form2js .


currently this will work with any HTML elements with the proper attributes set. in the future (when someone requests it) i'll make this work on a per form basis.


Adding a name field to a input field will match that against the object you give it and try to fill in the field appropiately.

```
<label>Store number <input type="text" name="ids.store_num" value="" var_type="integer_field" readonly=true/></label>
```

in thise case:
```
test = { ids : { store_num : 4} };
```
will place "4" in the value of this input field by calling ``` populateForm(test); ```

it is also possilbe to transform some of the data to fit into the form via a transformer function.

```javascript
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

the above function will transform data that is supposed to be put into an input with a field of ``` var_type = "string_array_field" ``` . The data being submitted is in the form of an array, but the input wants a string, so the case resolves this issue with ``` obj.join("\n");```

this is completely controlled by the user. the obj variable is the branch of the object that matches, not the root of the object.

the transformation callback function's second variable is a jQuery object.

populateForm takes in a 3rd argument that is a path transformation function. by default it transforms JS object notation into a path array. eg ``` name.name[3][4] -> [name,name,3,4] ``` you can make your own functions and have any notation you like so long as the path translation function outputs a path array. so below, ``` name="ids.store_num" ``` gets translated into ``` [ids,store_num] ```. if you want a different notation then simply supply a function that translates it and pass it to populateForm().

```
<label>Store number <input type="text" name="ids.store_num" value="" var_type="integer_field" readonly=true/></label>
```