import { day5data } from './day5data';

type Grid = number[][];

function main1(segments: number[][]) {
	const xMax = Math.max(...data.flatMap(r => [r[0], r[2]]));
	const yMax = Math.max(...data.flatMap(r => [r[1], r[3]]));

	const grid: Grid = new Array(yMax + 1);
	for (let y = 0; y < grid.length; y++) {
		grid[y] = new Array(xMax + 1).fill(0);
	}

	segments.forEach(s => {
		const isHorizontal = s[1] === s[3];
		const isVertical = s[0] === s[2];

		if (!isHorizontal && !isVertical) return;

		// horz
		if (isHorizontal)
			for (let x = Math.min(s[0], s[2]); x <= Math.max(s[0], s[2]); x++) {
				grid[s[1]][x] += 1;
			}
		// vert
		else
			for (let y = Math.min(s[1], s[3]); y <= Math.max(s[1], s[3]); y++) {
				grid[y][s[0]] += 1;
			}
	});

	const highOverlapCount = grid.flatMap(s => s).filter(n => n >= 2).length;

	console.log(highOverlapCount);
}

function main2(segments: number[][]) {
	const xMax = Math.max(...data.flatMap(r => [r[0], r[2]]));
	const yMax = Math.max(...data.flatMap(r => [r[1], r[3]]));

	const grid: Grid = new Array(yMax + 1);
	for (let y = 0; y < grid.length; y++) {
		grid[y] = new Array(xMax + 1).fill(0);
	}

	segments.forEach(s => {
		const isHorizontal = s[1] === s[3];
		const isVertical = s[0] === s[2];

		// horz
		if (isHorizontal)
			for (let x = Math.min(s[0], s[2]); x <= Math.max(s[0], s[2]); x++) {
				grid[s[1]][x]++;
			}
		// vert
		else if (isVertical)
			for (let y = Math.min(s[1], s[3]); y <= Math.max(s[1], s[3]); y++) {
				grid[y][s[0]]++;
			}
		// diagonal
		else {
			const xDirection = s[2] > s[0] ? 1 : -1;
			const yDirection = s[3] > s[1] ? 1 : -1;

			let [x, y] = s;
			while (x !== s[2] && y !== s[3]) {
				grid[y][x]++;
				x += xDirection;
				y += yDirection;
			}
			grid[y][x]++;
		}
	});

	const highOverlapCount = grid.flatMap(s => s).filter(n => n >= 2).length;

	console.log(highOverlapCount);
}

const data = day5data.split('\n').map(r => {
	const matches = r.match(/(\d+),(\d+) -> (\d+),(\d+)/);
	const coords = matches!.slice(1).map(n => parseInt(n, 10));
	return coords;
});

main1(data);
main2(data);
