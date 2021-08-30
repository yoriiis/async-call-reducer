/**
 * Mock implementation for javaScript fetch API
 * @param {Object} options - Fetch options
 * @param {Object} options.jsonResponse - mock JSON response as parameter
 * @param {Integer} options.timeout - Delay promise resolve
 */
export default function mockFetch({ jsonResponse, timeout = 0 } = {}) {
	Object.defineProperty(window, 'fetch', {
		writable: true,
		value: jest.fn().mockImplementation(() => {
			return new Promise((resolve) => {
				setTimeout(() => {
					return resolve({
						json: () => jsonResponse
					});
				}, timeout);
			});
		})
	});
}
