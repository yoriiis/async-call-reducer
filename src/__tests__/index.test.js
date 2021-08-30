/**
 * @jest-environment jsdom
 */

'use strict';

import mockFetch from '../__mocks__/fetch';
import mockBrowserStorage from '../__mocks__/browser-storage';
import asyncCallReducer from '../index';
import { afterEach, beforeEach, expect, jest } from '@jest/globals';

const swapiData = {
	count: 82,
	next: 'https://swapi.dev/api/people/?page=2',
	previous: null,
	results: []
};
const callback = async () => {
	const data = await fetch('https://swapi.dev/api/people/?page=1');
	return await data.json();
};

beforeEach(() => {
	jest.setTimeout(10000);
	mockFetch({
		jsonResponse: swapiData
	});
	Object.defineProperty(window, 'sessionStorage', {
		value: mockBrowserStorage('sessionStorage')
	});
});

afterEach(() => {
	window.sessionStorage.removeItem('swapiData');
	window.sessionStorage.removeItem('swapiLoading');
	window.sessionStorage.removeItem('swapiAvailable');
	window.sessionStorage.removeItem('asyncCallReducerData');
	window.sessionStorage.removeItem('asyncCallReducerLoading');
	window.sessionStorage.removeItem('asyncCallReducerAvailable');
	jest.clearAllMocks();
});

describe('asyncCallReducer function', () => {
	it('should init the asyncCallReducer function with the storage', async () => {
		jest.spyOn(window.sessionStorage, 'getItem');
		jest.spyOn(JSON, 'parse');

		window.sessionStorage.setItem('swapiData', JSON.stringify(swapiData));
		const result = await asyncCallReducer({
			key: 'swapi',
			callback
		});

		expect(window.sessionStorage.getItem).toHaveBeenCalledWith('swapiData');
		expect(JSON.parse).toHaveBeenCalledWith(JSON.stringify(swapiData));
		expect(fetch).not.toHaveBeenCalled();
		expect(result).toStrictEqual(swapiData);
	});

	it('should init the asyncCallReducer function with an event', async () => {
		jest.spyOn(window.sessionStorage, 'getItem');
		jest.spyOn(document, 'addEventListener');

		window.sessionStorage.setItem('swapiLoading', true);
		asyncCallReducer({
			key: 'swapi',
			callback
		});
		document.dispatchEvent(
			new window.CustomEvent('swapiDataAvailable', {
				detail: {
					data: swapiData
				}
			})
		);

		expect(window.sessionStorage.getItem).toHaveBeenCalledWith('swapiData');
		expect(window.sessionStorage.getItem).toHaveBeenCalledWith('swapiLoading');
		expect(document.addEventListener).toHaveBeenCalledWith(
			'swapiDataAvailable',
			expect.any(Function)
		);
	});

	it('should init the asyncCallReducer function with the fetch', async () => {
		jest.spyOn(window.sessionStorage, 'getItem');
		jest.spyOn(window.sessionStorage, 'setItem');
		jest.spyOn(document, 'dispatchEvent');

		const result = await asyncCallReducer({
			key: 'swapi',
			callback
		});

		expect(window.sessionStorage.getItem).toHaveBeenCalledWith('swapiData');
		expect(window.sessionStorage.getItem).toHaveBeenCalledWith('swapiLoading');
		expect(window.sessionStorage.setItem).toHaveBeenCalledWith('swapiLoading', true);
		expect(fetch).toHaveBeenCalledTimes(1);
		expect(fetch).toHaveBeenCalledWith('https://swapi.dev/api/people/?page=1');
		expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
			'swapiData',
			JSON.stringify(swapiData)
		);
		expect(document.dispatchEvent).toHaveBeenCalledWith(
			new window.CustomEvent('swapiDataAvailable', {
				detail: {
					data: 'swapiData'
				}
			})
		);
		expect(result).toStrictEqual(swapiData);
	});

	it('should init the asyncCallReducer function twice and use the storage for the second call', async () => {
		const resultFirstCall = await asyncCallReducer({
			key: 'swapi',
			callback
		});
		const resultFromStorage = await asyncCallReducer({
			key: 'swapi',
			callback
		});

		expect(resultFirstCall).toStrictEqual(swapiData);
		expect(resultFromStorage).toStrictEqual(swapiData);
		expect(fetch).toHaveBeenCalledTimes(1);
		expect(fetch).toHaveBeenCalledWith('https://swapi.dev/api/people/?page=1');
		expect(document.dispatchEvent).toHaveBeenCalledWith(
			new window.CustomEvent('swapiDataAvailable', {
				detail: {
					data: 'swapiData'
				}
			})
		);
	});

	it('should init the asyncCallReducer function twice and use the event for the second call', async () => {
		jest.spyOn(document, 'addEventListener');
		jest.spyOn(window.sessionStorage, 'setItem');
		jest.spyOn(window.sessionStorage, 'getItem');
		jest.spyOn(window.sessionStorage, 'removeItem');

		asyncCallReducer({
			key: 'swapi',
			callback
		});
		const resultFromEvent = await asyncCallReducer({
			key: 'swapi',
			callback
		});

		expect(resultFromEvent).toStrictEqual(swapiData);
		expect(window.sessionStorage.getItem).toHaveBeenCalledWith('swapiData');
		expect(window.sessionStorage.getItem).toHaveBeenCalledWith('swapiLoading');
		expect(fetch).toHaveBeenCalledTimes(1);
		expect(fetch).toHaveBeenCalledWith('https://swapi.dev/api/people/?page=1');
		expect(document.addEventListener).toHaveBeenCalledWith(
			'swapiDataAvailable',
			expect.any(Function)
		);
	});

	it('should init the asyncCallReducer function with the default key', async () => {
		jest.spyOn(window.sessionStorage, 'getItem');

		await asyncCallReducer({
			callback
		});

		expect(window.sessionStorage.getItem).toHaveBeenCalledWith('asyncCallReducerData');
		expect(window.sessionStorage.getItem).toHaveBeenCalledWith('asyncCallReducerLoading');
	});
});
