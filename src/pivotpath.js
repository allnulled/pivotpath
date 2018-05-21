/**
 *
 * ## 2. Usage
 *
 * This is a full demonstration of the module:
 *
 * ```js
 * const myPivot = require("pivotpath").generate(__dirname + "/my/folder/with/subPaths");
 * 
 * // a) Generate new paths:
 * 
 * const myControllerPath = myPivot.get("/controllers/myController.js");
 * const myMiddlewarePath = myPivot.get("/middlewares/myMiddleware.js");
 * 
 * // b) Import modules from new paths:
 * 
 * const myController = myPivot.require("/controllers/myController.js");
 * const myMiddleware = myPivot.require("/middlewares/myMiddleware.js");
 * 
 * // c) Call to pure functional modules from new paths:
 * 
 * const myData = myPivot.call("/functions/myFunction.js", {scope:true}, ["Param-1", "Param-2", "Param-3"]);
 * const myOtherData = myPivot.call("/functions/myOtherFunction.js", global, [1,2,3]);
 * 
 * // d) Generate functions that call to pure functional moduoles from new paths:
 * 
 * const app = require("express")(); // This would be a new ExpressJS application.
 * app.get("/", myPivot.function("/controllers/main.js")); // Adds a new controller
 * app.get("/contact", myPivot.function("/controllers/contact.js")); // Adds a new controller
 * app.get("/about", myPivot.function("/controllers/about.js")); // Adds a new controller
 * // ...
 * ```
 * 
 * ## 3. API Reference
 * 
 * 
 * 
 */

const path = require("path");

/**
 * 
 * ----
 * 
 * ### `PivotPath`
 * @from `require("pivotpath")`
 * @type `{Object}`
 * @description The API of the module starts is inside this object.
 */
const PivotPath = {
		/**
		 * 
		 * ----
		 * 
		 * ### `PivotPath.generate(basePath=".")`
		 * @type `{Function}`
		 * @parameter `{String} basePath`. Optional. Path from which all the others will start from. By default: `"."`.
		 * @returns `{Object::PivotPath}`. A `{PivotPath}` fresh instance is returned.
		 * @description Instantiates a new `{Object::PivotPath}` instance, using the provided path as basePath.
		 */
		generate: function(basePath = ".") {
				this.basePath = basePath;
				return this;
		},
		/**
		 * 
		 * ----
		 * 
		 * ### `{PivotPath}.setBasePath(basePath)`
		 * @type `{Function}`
		 * @parameter `{String} basePath`. Required. Path from which all the others will start from.
		 * @returns `{Object::PivotPath}`. A `{PivotPath}` fresh instance is returned.
		 * @description Instantiates a new `{Object::PivotPath}` instance, using the provided path as basePath.
		 * 
		 */
		setBasePath: function(basePath) {
				this.basePath = basePath;
				return this;
		},
		/**
		 * 
		 * ----
		 * 
		 * ### `{PivotPath}.get(subPath)`
		 * @type `{Function}`
		 * @parameter `{String} subPath`. Required. The subPath choosen.
		 * @returns `{String}`. The path generated from the basePath and the subPath.
		 * @description Generates and returns a new path from the union of the basePath and the subPath provided.
		 */
		get: function(subPath) {
				return path.resolve(this.basePath, subPath.replace(/^\//g, ""));
		},

		/**
		 * 
		 * ----
		 * 
		 * ### `{PivotPath}.require(subPath)`
		 * @type `{Function}`
		 * @parameter `{String} subPath`. Required. The subPath choosen.
		 * @returns `{Any}`. The module that is found at the path generated from the basePath and the subPath.
		 * @description Generates a new path from the union of the basePath and the subPath provided and imports the module that is found at that new path.
		 */
		require: function(subPath) {
				const finalPath = path.resolve(this.basePath, subPath.replace(/^\//g, ""));
				const finalModule = require(finalPath);
				return finalModule;
		},

		/**
		 * 
		 * ----
		 * 
		 * ### `{PivotPath}.call(subPath)`
		 * @type `{Function}`
		 * @parameter `{String} subPath`. Required. The subPath choosen.
		 * @parameter `{Any} scope`. Optional. The scope of the call. By default: `null`.
		 * @parameter `{Array<Any>} params`. Optional. The arguments of the call, as `{Array}`. By default: `[]`.
		 * @returns `{Any}`. The result of the call of the module that is found at the path generated from the basePath and the subPath, 
		 * receiving the parameters and applying the indicated scope.
		 * @description Generates a new path from the union of the basePath and the subPath provided and imports the module that is found at that new path,
		 * and afterwards, it calls it, prosupposing that the module imported is always a plain function. It applies the scope and passes the parameters 
		 * provided automatically. Finally, it returns the result of that call.
		 */
		call: function(subPath, scope = null, params = []) {
				const finalPath = path.resolve(this.basePath, subPath.replace(/^\//g, ""));
				const finalModule = require(finalPath);
				const finalResult = finalModule.apply(scope, params);
				return finalResult;
		},

		/**
		 * 
		 * ----
		 * 
		 * ### `{PivotPath}.function(subPath)`
		 * @type `{Function}`
		 * @parameter `{String} subPath`. Required. The subPath choosen.
		 * @parameter `{Any} scope`. Optional. The scope of the call. By default: `null`.
		 * @parameter `{Array<Any>} params`. Optional. The arguments of the call that will be automatically prepended, as `{Array}`. By default: `[]`.
		 * @returns `{Function}`. A function that imports the specified path, and calls to it using the scope provided and prepending the parameters provided.
		 * @description Generates a new path from the union of the basePath and the subPath provided. Then, it returns a function that will import the specified path,
		 * apply the provided scope and prepend the specified parameters, meanwhile it can receive any other parameters.
		 */
		function: function(subPath, scope = null, params = []) {
				const finalPath = path.resolve(this.basePath, subPath.replace(/^\//g, ""));
				const finalFunction = function() {
						const finalModule = require(finalPath);
						return finalModule.apply(scope, params.concat(Array.prototype.slice.call(arguments)));
				};
				return finalFunction;
		}
};



module.exports = PivotPath;