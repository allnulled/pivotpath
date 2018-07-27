 


# pivotpath

![](https://img.shields.io/badge/pivotpath-v1.1.2-green.svg) ![](https://img.shields.io/badge/tests-passing-green.svg) ![](https://img.shields.io/badge/coverage-100%25-green.svg) ![](https://img.shields.io/badge/stable-100%25-green.svg)

Node.js module to easily create composed paths. It can:

 · Generate new paths (as strings).

 · Import modules from new paths (as `require(~)` would normally do).

 · Call to pure functional modules from new paths (as `require(~)(~)` would normally do).

 · Generate functions that call to pure functional modules from new paths. This is useful for 
ExpressJS middlewares or controllers, for example, as they can be imported directly by a string,
while this module takes care of generating and passing the proper parameters. See the examples to
easily catch the idea.

## 1. Installation

`~$ npm install --save pivotpath`




 


## 2. Usage

This is a full demonstration of the module:

```js
////////
//////
////
// Intro) Generate a new PivotPath instance
const myPivot = require("pivotpath").generate(__dirname + "/my/folder/with/subPaths");

////////
//////
////
// a) Generate new paths:

const myControllerPath = myPivot.get("/controllers/myController.js");
const myMiddlewarePath = myPivot.get("/middlewares/myMiddleware.js");

////////
//////
////
// b) Import modules from new paths:

const myController = myPivot.require("/controllers/myController.js");
const myMiddleware = myPivot.require("/middlewares/myMiddleware.js");
// alternatively, you could use: myPivot.requireNewly(...) [to clear cache everytime it is executed]

////////
//////
////
// c) Call to pure functional modules from new paths:

const myData = myPivot.call("/functions/myFunction.js", {scope:true}, ["Param-1", "Param-2", "Param-3"]);
const myOtherData = myPivot.call("/functions/myOtherFunction.js", global, [1,2,3]);
// alternatively, you could use: myPivot.callNewly(...) [to clear cache everytime it is executed]

////////
//////
////
// d) Generate functions that call to pure functional moduoles from new paths:

const app = require("express")(); // This would be a new ExpressJS application.
app.get("/", myPivot.function("/controllers/main.js")); // Adds a new controller
app.get("/contact", myPivot.function("/controllers/contact.js")); // Adds a new controller
app.get("/about", myPivot.function("/controllers/about.js")); // Adds a new controller
// alternatively, you could use: myPivot.functionNewly(...) [to clear cache everytime it is executed]

```

## 3. API Reference






 


----

### `PivotPath`

**From:** `require("pivotpath")`

**Type:** `{Class}`

**Description:** The API of the module starts is inside this object.



 


----

### `PivotPath.generate(basePath=".")`

**Access:** `{Static}`

**Type:** `{Class method}`

**Parameter:** `{String} basePath`. Optional. Path from which all the others will start from. By default: `"."`.

**Returns:** `{PivotPath}`. A `{PivotPath}` fresh instance is returned.

**Description:** Instantiates a new `{PivotPath}` instance, using the provided path as basePath.



 


----

### `PivotPath#setBasePath(basePath)`

**Type:** `{Function}`

**Parameter:** `{String} basePath`. Required. Path from which all the others will start from.

**Returns:** `{PivotPath}`. A `{PivotPath}` fresh instance is returned.

**Description:** Instantiates a new `{PivotPath}` instance, using the provided path as basePath.




 


----

### `PivotPath#get(subPath)`

**Type:** `{Function}`

**Parameter:** `{String} subPath`. Required. The subPath choosen.

**Returns:** `{String}`. The path generated from the basePath and the subPath.

**Description:** Generates and returns a new path from the union of the basePath and the subPath provided.



 


----

### `PivotPath#require(subPath)`

**Type:** `{Function}`

**Parameter:** `{String} subPath`. Required. The subPath choosen.

**Returns:** `{Any}`. The module that is found at the path generated from the basePath and the subPath.

**Description:** Generates a new path from the union of the basePath and the subPath provided and imports the module that is found at that new path.



 


----

### `PivotPath#requireNewly(subPath)`

**Type:** `{Function}`

**Parameter:** `{String} subPath`. Required. The subPath choosen.

**Returns:** `{Any}`. The module that is found at the path generated from the basePath and the subPath.

**Description:** This method does the same as the `PivotPath#require(...)` method, but it clears the cache of the module before requiring it.



 


----

### `PivotPath#call(subPath)`

**Type:** `{Function}`

**Parameter:** `{String} subPath`. Required. The subPath choosen.

**Parameter:** `{Any} scope`. Optional. The scope of the call. By default: `null`.

**Parameter:** `{Array<Any>} params`. Optional. The arguments of the call, as `{Array}`. By default: `[]`.

**Returns:** `{Any}`. The result of the call of the module that is found at the path generated from the basePath and the subPath, 
receiving the parameters and applying the indicated scope.

**Description:** Generates a new path from the union of the basePath and the subPath provided and imports the module that is found at that new path,
and afterwards, it calls it, prosupposing that the module imported is always a plain function. It applies the scope and passes the parameters 
provided automatically. Finally, it returns the result of that call.



 


----

### `PivotPath#callNewly(subPath)`

**Type:** `{Function}`

**Parameter:** `{String} subPath`. Required. The subPath choosen.

**Parameter:** `{Any} scope`. Optional. The scope of the call. By default: `null`.

**Parameter:** `{Array<Any>} params`. Optional. The arguments of the call, as `{Array}`. By default: `[]`.

**Returns:** `{Any}`. The result of the call of the module that is found at the path generated from the basePath and the subPath, 
receiving the parameters and applying the indicated scope.

**Description:** This method does the same as the `PivotPath#call(...)` method, but it clears the cache of the module before requiring it.



 


----

### `PivotPath#function(subPath)`

**Type:** `{Function}`

**Parameter:** `{String} subPath`. Required. The subPath choosen.

**Parameter:** `{Any} scope`. Optional. The scope of the call. By default: `null`.

**Parameter:** `{Array<Any>} params`. Optional. The arguments of the call that will be automatically prepended, as `{Array}`. By default: `[]`.

**Returns:** `{Function}`. A function that imports the specified path, and calls to it using the scope provided and prepending the parameters provided.

**Description:** Generates a new path from the union of the basePath and the subPath provided. Then, it returns a function that will import the specified path,
apply the provided scope and prepend the specified parameters, meanwhile it can receive any other parameters. Note that, if you understood well how this 
method works, you understand that this method will only work well when the module that is being required is a function itself.



 


----

### `PivotPath#functionNewly(subPath)`

**Type:** `{Function}`

**Parameter:** `{String} subPath`. Required. The subPath choosen.

**Parameter:** `{Any} scope`. Optional. The scope of the call. By default: `null`.

**Parameter:** `{Array<Any>} params`. Optional. The arguments of the call that will be automatically prepended, as `{Array}`. By default: `[]`.

**Returns:** `{Function}`. A function that imports the specified path, and calls to it using the scope provided and prepending the parameters provided.

**Description:** This method does the same as the `PivotPath#function(...)` method, but it clears the cache of the module before requiring it.



 


## 4. Commands (npm run *)

To build the project (clean and install dependencies):

~$ `npm run build`

To pass the tests:

~$ `npm run test`

To pass the tests and generate the coverage reports:

~$ `npm run coverage`

To clean regenerable directories:

~$ `npm run clean`

To generate the documentation from Javadoc comments:

~$ `npm run docs`



## 5. Conclusion

Very simple module, but can be useful for shortening some repetitive codes, and improve easily
the readability of your code.





# Read this file
