/**
 *
 * # pivotpath
 *
 * ![](https://img.shields.io/badge/pivotpath-v1.1.2-green.svg) ![](https://img.shields.io/badge/tests-passing-green.svg) ![](https://img.shields.io/badge/coverage-100%25-green.svg) ![](https://img.shields.io/badge/stable-100%25-green.svg)
 *
 * Node.js module to easily create composed paths. It can:
 *
 *   · Generate new paths (as strings).
 *
 *   · Import modules from new paths (as `require(~)` would normally do).
 *
 *   · Call to pure functional modules from new paths (as `require(~)(~)` would normally do).
 *
 *   · Generate functions that call to pure functional modules from new paths. This is useful for 
 * ExpressJS middlewares or controllers, for example, as they can be imported directly by a string,
 * while this module takes care of generating and passing the proper parameters. See the examples to
 * easily catch the idea.
 *
 * ## 1. Installation
 *
 * `~$ npm install --save pivotpath`
 *
 */

/**
 *
 * ## 2. Usage
 *
 * This is a full demonstration of the module:
 *
 * ```js
 * ////////
 * //////
 * ////
 * // Intro) Generate a new PivotPath instance
 * const myPivot = require("pivotpath").generate(__dirname + "/my/folder/with/subPaths");
 * 
 * ////////
 * //////
 * ////
 * // a) Generate new paths:
 * 
 * const myControllerPath = myPivot.get("/controllers/myController.js");
 * const myMiddlewarePath = myPivot.get("/middlewares/myMiddleware.js");
 * 
 * ////////
 * //////
 * ////
 * // b) Import modules from new paths:
 * 
 * const myController = myPivot.require("/controllers/myController.js");
 * const myMiddleware = myPivot.require("/middlewares/myMiddleware.js");
 * // alternatively, you could use: myPivot.requireNewly(...) [to clear cache everytime it is executed]
 * 
 * ////////
 * //////
 * ////
 * // c) Call to pure functional modules from new paths:
 * 
 * const myData = myPivot.call("/functions/myFunction.js", {scope:true}, ["Param-1", "Param-2", "Param-3"]);
 * const myOtherData = myPivot.call("/functions/myOtherFunction.js", global, [1,2,3]);
 * // alternatively, you could use: myPivot.callNewly(...) [to clear cache everytime it is executed]
 * 
 * ////////
 * //////
 * ////
 * // d) Generate functions that call to pure functional moduoles from new paths:
 * 
 * const app = require("express")(); // This would be a new ExpressJS application.
 * app.get("/", myPivot.function("/controllers/main.js")); // Adds a new controller
 * app.get("/contact", myPivot.function("/controllers/contact.js")); // Adds a new controller
 * app.get("/about", myPivot.function("/controllers/about.js")); // Adds a new controller
 * // alternatively, you could use: myPivot.functionNewly(...) [to clear cache everytime it is executed]
 * 
 * ```
 * 
 * ## 3. API Reference
 * 
 * 
 * 
 */

const path = require("path");
const requireNewly = require("require-newly");

/**
 * 
 * ----
 * 
 * ### `PivotPath`
 * @from `require("pivotpath")`
 * @type `{Class}`
 * @description The API of the module starts is inside this object.
 */
