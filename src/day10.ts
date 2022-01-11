import { day10data } from "./day10data";

const delimClosers = ')]}>';
const delimOpeners = '([{<';

function main1(data: string[]) {
	const delimScores = [3, 57, 1197, 25137];
	let errorScore = 0;

	data.forEach(l => {
		const stack: string[] = [];
		for (let i = 0; i < l.length; i++) {
			const curChar = l[i];
			const isOpener = delimOpeners.includes(curChar);

			if (isOpener)
				stack.push(curChar);

			else {
				const lastOpener = stack[stack.length - 1];
				const lastOpenerIndex = delimOpeners.indexOf(lastOpener);
				const expectedCloser = delimClosers[lastOpenerIndex];

				if (curChar === expectedCloser)
					stack.pop();
				else {
					const curCharIndex = delimClosers.indexOf(curChar);
					errorScore += delimScores[curCharIndex];
					break;
				}
			}
		}
	});

	console.log(errorScore);
}

function main2(data: string[]) {
	const delimScores = [1, 2, 3, 4];
	let scores: number[] = [];

	data.forEach(l => {
		const stack: string[] = [];
		for (let i = 0; i < l.length; i++) {
			const curChar = l[i];
			const isOpener = delimOpeners.includes(curChar);

			if (isOpener)
				stack.push(curChar);

			else {
				const lastOpener = stack[stack.length - 1];
				const lastOpenerIndex = delimOpeners.indexOf(lastOpener);
				const expectedCloser = delimClosers[lastOpenerIndex];

				if (curChar === expectedCloser)
					stack.pop();

				// error
				else
					return;
			}
		}

		const missingDelims = stack.reverse();
		
		const score = missingDelims.map(d => {
			const i = delimOpeners.indexOf(d);
			return delimScores[i];
		}).reduce((p, c) => 5 * p + c, 0);
		scores.push(score);
	});

	scores.sort((a, b) => b - a);
	console.log(scores[Math.floor(scores.length / 2)]);
}

const data = day10data.split('\n');
main1(data);
main2(data);
