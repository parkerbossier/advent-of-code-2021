import { day20data } from "./day20data";

function main1(algo: string, image: string[][]) {
	let workingImage = image;

	printImage(workingImage);
	console.log('');

	for (let i = 0; i < 3; i++) {
		workingImage = enhance(algo, workingImage);

		printImage(workingImage);
		console.log('');
	}
}

function enhance(algo: string, image: string[][]) {
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

	const newImage: string[][] = [...image].map(r => new Array(r.length));
	for (let r = 0; r < image.length; r++) {
		for (let c = 0; c < image[0].length; c++) {
			const pixel = kernel.map(k => image[k[0]]?.[k[1]] ?? '.').join('');
			const pixelBinary = pixel.replace(/\./g, '0').replace(/#/g, '1');
			const algoIndex = parseInt(pixelBinary, 2);
			const newPixelValue = algo[algoIndex];
			newImage[r][c] = newPixelValue;
		}
	}

	return newImage;
}

function printImage(image: string[][]) {
	console.log(image.map(r => r.join('')).join('\n'));
}

const data = (() => {
	const [algo, imageString] = day20data.split('\n\n');
	const image = imageString.split('\n').map(r => r.split(''));

	return { algo, image };
})();

main1(data.algo, data.image);
