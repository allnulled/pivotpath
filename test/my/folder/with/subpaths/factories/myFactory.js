module.exports = function(...factoryArgs) {
		return function(...functionArgs) {
			var result = 0;
			for(var i=0; i < factoryArgs.length; i++) {
				result += factoryArgs[i];
			}
			for(var i=0; i < functionArgs.length; i++) {
				result *= functionArgs[i];
			}
			return result;
		};
	};