class PivotPath {
		/**
		 * 
		 * ----
		 * 
		 * ### `PivotPath.generate(basePath=".")`
		 * @access `{Static}`
		 * @type `{Class method}`
		 * @parameter `{String} basePath`. Optional. Path from which all the others will start from. By default: `"."`.
		 * @returns `{PivotPath}`. A `{PivotPath}` fresh instance is returned.
		 * @description Instantiates a new `{PivotPath}` instance, using the provided path as basePath.
		 */
		static generate(basePath = ".") {
				const it = new PivotPath();
				it.basePath = path.resolve(basePath);
				/**
				 * 
				 * ----
				 * 
				 * ### `PivotPath#setBasePath(basePath)`
				 * @type `{Function}`
				 * @parameter `{String} basePath`. Required. Path from which all the others will start from.
				 * @returns `{PivotPath}`. A `{PivotPath}` fresh instance is returned.
				 * @description Instantiates a new `{PivotPath}` instance, using the provided path as basePath.
				 * 
				 */
				it.setBasePath = function(basePath) {
						it.basePath = basePath;
						return it;
				};
				/**
				 * 
				 * ----
				 * 
				 * ### `PivotPath#get(subPath)`
				 * @type `{Function}`
				 * @parameter `{String} subPath`. Required. The subPath choosen.
				 * @returns `{String}`. The path generated from the basePath and the subPath.
				 * @description Generates and returns a new path from the union of the basePath and the subPath provided.
				 */
				it.get = function(subPath = "") {
						return path.resolve(it.basePath, subPath.replace(/^\//g, ""));
				};

				/**
				 * 
				 * ----
				 * 
				 * ### `PivotPath#require(subPath)`
				 * @type `{Function}`
				 * @parameter `{String} subPath`. Required. The subPath choosen.
				 * @returns `{Any}`. The module that is found at the path generated from the basePath and the subPath.
				 * @description Generates a new path from the union of the basePath and the subPath provided and imports the module that is found at that new path.
				 */
				it.require = function(subPath) {
						const finalPath = path.resolve(it.basePath, subPath.replace(/^\//g, ""));
						const finalModule = require(finalPath);
						return finalModule;
				};

				/**
				 * 
				 * ----
				 * 
				 * ### `PivotPath#requireNewly(subPath)`
				 * @type `{Function}`
				 * @parameter `{String} subPath`. Required. The subPath choosen.
				 * @returns `{Any}`. The module that is found at the path generated from the basePath and the subPath.
				 * @description This method does the same as the `PivotPath#require(...)` method, but it clears the cache of the module before requiring it.
				 */
				it.requireNewly = function(subPath) {
						const finalPath = path.resolve(it.basePath, subPath.replace(/^\//g, ""));
						const finalModule = requireNewly(finalPath);
						return finalModule;
				};

				/**
				 * 
				 * ----
				 * 
				 * ### `PivotPath#call(subPath)`
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
				it.call = function(subPath, scope = null, params = []) {
						const finalPath = path.resolve(it.basePath, subPath.replace(/^\//g, ""));
						const finalModule = require(finalPath);
						const finalResult = finalModule.apply(scope, params);
						return finalResult;
				};

				/**
				 * 
				 * ----
				 * 
				 * ### `PivotPath#callNewly(subPath)`
				 * @type `{Function}`
				 * @parameter `{String} subPath`. Required. The subPath choosen.
				 * @parameter `{Any} scope`. Optional. The scope of the call. By default: `null`.
				 * @parameter `{Array<Any>} params`. Optional. The arguments of the call, as `{Array}`. By default: `[]`.
				 * @returns `{Any}`. The result of the call of the module that is found at the path generated from the basePath and the subPath, 
				 * receiving the parameters and applying the indicated scope.
				 * @description This method does the same as the `PivotPath#call(...)` method, but it clears the cache of the module before requiring it.
				 */
				it.callNewly = function(subPath, scope = null, params = []) {
						const finalPath = path.resolve(it.basePath, subPath.replace(/^\//g, ""));
						const finalModule = requireNewly(finalPath);
						const finalResult = finalModule.apply(scope, params);
						return finalResult;
				};

				/**
				 * 
				 * ----
				 * 
				 * ### `PivotPath#function(subPath)`
				 * @type `{Function}`
				 * @parameter `{String} subPath`. Required. The subPath choosen.
				 * @parameter `{Any} scope`. Optional. The scope of the call. By default: `null`.
				 * @parameter `{Array<Any>} params`. Optional. The arguments of the call that will be automatically prepended, as `{Array}`. By default: `[]`.
				 * @returns `{Function}`. A function that imports the specified path, and calls to it using the scope provided and prepending the parameters provided.
				 * @description Generates a new path from the union of the basePath and the subPath provided. Then, it returns a function that will import the specified path,
				 * apply the provided scope and prepend the specified parameters, meanwhile it can receive any other parameters. Note that, if you understood well how this 
				 * method works, you understand that this method will only work well when the module that is being required is a function itself.
				 */
				it.function = function(subPath, scope = null, params = []) {
						const finalPath = path.resolve(it.basePath, subPath.replace(/^\//g, ""));
						return function() {
								const finalModule = require(finalPath);
								return finalModule.apply(scope, params.concat(Array.prototype.slice.call(arguments)));
						};
				};

				/**
				 * 
				 * ----
				 * 
				 * ### `PivotPath#functionNewly(subPath)`
				 * @type `{Function}`
				 * @parameter `{String} subPath`. Required. The subPath choosen.
				 * @parameter `{Any} scope`. Optional. The scope of the call. By default: `null`.
				 * @parameter `{Array<Any>} params`. Optional. The arguments of the call that will be automatically prepended, as `{Array}`. By default: `[]`.
				 * @returns `{Function}`. A function that imports the specified path, and calls to it using the scope provided and prepending the parameters provided.
				 * @description This method does the same as the `PivotPath#function(...)` method, but it clears the cache of the module before requiring it.
				 */
				it.functionNewly = function(subPath, scope = null, params = []) {
						const finalPath = path.resolve(it.basePath, subPath.replace(/^\//g, ""));
						return function() {
								const finalModule = requireNewly(finalPath);
								return finalModule.apply(scope, params.concat(Array.prototype.slice.call(arguments)));
						};
				};

				return it;
		}
};

module.exports = PivotPath;

/**
 *
 * ## 4. Commands (npm run *)
 * 
 * To build the project (clean and install dependencies):
 * 
 * ~$ `npm run build`
 * 
 * To pass the tests:
 * 
 * ~$ `npm run test`
 * 
 * To pass the tests and generate the coverage reports:
 * 
 * ~$ `npm run coverage`
 * 
 * To clean regenerable directories:
 * 
 * ~$ `npm run clean`
 * 
 * To generate the documentation from Javadoc comments:
 * 
 * ~$ `npm run docs`
 * 
 * 
 * 
 * ## 5. Conclusion
 * 
 * Very simple module, but can be useful for shortening some repetitive codes, and improve easily
 * the readability of your code.
 * 
 * 
 */