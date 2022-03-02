import _ from 'lodash';
import { day19data } from './day19data';

function negateDiffString(diff: string) {
	const parsed = JSON.parse(diff) as number[];
	const negated = parsed.map(n => n * -1);
	return JSON.stringify(negated);
}

function main(scanners: Scanner[]) {
	const seps0 = scanners[0].getBeaconSeparations().beaconSeparations2;
	const seps1 = scanners[1].getBeaconSeparations().beaconSeparations2;

	const matchingPairs: number[][][] = [];
	for (const s0 of seps0) {
		const s1 = seps1.get(s0[0]) || seps1.get(negateDiffString(s0[0]));
		if (s1) {
			matchingPairs.push([
				s0[1], s1
			]);
		}
	}

	// assume a point on your right
	// [1,0,0]
	// rotating around you in the xz plane
	// [0,0,1]
	// [-1,0,0]
	// [0,0,-1]
	// rotating around you in the xy plane
	// [0,1,0]
	// [-1,0,0]
	// [0,-1,0]
	// rotating around you in the yz plane
	// n/a

	// [a, b, c]
	// single flip: 3
	// double flip: 3
	// trip flip: 1
	// permute: 6

	console.log(matchingPairs);

	// console.log(seps0)
	// console.log(seps1)

	// const intersection = _.intersectionBy(seps0, seps1, s => {
	// 	return s[3].map(n => n).join(',');
	// });

	// console.log('intersection')
	// console.log(intersection);
	// console.log(intersection.length);
	// console.log();

	// return;

	// console.log('s0')
	// console.log(seps0.map(r => JSON.stringify(r)).join('\n'));
	// console.log();

	// console.log('s1')
	// console.log(seps1.map(r => JSON.stringify(r)).join('\n'));
	// console.log();
}

class Scanner {
	private beacons: number[][];
	public locationRelativeToS0?: number[];
	public name: string;

	constructor(def: string) {
		const lines = def.split('\n');
		this.name = lines[0].replace(/[^\d]/g, '').trim();
		this.beacons = lines.slice(1).map(l => {
			const beacon = l.split(',').map(n => parseInt(n, 10));
			return beacon;
		});
	}

	getBeaconSeparations() {
		const beaconSeparations: [number, number, number, number[]][] = [];
		const beaconSeparations2 = new Map<string, number[]>();

		for (let i = 0; i < this.beacons.length; i++) {
			for (let j = i + 1; j < this.beacons.length; j++) {
				const iBeacon = this.beacons[i];
				const jBeacon = this.beacons[j];
				const diff = iBeacon.map((n, bi) => n - jBeacon[bi]);
				beaconSeparations.push([parseInt(this.name, 10), i, j, diff]);
				beaconSeparations2.set(JSON.stringify(diff), [i, j]);
			}
		}
		return { beaconSeparations, beaconSeparations2 };
	}
}

const data = day19data
	.split('\n\n')
	.map(s => new Scanner(s));

main(data);
