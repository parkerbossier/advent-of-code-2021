import { day9data } from './day9data';

function main1(data: number[][]) {
	let sumRisk = 0;

	for (let r = 0; r < data.length; r++) {
		for (let c = 0; c < data[0].length; c++) {
			const adjacents: number[] = [];
			// top
			if (r > 0) adjacents.push(data[r - 1][c]);
			// bottom
			if (r < data.length - 1) adjacents.push(data[r + 1][c]);
			// left
			if (c > 0) adjacents.push(data[r][c - 1]);
			// right
			if (c < data[0].length - 1) adjacents.push(data[r][c + 1]);

			if (adjacents.every(a => a > data[r][c])) sumRisk += data[r][c] + 1;
		}
	}

	console.log(sumRisk);
}

const data = day9data.split('\n').map(r => r.split('').map(n => parseInt(n, 10)));

main1(data);
