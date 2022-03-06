import _ from "lodash";
import { day20data } from "./day20data";

/** An array of '1' or '#' pixels ('row,column') */
type Image = Set<string>;

function main1() {
	const [algo, imageString] = day20data.split('\n\n');
	const image: Image = new Set();
	const splitImageString = imageString.split('\n');
	splitImageString.forEach((row, r) => {
		const rowArray = row.split('');
		rowArray.forEach((col, c) => {
			if (col === '#')
				image.add(pixelToKey([r, c]));
		});
	});

	let workingImage = image;

	for (let i = 0; i < 2; i++) {
		workingImage = enhance(algo, workingImage);
		// printImage(workingImage);
		// console.log();
	}

	// console.log(workingImage);
	console.log(workingImage.size);
}

function enhance(algo: string, image: Image) {
	const kernel = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0, 0],
		[0, 1],
		[1, -1],
		[1, 0],
		[1, 1]
	];

	const newImage: typeof image = new Set();

	// assuming dense images, full scanning is easier to keep track of
	const { maxC, maxR, minC, minR } = getImageBounds(image);
	// console.log(getImageBounds(image));
	for (let r = minR - 1; r <= maxR + 1; r++) {
		for (let c = minC - 1; c <= maxC + 1; c++) {
			const newPixelAlgoKey = kernel.map(k => {
				const sourcePixel = [k[0] + r, k[1] + c];
				const sourcePixelValue = image.has(pixelToKey(sourcePixel)) ? '1' : '0';
				return sourcePixelValue;
			}).join('');
			// console.log('index', parseInt(newPixelAlgoKey, 2))
			// console.log(newPixelAlgoKey)
			const newPixelValue = algo[parseInt(newPixelAlgoKey, 2)];
			if (newPixelValue === '#')
				newImage.add(pixelToKey([r, c]));
		}
	}

	return newImage;
}

/**
 * Prints the given image with 1px padding
 */
function printImage(image: Image) {
	const { maxC, maxR, minC, minR } = getImageBounds(image);

	const pretty: string[][] = _.range(0, maxR - minR + 3).map(_r => new Array(maxC - minC + 3).fill('.'));

	[...image.values()].forEach(k => {
		const [r, c] = keyToPixel(k);
		pretty[r - minR + 1][c - minC + 1] = '#';
	})

	console.log(pretty.map(r => r.join('')).join('\n'));
}

function getImageBounds(image: Image) {
	const rs = [...image.values()].map(k => keyToPixel(k)[0]);
	const minR = Math.min(...rs);
	const maxR = Math.max(...rs);
	const cs = [...image.values()].map(k => keyToPixel(k)[1]);
	const minC = Math.min(...cs);
	const maxC = Math.max(...cs);

	return {
		maxC, maxR, minC, minR
	};
}

function keyToPixel(k: string) {
	return k.split(',').map(n => parseInt(n, 10));
}
function pixelToKey(p: number[]) {
	return p.join(',');
}

type Image2 = string[][];

async function main2() {
	const [algo, imageString] = day20data.split('\n\n');
	const image: Image2 = imageString.split('\n').map(r => r.split(''));

	let workingImage = image;
	for (let i = 0; i < 50; i++) {
		if (algo[0] === '.')
			workingImage = enhance2(algo, workingImage, '.');
		else
			workingImage = enhance2(algo, workingImage, i % 2 === 0 ? '.' : '#');

		// console.log(workingImage.map(r => r.join('')).join('\n'));
		// console.log();

		// await new Promise(res => {
		// 	setTimeout(res, 500);
		// });
	}

	// console.log(workingImage.map(r => r.join('')).join('\n'))
	console.log(workingImage.flatMap(r => r).filter(c => c === '#').length);
}

function enhance2(algo: string, image: Image2, background: string) {
	const kernel = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0, 0],
		[0, 1],
		[1, -1],
		[1, 0],
		[1, 1]
	];

	const newImage = _.range(0, image.length + 2)
		.map(_r => _.range(0, image[0].length + 2)
			.map(_c => '.')
		);

	for (let r = -1; r < image.length + 1; r++) {
		for (let c = -1; c < image[0].length + 1; c++) {
			const newPixelAlgoKey = kernel.map(k => {
				const sourcePixel = image[r + k[0]]?.[c + k[1]] ?? background;
				return sourcePixel;
			}).join('').replace(/\./g, '0').replace(/#/g, '1');
			const newPixelValue = algo[parseInt(newPixelAlgoKey, 2)];
			newImage[r + 1][c + 1] = newPixelValue;
		}
	}

	return newImage;
}

// main1();
main2().finally(() => process.exit());
