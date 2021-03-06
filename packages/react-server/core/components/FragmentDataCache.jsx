
var TritonAgent = require("../TritonAgent"),
	React = require("react");

/**
 * FragmentDataCache writes out a serialized form of the TritonAgent request
 * data cache into the `data-triton-data-cache` attribute of a `<div>`
 * with an id attribute set to the value of the `cacheNodeId` prop. (Defaults
 * to `triton-fragment-data-cache`)
 *
 * This component should _only_ be used when rendering fragments. Full-page
 * full-page renders have their data cache serialized by `renderMiddleware`.
 *
 * Usage of this component is totally optional. Only use it if you need it.
 *
 * Example (post-fragment-render) :
 *
 * ```javascript
 * var dataCacheStr = document.getElementById('triton-fragment-data-cache')
 * 			.getAttribute('data-triton-data-cache');
 *
 * var parsedData = JSON.parse(dataCacheStr);
 *
 * var entry = parsedData.dataCache["/someUrl"];
 * if (entry.err) {
 * 		// there was an error.
 * 		console.log(entry.err.response);	// if 500-error from server: { body: ...JSON... }
 * 		console.log(entry.err.timeout);		// if there was a `.timeout(...)` specified to TritonAgent
 *											// that was exceeded
 * } else {
 *		console.log(entry.res); // { body: }
 *
 * ```
 *
 * Known issues:
 * 	* entry.res and entry.err.response won't have any `body` entry if
 *	  the response from the server was HTML instead of JSON.
 */
var FragmentDataCache = module.exports = React.createClass({

	propTypes: {
		cacheNodeId: React.PropTypes.string,
	},

	displayName: 'FragmentDataCache',

	getDefaultProps: function () {
		return {
			cacheNodeId: "triton-fragment-data-cache",
		}
	},

	render: function () {
		return (
			<div
				id={this.props.cacheNodeId}
				data-triton-data-cache={JSON.stringify(TritonAgent.cache().dehydrate({ responseBodyOnly: true }))}>
			</div>
		);
	},

});

/**
 * Return a promise that resolves with the FragmentDataCache component
 * when all pending data requests have resolved.
 */
FragmentDataCache.createWhenReady = function (fragmentDataCacheProps = {}) {
	return TritonAgent.cache().whenAllPendingResolve().then(() => {
		return <FragmentDataCache {...fragmentDataCacheProps} />;
	});
}
