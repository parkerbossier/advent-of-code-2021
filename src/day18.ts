import { isNumber } from 'lodash';
import _ = require('lodash');

type Pair = [number | Pair, number | Pair];

// function getMagnitude(pair: Pair) {
// 	if (isNumber(pair[0]))
// 	return pair[0] * 3 + pair[1] * 2;
// }

function explodePair(p: [number, number]) {

}

/**
 * 
 * @param p 
 * @param depth 0 based
 */
function crawlExplode(p: Pair, depth = 0) {
	if (depth === 3) {
		// each element in `p` is "nested inside four pairs"
		p.forEach((e, i) => {
			if (_.isArray(e)) {
				const pair = e as [number, number];
				if (i === 1 && _.isNumber(p[0])) {
					p[0] += pair[0];
					p[1] = 0;
				}
				else if (i === 0 && _.isNumber(p[1])) {
					p[1] += pair[1];
					p[0] = 0;
				}
			}
		});
	}

	if (depth < 3) {
		let count = 0;
		if (_.isArray(p[0]))
			count += crawlExplode(p[0], depth + 1);
		if (_.isArray(p[1]))
			count += crawlExplode(p[1], depth + 1);

		return count;
	}

	return 0;
}

function printPair(p: Pair) {
	console.log(JSON.stringify(p));
}

function main1() {
	const test = JSON.parse('[[6,[5,[4,[3,2]]]],1]');

	const tests = [
		['[[[[[9,8],1],2],3],4]', '[[[[0,9],2],3],4]'],
		['[7,[6,[5,[4,[3,2]]]]]', '[7,[6,[5,[7,0]]]]'],
		['[[6,[5,[4,[3,2]]]],1]', '[[6,[5,[7,0]]],3]'],
		['[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]', '[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]'],
		['[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]', '[[3,[2,[8,0]]],[9,[5,[7,0]]]]']
	];

	tests.forEach(t => {
		const [input, expected] = t;
		console.log(input);
		const a = JSON.parse(input);
		crawlExplode(a);
		printPair(a);
		if (JSON.stringify(a) !== expected)
			console.log('^ FAIL!')
	})

	printPair(test);
	crawlExplode(test);
	printPair(test);
}

main1();
