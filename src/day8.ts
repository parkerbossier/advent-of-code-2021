import _ from 'lodash';
import { day8data } from './day8data';

type Data = typeof data;

function main1(data: Data) {
	const counts = data.map(r => {
		const ones = r.output.filter(n => n.length === 2).length;
		const fours = r.output.filter(n => n.length === 4).length;
		const sevens = r.output.filter(n => n.length === 3).length;
		const eights = r.output.filter(n => n.length === 7).length;

		return ones + fours + sevens + eights;
	});

	console.log(counts.reduce((p, c) => p + c, 0));
}

function main2(data: Data) {
	const outputs = data.map(r => {
		// 1 (unique signal length)
		const oneSignal = r.signals.find(s => s.length === 2)!.split('');
		const signalOptionsForCF = oneSignal;

		// 7 (unique signal length)
		const sevenSignal = r.signals.find(s => s.length === 3)!.split('');
		const finalSignalForA = _.difference(sevenSignal, oneSignal)[0];

		// 4 (unique signal length)
		const fourSignal = r.signals.find(s => s.length === 4)!.split('');
		const signalOptionsForBD = _.difference(fourSignal, signalOptionsForCF);

		// 8 (unique signal length)
		const eightSignal = r.signals.find(s => s.length === 7)!.split('');
		const signalOptionsForEG = _.difference(eightSignal, oneSignal, fourSignal, [finalSignalForA]);

		// 3 (c+f outputs on, length = 5)
		const threeSignal = r.signals
			.find(s => s.length === 5 && _.intersection(s.split(''), oneSignal).length === 2)!
			.split('');
		const signalOptionsForDG = _.difference(threeSignal, [finalSignalForA], oneSignal);
		const finalSignalForD = _.intersection(signalOptionsForBD, signalOptionsForDG)[0];
		const finalSignalForG = _.intersection(signalOptionsForDG, signalOptionsForEG)[0];
		const finalSignalForB = _.difference(signalOptionsForBD, [finalSignalForD])[0];
		const finalSignalForE = _.difference(signalOptionsForEG, [finalSignalForG])[0];

		// 2 (length = 5, all other segments match)
		const known2Segments = [finalSignalForA, finalSignalForD, finalSignalForE, finalSignalForG];
		const twoSignal = r.signals
			.find(s => s.length === 5 && _.intersection(s.split(''), known2Segments).length === 4)!
			.split('');
		const finalSignalForC = _.difference(twoSignal, known2Segments)[0];
		const finalSignalForF = _.difference(signalOptionsForCF, [finalSignalForC])[0];

		const finalSignalToOutput = {
			[finalSignalForA]: 'a',
			[finalSignalForB]: 'b',
			[finalSignalForC]: 'c',
			[finalSignalForD]: 'd',
			[finalSignalForE]: 'e',
			[finalSignalForF]: 'f',
			[finalSignalForG]: 'g'
		};
		const outputDigits = r.output.map(outputSignal => {
			const transformedOutput = outputSignal
				.split('')
				.map(n => finalSignalToOutput[n])
				.join('');
			return outputToDigit(transformedOutput);
		});
		const output = parseInt(outputDigits.join(''), 10);
		return output;
	});

	const sum = outputs.reduce((p, c) => p + c, 0);
	console.log(sum);
}

function outputToDigit(outputSignal: string) {
	const sorted = outputSignal.split('').sort().join('');
	const outputToDigitMap: Record<string, number> = {
		abcefg: 0,
		cf: 1,
		acdeg: 2,
		acdfg: 3,
		bcdf: 4,
		abdfg: 5,
		abdefg: 6,
		acf: 7,
		abcdefg: 8,
		abcdfg: 9
	};
	return outputToDigitMap[sorted];
}

const data = day8data.split('\n').map(row => {
	const [signals, output] = row.split(' | ').map(n => n.split(' '));
	return { signals, output };
});

main1(data);
main2(data);
