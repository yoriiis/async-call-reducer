/**
 * Async call reducer
 * @param {Object} options
 * @param {String} options.key Storage key
 * @param {Promise} options.callback Async callback function
 * @returns Promise<any> Callback function data
 */
export default function asyncCallReducer({
	key = 'asyncCallReducer',
	storage = 'sessionStorage',
	callback
}) {
	return new Promise(function (resolve) {
		const dataKey = `${key}Data`;
		const loadingKey = `${key}Loading`;
		const dataAvailableKey = `${key}DataAvailable`;

		if (window[storage].getItem(dataKey)) {
			resolve(JSON.parse(window[storage].getItem(dataKey)));
		} else if (window[storage].getItem(loadingKey)) {
			document.addEventListener(dataAvailableKey, function (e) {
				return resolve(e.detail.data);
			});
		} else if (!window[storage].getItem(loadingKey)) {
			window[storage].setItem(loadingKey, true);
			callback().then(function (data) {
				window[storage].setItem(dataKey, JSON.stringify(data));
				document.dispatchEvent(
					new window.CustomEvent(dataAvailableKey, {
						detail: {
							data
						}
					})
				);
				resolve(data);
				window[storage].removeItem(loadingKey);
			});
		}
	});
}
