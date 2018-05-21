var {report} = require("assertivity").generate();
var PivotPath = require(__dirname + "/../src/pivotpath.js");

report.as("API is an object").that(PivotPath).is.object();
report.as("API has 'generate'").that.it.has.key("generate");
report.as("API has 'generate' as method").that.its("generate").is.function();

var pivot = PivotPath.generate(__dirname + "/okok");

report.as("API generates a new object").that(pivot).is.object();
report.as("API's new object has 'basePath'").that.it.has.key("basePath");
report.as("API's new object's basePath is a string").that.its("basePath").is.string();
report.as("API's new object's basePath is the path provided").that.its("basePath").is(__dirname + "/okok");

pivot.setBasePath(__dirname + "/my/folder/with/subpaths/");

report.as("API's new object's 'setBasePath' works as expected").that.its("basePath").is(__dirname + "/my/folder/with/subpaths/");
report.as("API's new object has 'get'").that.it.has.key("get");
report.as("API's new object has 'require'").that.it.has.key("require");
report.as("API's new object has 'call'").that.it.has.key("call");
report.as("API's new object has 'function'").that.it.has.key("function");
report.as("API's 'get' method works as expected (1 of 2)").that(pivot.get("/controllers/myController.js")).is(__dirname + "/my/folder/with/subpaths/controllers/myController.js");
report.as("API's 'get' method works as expected (2 of 2)").that(pivot.get("/middlewares/myMiddleware.js")).is(__dirname + "/my/folder/with/subpaths/middlewares/myMiddleware.js");

var controller = pivot.require("/controllers/myController.js");
var middleware = pivot.require("/middlewares/myMiddleware.js");

report.as("API's 'require' method works as expected (1 of 4)").that(controller).is.function();
report.as("API's 'require' method works as expected (2 of 4)").that(controller().data).is("Yeah");
report.as("API's 'require' method works as expected (3 of 4)").that(middleware).is.function();
report.as("API's 'require' method works as expected (4 of 4)").that(middleware().data).is("YeahYeah");

var controllerOutput = pivot.call("/controllers/myController.js", 5, [0,1,2]);

report.as("API's 'call' method works as expected (1 of 7)").that(controllerOutput).is.object();
report.as("API's 'call' method works as expected (2 of 7)").that.its("data").is("Yeah");
report.as("API's 'call' method works as expected (3 of 7)").that.its("scope").is.like(5);
report.as("API's 'call' method works as expected (4 of 7)").that.its("params", "length").is(3);
report.as("API's 'call' method works as expected (5 of 7)").that(controllerOutput.params["0"]).is.like(0);
report.as("API's 'call' method works as expected (6 of 7)").that(controllerOutput.params["1"]).is(1);
report.as("API's 'call' method works as expected (7 of 7)").that(controllerOutput.params["2"]).is(2);

var controllerFunc = pivot.function("/controllers/myController.js", 6, [3,4,5]);

report.as("API's 'function' method works as expected (1 of 10)").that(controllerFunc).is.function();

var controllerFuncOutput = controllerFunc(6,7,8);

report.as("API's 'function' method works as expected (2 of 10)").that(controllerFuncOutput).is.object();
report.as("API's 'function' method works as expected (3 of 10)").that(controllerFuncOutput.scope).is.like(6);
report.as("API's 'function' method works as expected (4 of 10)").that(controllerFuncOutput.params.length).is(6);
report.as("API's 'function' method works as expected (5 of 10)").that(controllerFuncOutput.params["0"]).is(3);
report.as("API's 'function' method works as expected (6 of 10)").that(controllerFuncOutput.params["1"]).is(4);
report.as("API's 'function' method works as expected (7 of 10)").that(controllerFuncOutput.params["2"]).is(5);
report.as("API's 'function' method works as expected (8 of 10)").that(controllerFuncOutput.params["3"]).is(6);
report.as("API's 'function' method works as expected (9 of 10)").that(controllerFuncOutput.params["4"]).is(7);
report.as("API's 'function' method works as expected (10 of 10)").that(controllerFuncOutput.params["5"]).is(8);




