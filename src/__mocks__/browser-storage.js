/**
 * Mock implementation of Browser storage
 * @return {Object} Object implementation of browser storage
 */
export default function mockBrowserStorage(method = 'localStorage') {
	let store = {};
	Object.defineProperty(window, method, {
		value: {
			getItem(key) {
				return store[key] || null;
			},
			setItem(key, value) {
				store[key] = value.toString();
			},
			removeItem(key) {
				delete store[key];
			},
			clear() {
				store = {};
			}
		}
	});
}
