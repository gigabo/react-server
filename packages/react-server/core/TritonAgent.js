var RLS = require('./util/RequestLocalStorage').getNamespace()
,	Cache = require("./TritonAgent/Cache")
,	Request = require("./TritonAgent/Request")
,	Plugins = require("./TritonAgent/Plugins")
;


// wrapper for superagent
function makeRequest (method, url) {
	return new Request(method, url, API.cache());
}

var API = {

	get (url, data) {
		var req = makeRequest('GET', url);
		if (data) req.query(data);
		return req;
	},

	head (url, data) {
		var req = makeRequest('HEAD', url);
		if (data) req.send(data);
		return req;
	},

	del (url) {
		return makeRequest('DELETE', url);
	},

	patch (url, data) {
		var req = makeRequest('PATCH', url);
		if (data) req.send(data);
		return req;
	},

	post (url, data) {
		var req = makeRequest('POST', url);
		if (data) req.send(data);
		return req;
	},

	put (url, data) {
		var req = makeRequest('PUT', url);
		if (data) req.send(data);
		return req;
	},

	/**
	 * Exposes the TritonAgent request data cache from RequestLocalStorage.
	 */
	cache () {
		var cache = RLS().cache;
		if (!cache) {
			cache = RLS().cache = new Cache();
		}
		return cache;
	},

	_clearCache () {
		delete RLS().cache;
	},

	/**
	 * Adds a plugin function that can be used to modify the Request
	 * object before the request is actually
	 * triggered.
	 *
	 * The callback function will take the Request instance as a parameter:
	 * ```
	 * var defaultHeaders = { ... };
	 * TritonAgent.plugRequest(function (request) {
	 *     // e.g.
	 *     request.set(defaultHeaders)
	 * })
	 * ```
	 */
	plugRequest (pluginFunc) {
		Plugins.forRequest().add(pluginFunc);
	},

	/**
	 * Adds a plugin function that can be used to modify the response
	 * object before it is passed the caller's callback.
	 *
	 * The callback function will take err and response as parameters
	 * (like the callback to `end()`), and the request as well:
	 * ```
	 * TritonAgent.plugResponse(function (err, response, request) {
	 *     // e.g.
	 *     console.log("Response received!", res.body);
	 *     res.wasLogged = true; // or whatever
	 * })
	 * ```
	 */
	plugResponse (pluginFunc) {
		Plugins.forResponse().add(pluginFunc);
	},

}



module.exports = API;
