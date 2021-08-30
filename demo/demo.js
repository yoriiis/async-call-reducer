import asyncCallReducer from '../src/index.js';

async function getData() {
	return await asyncCallReducer({
		key: 'swapi',
		callback: async () => {
			const data = await fetch('https://swapi.dev/api/people/?page=1');
			return await data.json();
		}
	});
}

console.log(await getData());
console.log(await getData());
