import _ from "lodash";
import { day20data } from "./day20data";

/** An array of '1' or '#' pixels ('row,column') */
type Image = Set<string>;

function main1(algo: string, image: Image) {
	let workingImage = image;

	for (let i = 0; i < 2; i++) {
		workingImage = enhance(algo, workingImage);
		printImage(workingImage);
		console.log();
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

const data = (() => {
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
	const imageDims = [splitImageString.length, splitImageString[0].length];

	return { algo, image, imageDims };
})();

main1(data.algo, data.image);
