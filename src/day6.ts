import { day6data } from './day6data';

function main1(data: number[]) {
	data = [...data];

	for (let day = 0; day < 80; day++) {
		const newData = [...data];
		for (let i = 0; i < data.length; i++) {
			const n = data[i];
			if (n === 0) {
				newData[i] = 6;
				newData.push(8);
			} else {
				newData[i]--;
			}
		}
		data = newData;
	}

	console.log(data.length);
}

function main2(data: number[]) {
	let summaryData: number[] = new Array(9).fill(0);
	data.forEach(n => {
		summaryData[n]++;
	});

	for (let day = 0; day < 256; day++) {
		/** [1, 2, 1, ...] implies 0,1,1,2,... */
		const newSummaryData: number[] = new Array(9).fill(0);

		for (let i = 0; i < 9; i++) {
			const summaryDatum = summaryData[i];
			if (i === 0) {
				newSummaryData[6] = summaryDatum;
				newSummaryData[8] = summaryDatum;
			} else {
				newSummaryData[i - 1] += summaryDatum;
			}
		}

		summaryData = newSummaryData;
	}

	console.log(summaryData.reduce((p, c) => p + c, 0));
}

const data = day6data.split(',').map(n => parseInt(n, 10));

main1(data);
main2(data);
