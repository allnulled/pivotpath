var { expect, assert } = require("chai");
var fs = require("fs-extra");
var path = require("path");



describe("PivotPath API", function() {

	const controllerCode = `module.exports = function(req, res) {
			return {
				scope: this,
				params: Array.prototype.slice.call(arguments),
				data: "Yeah"
			};
	};`;

	const middlewareCode = `module.exports = function(req, res, next) {
		return {
				scope: this,
				params: Array.prototype.slice.call(arguments),
				data: "YeahYeah"
			};
	};`;

	const controllerCodeModified = `module.exports = function(req, res) {
			return {
				scope: this,
				params: Array.prototype.slice.call(arguments),
				data: "Nope"
			};
	};`;

	const middlewareCodeModified = `module.exports = function(req, res, next) {
		return {
				scope: this,
				params: Array.prototype.slice.call(arguments),
				data: "NopeNope"
			};
	};`;

	const resetFiles = function() {
		fs.outputFileSync(__dirname + "/my/folder/with/subpaths/controllers/myController.js", controllerCode, "utf8");
		fs.outputFileSync(__dirname + "/my/folder/with/subpaths/middlewares/myMiddleware.js", middlewareCode, "utf8");
	};

	const modifyFiles = function() {
		fs.outputFileSync(__dirname + "/my/folder/with/subpaths/controllers/myController.js", controllerCodeModified, "utf8");
		fs.outputFileSync(__dirname + "/my/folder/with/subpaths/middlewares/myMiddleware.js", middlewareCodeModified, "utf8");
	};

  var PivotPath;
  var pivot;
  var controller;
	var middleware;
	var controllerOutput;
	var controllerFunc;
	var controllerFuncOutput;

	before(function(done) {
		resetFiles();
		done();
	});

	beforeEach(function(done) {
		resetFiles();
		done();
	});

	after(function(done) {
		resetFiles();
		done();
	});

  it("returns the module expected", function(done) {
  	this.timeout(8000);
    PivotPath = require(__dirname + "/../src/pivotpath.js");
    expect(typeof PivotPath).to.equal("object");
    expect("generate" in PivotPath).to.equal(true);
    expect(typeof PivotPath.generate).to.equal("function");
    done();
  });

  it("generates pivot-path instances as expected", function(done) {
  	this.timeout(8000);
    pivot = PivotPath.generate(__dirname + "/okok");
    expect(typeof pivot).to.equal("object");
    expect("basePath" in pivot).to.equal(true);
    expect(typeof pivot.basePath).to.equal("string");
    expect(pivot.basePath).to.equal(__dirname + "/okok");
    expect("get" in pivot).to.equal(true);
    expect("require" in pivot).to.equal(true);
    expect("call" in pivot).to.equal(true);
    expect("function" in pivot).to.equal(true);
    done();
  });

  it("can change the base path after instantiation", function(done) {
  	this.timeout(8000);
    pivot.setBasePath(__dirname + "/my/folder/with/subpaths/");
    expect(pivot.basePath).to.equal(__dirname + "/my/folder/with/subpaths/");
    done();
  });

  it("uses PivotPath#get(subpath:String) as expected", function(done) {
  	this.timeout(8000);
    expect(pivot.get("/controllers/myController.js")).to.equal(__dirname + "/my/folder/with/subpaths/controllers/myController.js");
    expect(pivot.get("/middlewares/myMiddleware.js")).to.equal(__dirname + "/my/folder/with/subpaths/middlewares/myMiddleware.js");
  	done();
  });

  it("uses PivotPath#require(subpath:String) as expected", function(done) {
  	this.timeout(8000);
		controller = pivot.require("/controllers/myController.js");
		middleware = pivot.require("/middlewares/myMiddleware.js");
		expect(typeof controller).to.equal("function");
		expect(controller().data).to.equal("Yeah");
		expect(typeof middleware).to.equal("function");
		expect(middleware().data).to.equal("YeahYeah");
		done();
	});

  it("uses PivotPath#call(subpath:String, scope:Any, ...others:Any) as expected", function(done) {
  	this.timeout(8000);
		controllerOutput = pivot.call("/controllers/myController.js",  {a:"a"}, [0,1,2]);
		expect(typeof controllerOutput).to.equal("object");
		expect(controllerOutput.data).to.equal("Yeah");
		expect(controllerOutput.scope.a).to.equal("a");
		expect(controllerOutput.params.length).to.equal(3);
		expect(controllerOutput.params["0"]).to.equal(0);
		expect(controllerOutput.params["1"]).to.equal(1);
		expect(controllerOutput.params["2"]).to.equal(2);
		done();
  });

  it("uses PivotPath#function(subpath:String, scope:Any, ...others:Any) as expected", function(done) {
  	this.timeout(8000);
		controllerFunc = pivot.function("/controllers/myController.js", {b:"b"}, [3,4,5]);
		expect(typeof controllerFunc).to.equal("function");
		controllerFuncOutput = controllerFunc(6,7,8);
		expect(typeof controllerFuncOutput).to.equal("object");
		expect(controllerFuncOutput.scope.b).to.equal("b");
		expect(controllerFuncOutput.params.length).to.equal(6);
		expect(controllerFuncOutput.params["0"]).to.equal(3);
		expect(controllerFuncOutput.params["1"]).to.equal(4);
		expect(controllerFuncOutput.params["2"]).to.equal(5);
		expect(controllerFuncOutput.params["3"]).to.equal(6);
		expect(controllerFuncOutput.params["4"]).to.equal(7);
		expect(controllerFuncOutput.params["5"]).to.equal(8);
		done();
  });

  it("uses PivotPath#requireNewly(subpath:String) as expected", function(done) {
  	this.timeout(8000);
  	// here, we reset the cache to the initial values:
  	resetFiles();
  	pivot.requireNewly("/controllers/myController.js"); 
		pivot.requireNewly("/middlewares/myMiddleware.js");
		// and then, we proceed to do the test:
  	modifyFiles();
  	var controllerOutputCached = pivot.require("/controllers/myController.js");
		var middlewareOutputCached = pivot.require("/middlewares/myMiddleware.js");
  	var controllerOutputUncached = pivot.requireNewly("/controllers/myController.js");
		var middlewareOutputUncached = pivot.requireNewly("/middlewares/myMiddleware.js");
		expect(controllerOutputCached().data).to.equal("Yeah");
		expect(controllerOutputUncached().data).to.equal("Nope");
		expect(middlewareOutputCached().data).to.equal("YeahYeah");
		expect(middlewareOutputUncached().data).to.equal("NopeNope");
		done();
	});

  it("uses PivotPath#callNewly(subpath:String, scope:Any, ...others:Any) as expected", function(done) {
  	this.timeout(8000);
		// here, we reset the cache to the initial values:
  	resetFiles();
  	pivot.callNewly("/controllers/myController.js");
		pivot.callNewly("/middlewares/myMiddleware.js");
  	// and then, we proceed to do the test:
  	modifyFiles();
  	var controllerOutputCached = pivot.call("/controllers/myController.js");
		var middlewareOutputCached = pivot.call("/middlewares/myMiddleware.js");
  	var controllerOutputUncached = pivot.callNewly("/controllers/myController.js");
		var middlewareOutputUncached = pivot.callNewly("/middlewares/myMiddleware.js");
		expect(controllerOutputCached.data).to.equal("Yeah");
		expect(controllerOutputUncached.data).to.equal("Nope");
		expect(middlewareOutputCached.data).to.equal("YeahYeah");
		expect(middlewareOutputUncached.data).to.equal("NopeNope");
		done();
  });

  it("uses PivotPath#functionNewly(subpath:String, scope:Any, ...others:Any) as expected", function(done) {
  	this.timeout(8000);
		// here, we reset the cache to the initial values:
  	resetFiles();
  	pivot.requireNewly("/controllers/myController.js");
		pivot.requireNewly("/middlewares/myMiddleware.js");
  	// and then, we proceed to do the test:
  	modifyFiles();
  	var controllerOutputCached = pivot.function("/controllers/myController.js");
		var middlewareOutputCached = pivot.function("/middlewares/myMiddleware.js");
  	var controllerOutputUncached = pivot.functionNewly("/controllers/myController.js");
		var middlewareOutputUncached = pivot.functionNewly("/middlewares/myMiddleware.js");		
		expect(controllerOutputCached().data).to.equal("Yeah");
		expect(controllerOutputUncached().data).to.equal("Nope");
		expect(middlewareOutputCached().data).to.equal("YeahYeah");
		expect(middlewareOutputUncached().data).to.equal("NopeNope");
		done();
  });

  it("takes the current working directory when the path is not specified", function(done) {
  	const pivot2 = PivotPath.generate();
  	expect(pivot2.basePath).to.equal(path.resolve("."));
		done();
  });

  it("uses an empty string when the path to of PivotPath#get(...) method is not provided", function(done) {
  	const pivot2 = PivotPath.generate(__dirname);
  	expect(pivot2.get()).to.equal(__dirname);
		done();
  });

});
