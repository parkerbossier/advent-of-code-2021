import { day3data } from './day3data';

function main1(data: string[]) {
	const oneCounts = countOnes(data);

	const gammaBinary = oneCounts
		.map(c => {
			return c > data.length - c ? '1' : '0';
		})
		.join('');
	const epsilonBinary = oneCounts
		.map(c => {
			return c < data.length - c ? '1' : '0';
		})
		.join('');

	const gamma = parseInt(gammaBinary, 2);
	const epsilon = parseInt(epsilonBinary, 2);

	console.log(gamma * epsilon);
}

function countOnes(data: string[]) {
	const counts = new Array(data[0].length).fill(0);
	data.forEach(row => {
		for (let i = 0; i < row.length; i++) {
			if (row[i] === '1') counts[i]++;
		}
	});
	return counts;
}

function main2(data: string[]) {
	let o2Data = data;
	for (let i = 0; i < data[0].length; i++) {
		const oneCounts = countOnes(o2Data);
		const keyOneCount = oneCounts[i];
		const keyMode = (() => {
			if (keyOneCount === o2Data.length - keyOneCount) return '1';
			else if (keyOneCount > o2Data.length - keyOneCount) return '1';
			else return '0';
		})();

		o2Data = o2Data.filter(l => l[i] === keyMode);
		if (o2Data.length === 1) break;
	}

	let co2Data = data;
	for (let i = 0; i < data[0].length; i++) {
		const oneCounts = countOnes(co2Data);
		const keyOneCount = oneCounts[i];
		const keyMode = (() => {
			if (keyOneCount === co2Data.length - keyOneCount) return '0';
			else if (keyOneCount > co2Data.length - keyOneCount) return '0';
			else return '1';
		})();

		co2Data = co2Data.filter(l => l[i] === keyMode);
		if (co2Data.length === 1) break;
	}

	const o2 = parseInt(o2Data[0], 2);
	const co2 = parseInt(co2Data[0], 2);

	console.log(o2 * co2);
}

const data = day3data.split('\n');

main1(data);
main2(data);
