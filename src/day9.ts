import _ from 'lodash';
import { day9data } from './day9data';

function main1(data: number[][]) {
	let sumRisk = 0;

	for (let r = 0; r < data.length; r++) {
		for (let c = 0; c < data[0].length; c++) {
			const adjacents: number[] = [];
			// up
			if (r > 0) adjacents.push(data[r - 1][c]);
			// down
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

function main2(data: number[][]) {
	const basins = data.map(r => new Array(r.length).fill(0) as number[]);
	let nextBasinIndex = 1;

	for (let r = 0; r < data.length; r++) {
		for (let c = 0; c < data[0].length; c++) {
			const curDepth = data[r][c];
			const isLowPoint = getAdjacentLocations(r, c, data)
				.filter(([locR, locC]) => {
					const outOfBounds = locR < 0 || locR >= data.length || locC < 0 || locC >= data[0].length;
					return !outOfBounds;
				})
				.map(([locR, locC]) => data[locR][locC])
				.every(d => d! > curDepth);
			if (!isLowPoint)
				continue;

			const locStack: [number, number][] = [[r, c]];
			while (locStack.length > 0) {
				const [curLocR, curLocC] = locStack.pop()!;
				basins[curLocR][curLocC] = nextBasinIndex;

				const newLocations = getAdjacentLocations(curLocR, curLocC, data)
					.filter(([locR, locC]) => {
						const outOfBounds = locR < 0 || locR >= data.length || locC < 0 || locC >= data[0].length;
						const uphill = !outOfBounds && data[locR][locC] > data[curLocR][curLocC];
						return uphill && data[locR][locC] !== 9;
					});
				locStack.push(...newLocations);
			}

			nextBasinIndex++;
		}
	}

	const flatBasins = basins.flat();
	const basinSizes = _.range(1, nextBasinIndex)
		.map(basin => {
			const size = flatBasins.filter(n => n === basin).length;
			return { basin, size };
		})
		.sort((a, b) => {
			return b.size - a.size;
		});

	const largestBasins = basinSizes.slice(0, 3);
	const result = largestBasins.reduce((p, c) => p * c.size, 1);
	console.log(result);
}

function getAdjacentLocations(r: number, c: number, data: number[][]) {
	/** up, down, left, right */
	const adjacentLocations: [number, number][] = [
		[r - 1, c],
		[r + 1, c],
		[r, c - 1],
		[r, c + 1]
	]
	const validLocations = adjacentLocations.filter(([locR, locC]) => {
		const outOfBounds = locR < 0 || locR >= data.length || locC < 0 || locC >= data[0].length;
		return !outOfBounds;
	});
	return validLocations
}

const data = day9data.split('\n').map(r => r.split('').map(n => parseInt(n, 10)));

main1(data);
main2(data);
