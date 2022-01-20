import _ = require("lodash");
import { day13data } from "./day13data";

type Dots = [number, number][];
type Folds = ['x' | 'y', number][];

function main1(dots: Dots) {
	dots = _.cloneDeep(dots);
	dots = fold(dots, 'x', 655);

	console.log(dots.length);
}

/**
 * @param axis 'x' implies the crease is at x=crease
 */
function fold(dots: Dots, axis: 'x' | 'y', crease: number) {
	const stationaryDots: Dots = [];
	const dotsToFold: Dots = [];
	dots.forEach(d => {
		if (
			(axis === 'x' && d[0] < crease)
			|| (axis === 'y' && d[1] < crease)
		)
			stationaryDots.push(d);
		else if (
			(axis === 'x' && d[0] > crease)
			|| (axis === 'y' && d[1] > crease)
		)
			dotsToFold.push(d);
	});

	const foldedDots = dotsToFold
		.map(d => {
			const foldedX = axis === 'x' ? 2 * crease - d[0] : d[0];
			const foldedY = axis === 'y' ? 2 * crease - d[1] : d[1];

			const foldedDot = [foldedX, foldedY] as [number, number];
			return foldedDot;
		})
		.filter(d => {
			if (
				(axis === 'x' && d[0] >= 0)
				|| (axis === 'y' && d[1] >= 0)
			)
				return true;
		});

	const finalDots = _.uniqBy([...stationaryDots, ...foldedDots], n => n.join());
	return finalDots;
}

function main2(dots: Dots, folds: Folds) {
	dots = _.cloneDeep(dots);

	folds.forEach(f => {
		dots = fold(dots, f[0], f[1]);
	});

	const maxX = Math.max(...dots.map(d => d[0]));
	const maxY = Math.max(...dots.map(d => d[1]));
	const folded = _.range(0, maxY + 1)
		.map(y => {
			return _.range(0, maxX + 1)
				.map(x => {
					const isDot = !!dots.find(d => x === d[0] && y === d[1]);
					return isDot ? '#' : '.';
				})
				.join('');
		})
		.join('\n');

	console.log(folded);
}

function printPaper(dots: Dots) {
	const folded = _.range(0, 15)
		.map(y => {
			return _.range(0, 11)
				.map(x => {
					const isDot = !!dots.find(d => x === d[0] && y === d[1]);
					return isDot ? '#' : '.';
				})
				.join('');
		})
		.join('\n');
	console.log(folded);
}

const [dotsText, foldsText] = day13data.split('\n\n');

const dots = dotsText
	.split('\n')
	.map(r =>
		r
			.split(',')
			.map(n => parseInt(n, 10)) as [number, number]
	);

const folds = foldsText
	.split('\n')
	.map(l => {
		const matches = l.match(/([xy])=(\d+)/)!;
		return [matches[1], parseInt(matches[2], 10)] as Folds[0];
	});

main1(dots);
main2(dots, folds);
