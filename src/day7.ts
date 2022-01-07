import { day7data } from './day7data';

function main1(data: number[]) {
	const max = Math.max(...data);
	let costs: number[] = [];

	for (let i = 0; i <= max; i++) {
		const cost = data.map(x => Math.abs(i - x)).reduce((p, c) => p + c, 0);
		costs.push(cost);
	}

	console.log(Math.min(...costs));
}

function main2(data: number[]) {
	const max = Math.max(...data);
	let costs: number[] = [];

	for (let i = 0; i <= max; i++) {
		const cost = data
			.map(x => {
				const dist = Math.abs(i - x);
				const _cost = (1 + dist) * dist / 2;
				return _cost;
			})
			.reduce((p, c) => p + c, 0);
		costs.push(cost);
	}

	console.log(Math.min(...costs));
}

const data = day7data.split(',').map(n => parseInt(n, 10));

main1(data);
main2(data);

//4# = 1 + 2 + 3 + 4 = 10 =
