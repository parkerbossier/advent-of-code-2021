import _ = require('lodash');

type Point = [number, number];

function simulate(initialVelocity: Point, log = false) {
	const vel = [...initialVelocity];
	const pos: Point = [0, 0];
	const points: Point[] = [];

	if (log)
		printMap(points);

	do {
		pos[0] += vel[0];
		pos[1] += vel[1];
		points.push([...pos]);

		if (log)
			printMap(points);

		if (vel[0] > 0)
			vel[0]--;
		else if (vel[0] < 0)
			vel[0]++;

		vel[1]--;
	}
	while (!pointIsInTarget(pos) && !pointHasPassedTarget(pos));

	if (pointIsInTarget(pos))
		return {
			points,
			success: true,
			vel
		};
	else
		return {
			points,
			success: false,
			vel
		};
}

// const targetXRange = [20, 30];
const targetXRange = [70, 96];
// const targetYRange = [-10, -5];
const targetYRange = [-179, -124];

function pointHasPassedTarget(point: Point) {
	return point[0] > targetXRange[1] || point[1] < targetYRange[0];
}

function pointIsInTarget(point: Point) {
	return (
		point[0] >= targetXRange[0] && point[0] <= targetXRange[1]
		&& point[1] >= targetYRange[0] && point[1] <= targetYRange[1]
	);
}

function printMap(points: Point[]) {
	const xMax = Math.max(...points.map(p => p[0]), targetXRange[1]);
	const yMax = Math.max(...points.map(p => p[1]), 0);
	const yMin = Math.min(...points.map(p => p[1]), targetYRange[0] - 1);
	const map = _.range(yMax, yMin - 1, -1).map(y => {
		const row = _.range(0, xMax + 1).map(x => {
			if (x === 0 && y === 0)
				return 'O';
			else if (points.find(p => _.isEqual(p, [x, y])))
				return '#';
			else if (pointIsInTarget([x, y]))
				return 'T';
			else
				return '.';
		});
		return row;
	});
	console.log(map.map(r => r.join('')).join('\n'));
	console.log();
}

function main1() {
	const velXRange = [
		Math.ceil(getVForD(targetXRange[0])),
		Math.floor(getVForD(targetXRange[1]))
	];

	const velYMax = -targetYRange[0] - 1;
	const initialVel: Point = [velXRange[0], velYMax];
	const result = simulate(initialVel);
	const yMax = Math.max(...result.points.map(p => p[1]));
	console.log(yMax);
}

/**
 * d = v + (v-1) + (v-2) + ... + 1 = 1 + ... + v == v * (v + 1) / 2
 * https://www.wolframalpha.com/widgets/view.jsp?id=c778a2d8bf30ef1d3c2d6bc5696defad
 */
const getVForD = (d: number) => (Math.sqrt(8 * d + 1) - 1) / 2;

function main2() {
	const minVelX = Math.ceil(getVForD(targetXRange[0]));
	const maxVelX = targetXRange[1];

	const minVelY = targetYRange[0];
	const maxVelY = -targetYRange[0] - 1;

	const hits: [number, number][] = [];
	for (let x = minVelX; x <= maxVelX; x++) {
		for (let y = minVelY; y <= maxVelY; y++) {
			const result = simulate([x, y]);
			if (result.success)
				hits.push([x, y]);
		}
	}

	console.log(hits.length);
}

main1();
main2();
