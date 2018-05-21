module.exports = function(req, res, next) {
	return {
			scope: this,
			params: Array.prototype.slice.call(arguments),
			data: "YeahYeah"
		};
};