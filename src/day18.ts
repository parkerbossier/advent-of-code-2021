import { isNumber } from 'lodash';
import _ = require('lodash');
import { day18data } from './day18data';

function tryExplode(input: string) {
	/** 0-based */
	let depth = 0;

	let i = 0;
	while (i < input.length) {
		if (depth === 4) {
			const rest = input.slice(i);
			const pairMatch = rest.match(/^(\[\d+,\d+\])/);
			if (pairMatch) {
				const pairString = pairMatch[1];
				const pair: [number, number] = JSON.parse(pairString);

				// replace the pair
				input = input.slice(0, i) + '0' + input.slice(i + pairString.length);

				// i is now the index of the just added '0'

				// right
				const rightRest = input.slice(i + 1);
				const rightNumberMatch = rightRest.match(/(\d+)/);
				if (rightNumberMatch) {
					const rightNumberString = rightNumberMatch[1];
					const numberIndex = i + 1 + rightNumberMatch.index!;
					const newNumber = parseInt(rightNumberString, 10) + pair[1];
					input =
						input.slice(0, numberIndex)
						+ newNumber
						+ input.slice(numberIndex + rightNumberString.length);
				}

				// left
				const leftRest = input.slice(0, i);
				const leftNumberMatch = leftRest.match(/(\d+)(?!.*\d)/);
				if (leftNumberMatch) {
					const leftNumberString = leftNumberMatch[1];
					const numberIndex = leftNumberMatch.index!;
					const newNumber = parseInt(leftNumberString, 10) + pair[0];
					input =
						input.slice(0, numberIndex)
						+ newNumber
						+ input.slice(numberIndex + leftNumberString.length);
				}

				return input;
			}
		}

		if (input[i] === '[')
			depth++;
		else if (input[i] === ']')
			depth--;

		i++;
	}

	return input;
}

function trySplit(input: string) {
	const numberMatch = input.match(/(\d{2,})/);
	if (numberMatch) {
		const numberString = numberMatch[1];
		const numberIndex = numberMatch.index!;
		const number = parseInt(numberString, 10);
		const newPair = [Math.floor(number / 2), Math.ceil(number / 2)];
		input =
			input.slice(0, numberMatch.index)
			+ JSON.stringify(newPair)
			+ input.slice(numberIndex + numberString.length);
	}

	return input;
}

function reduce(input: string) {
	while (true) {
		let result = tryExplode(input);

		// exploded; keep going
		if (result !== input) {
			input = result;
			continue;
		}

		// no explosions possible
		result = trySplit(input);

		// split; keep going
		if (result !== input) {
			input = result;
			continue;
		}

		return input;
	}
}

type Pair = [number | Pair, number | Pair];
function magnitude(pair: Pair): number {
	const left = _.isNumber(pair[0]) ? pair[0] : magnitude(pair[0]);
	const right = _.isNumber(pair[1]) ? pair[1] : magnitude(pair[1]);
	return 3 * left + 2 * right;
}

function tests() {
	const explodeTests = [
		['[[[[[9,8],1],2],3],4]', '[[[[0,9],2],3],4]'],
		['[7,[6,[5,[4,[3,2]]]]]', '[7,[6,[5,[7,0]]]]'],
		['[[6,[5,[4,[3,2]]]],1]', '[[6,[5,[7,0]]],3]'],
		['[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]', '[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]'],
		['[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]', '[[3,[2,[8,0]]],[9,[5,[7,0]]]]']
	];

	console.log('explode tests');
	explodeTests.forEach((t, i) => {
		const [input, expected] = t;
		const actual = tryExplode(input);

		console.group(`${i} ${expected === actual ? 'PASS' : 'FAIL'}`);
		console.log('input   ', input);
		console.log('expected', expected);
		console.log('actual  ', actual);
		console.groupEnd();
		console.log();
	});

	const splitTests = [
		['[[[[0,7],4],[15,[0,13]]],[1,1]]', '[[[[0,7],4],[[7,8],[0,13]]],[1,1]]'],
		['[[[[0,7],4],[[7,8],[0,13]]],[1,1]]', '[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]']
	];

	console.log('split tests');
	splitTests.forEach((t, i) => {
		const [input, expected] = t;
		const actual = trySplit(input);

		console.group(`${i} ${expected === actual ? 'PASS' : 'FAIL'}`);
		console.log('input   ', input);
		console.log('expected', expected);
		console.log('actual  ', actual);
		console.groupEnd();
		console.log();
	});

	const reduceTests = [
		['[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]', '[[[[0,7],4],[[7,8],[6,0]]],[8,1]]'],
		['[[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]],[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]]', '[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]']
	];

	console.log('reduce tests');
	reduceTests.forEach((t, i) => {
		const [input, expected] = t;
		const actual = reduce(input);

		console.group(`${i} ${expected === actual ? 'PASS' : 'FAIL'}`);
		console.log('input   ', input);
		console.log('expected', expected);
		console.log('actual  ', actual);
		console.groupEnd();
		console.log();
	});

	const magnitudeTests: [string, number][] = [
		['[[1,2],[[3,4],5]]', 143],
		['[[[[0,7],4],[[7,8],[6,0]]],[8,1]]', 1384],
		['[[[[1,1],[2,2]],[3,3]],[4,4]]', 445],
		['[[[[3,0],[5,3]],[4,4]],[5,5]]', 791],
		['[[[[5,0],[7,4]],[5,5]],[6,6]]', 1137],
		['[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]', 3488],
	];

	console.log('magnitude tests');
	magnitudeTests.forEach((t, i) => {
		const [input, expected] = t;
		const actual = magnitude(JSON.parse(input));

		console.group(`${i} ${expected === actual ? 'PASS' : 'FAIL'}`);
		console.log('input   ', input);
		console.log('expected', expected);
		console.log('actual  ', actual);
		console.groupEnd();
		console.log();
	});
}

function main1(input: string[]) {
	let sum = input[0];
	for (let i = 1; i < input.length; i++) {
		const added = `[${sum},${input[i]}]`;
		sum = reduce(added);
	}

	console.log('sum', sum)
	const mag = magnitude(JSON.parse(sum));

	console.log(mag);
}

// tests();

const data = day18data.split('\n');
main1(data);
