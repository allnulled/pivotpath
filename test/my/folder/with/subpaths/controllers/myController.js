module.exports = function(req, res) {
		return {
			scope: this,
			params: Array.prototype.slice.call(arguments),
			data: "Yeah"
		};
};