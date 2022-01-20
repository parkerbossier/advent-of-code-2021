import _ = require("lodash");
import { day11data } from "./day11data";

function main1(energies: number[][]) {
	energies = _.cloneDeep(energies);
	let flashCount = 0;

	for (let step = 0; step < 10; step++) {
		const octsToFlash: [number, number][] = [];

		for (let r = 0; r < energies.length; r++) {
			for (let c = 0; c < energies[0].length; c++) {
				energies[r][c]++;
				if (energies[r][c] > 9)
					octsToFlash.push([r, c]);
			}
		}

		const flashes = energies.map(r => new Array(r.length).fill(false) as boolean[]);
		while (octsToFlash.length > 0) {
			const [curR, curC] = octsToFlash.pop()!;
			const hasFlashed = flashes[curR][curC];
			if (hasFlashed)
				continue;

			/** starting top-left, moving clockwise */
			const neighborLocs = [
				[curR - 1, curC - 1],
				[curR - 1, curC],
				[curR - 1, curC + 1],
				[curR, curC + 1],
				[curR + 1, curC + 1],
				[curR + 1, curC],
				[curR + 1, curC - 1],
				[curR, curC - 1],
			];

			neighborLocs
				.filter(([r, c]) => {
					return r >= 0 && r < energies.length && c >= 0 && c < energies[0].length;
				})
				// flash
				.forEach(([r, c]) => {
					energies[r][c]++;
					if (energies[r][c] > 9)
						octsToFlash.push([r, c]);
				});

			flashes[curR][curC] = true;
			flashCount++;
		}

		for (let r = 0; r < energies.length; r++) {
			for (let c = 0; c < energies[0].length; c++) {
				if (flashes[r][c])
					energies[r][c] = 0;
			}
		}

		// console.log('after step', step + 1);
		// printGrid(energies);
		// console.log();
		// printGrid(flashes, n => n ? '*' : '0');
		// console.log()
	}

	console.log(flashCount);
}

function main2(energies: number[][]) {
	energies = _.cloneDeep(energies);
	let stepWithAllFlashes = -1;

	for (let step = 0; step < 1000; step++) {
		const octsToFlash: [number, number][] = [];

		for (let r = 0; r < energies.length; r++) {
			for (let c = 0; c < energies[0].length; c++) {
				energies[r][c]++;
				if (energies[r][c] > 9)
					octsToFlash.push([r, c]);
			}
		}

		const flashes = energies.map(r => new Array(r.length).fill(false) as boolean[]);
		while (octsToFlash.length > 0) {
			const [curR, curC] = octsToFlash.pop()!;
			const hasFlashed = flashes[curR][curC];
			if (hasFlashed)
				continue;

			/** starting top-left, moving clockwise */
			const neighborLocs = [
				[curR - 1, curC - 1],
				[curR - 1, curC],
				[curR - 1, curC + 1],
				[curR, curC + 1],
				[curR + 1, curC + 1],
				[curR + 1, curC],
				[curR + 1, curC - 1],
				[curR, curC - 1],
			];

			neighborLocs
				.filter(([r, c]) => {
					return r >= 0 && r < energies.length && c >= 0 && c < energies[0].length;
				})
				// flash
				.forEach(([r, c]) => {
					energies[r][c]++;
					if (energies[r][c] > 9)
						octsToFlash.push([r, c]);
				});

			flashes[curR][curC] = true;
		}

		if (flashes.every(r => r.every(c => c))) {
			stepWithAllFlashes = step + 1;
			break;
		}

		for (let r = 0; r < energies.length; r++) {
			for (let c = 0; c < energies[0].length; c++) {
				if (flashes[r][c])
					energies[r][c] = 0;
			}
		}

		// console.log('after step', step + 1);
		// printGrid(energies);
		// console.log();
		// printGrid(flashes, n => n ? '*' : '0');
		// console.log()
	}

	console.log(stepWithAllFlashes);
}

function printGrid<T>(grid: T[][], transformer?: (n: T) => string) {
	const string = grid.map(r => r.map(n => transformer?.(n) ?? n).join('')).join('\n');
	console.log(string);
}

const data = day11data.split('\n').map(r => r.split('').map(n => parseInt(n, 10)));

main1(data);
main2(data);
