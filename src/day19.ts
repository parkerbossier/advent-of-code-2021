import _ from 'lodash';
import * as math from 'mathjs';
import { day19data } from './day19data';

function negateDiffString(diff: string) {
	const parsed = JSON.parse(diff) as number[];
	const negated = parsed.map(n => n * -1);
	return JSON.stringify(negated);
}

function separationsMightMatch(a: number[], b: number[]) {
	const aNorm = [...a].map(n => Math.abs(n)).sort();
	const bNorm = [...b].map(n => Math.abs(n)).sort();
	return _.isEqual(aNorm, bNorm);
}


/*
p1 = [0, 1, 2]
p2 = [2, 4, 1]
sepA = [2, 3, -1]

// rotate [0, -1, 2]
p1 = [0, -1, 2]
p2 = [2, -4, 1]
sepB = [2, -3, -1]

// rotate [0, -1, 2]
sepAr = [2, -3, -1]


initial
x y z

rotate around x
x -z y

rotate around y
z y -x

rotate around z
-y x z



*/

/** b1 - b0 */
function subtractBeacons(b1: number[], b0: number[]) {
	{
		return b0.map((b0n, i) => b1[i] - b0n);
	}
}

function main(scanners: Scanner[]) {
	const s0 = scanners[0];
	const s1 = scanners[1];

	// console.log(s1.beacons[0])
	// s1.translate([-36, 6, 33]);
	// console.log(s1.beacons[1])

	const seps0 = s0.getBeaconSeparations().beaconSeparations2;
	let seps1 = s1.getBeaconSeparations().beaconSeparations2;

	breakout:
	for (let facingAxis = 0; facingAxis < 3; facingAxis++) {
		for (let facingAxisDirection = 0; facingAxisDirection < 2; facingAxisDirection++) {
			for (let rotation = 0; rotation < 4; rotation++) {
				console.log({ facingAxis, facingAxisDirection, rotation });

				s1.rotate(facingAxis, facingAxisDirection, rotation);

				seps1 = s1.getBeaconSeparations().beaconSeparations2;

				const matchingPairs: number[][][] = [];
				for (const s0 of seps0) {
					const s1 = seps1.get(s0[0]);
					if (s1) {
						matchingPairs.push([
							s0[1], s1
						]);
					}
				}

				console.log('matching pairs')
				//console.log(matchingPairs);
				console.log(matchingPairs.length);

				if (matchingPairs.length < 12 * 6)
					continue;

				const offsets = matchingPairs.flatMap(p => {
					const s0BeaconA = s0.beacons[p[0][0]];
					const s0BeaconB = s0.beacons[p[0][1]];
					const s1BeaconA = s1.beacons[p[1][0]];
					const s1BeaconB = s1.beacons[p[1][1]];

					return [
						subtractBeacons(s0BeaconA, s1BeaconA),
						subtractBeacons(s0BeaconB, s1BeaconB)
					];
				});

				const offsetCounts: [string, number][] = _.map(
					_.countBy(offsets, a => JSON.stringify(a)),
					(count, offset) => [offset, count]
				);
				const bestOffset = _.sortBy(offsetCounts, oc => oc[1])[0];
				if (bestOffset[1] < 12)
					continue;

				const offset: number[] = JSON.parse(bestOffset[0]);
				console.log('offset', offset)

				s1.translate(offset);

				console.log('s0')
				console.log(s0.beacons)
				console.log('s1')
				console.log(s1.beacons)

				console.log('mutual')
				console.log(_.intersectionWith(s0.beacons, s1.beacons, _.isEqual))

				break breakout;
			}
		}
	}
}

class Scanner {
	public beacons: number[][];
	public name: string;
	private originalBeacons: number[][];

	constructor(def: string) {
		const lines = def.split('\n');
		this.name = lines[0].replace(/[^\d]/g, '').trim();
		this.beacons = lines.slice(1).map(l => {
			const beacon = l.split(',').map(n => parseInt(n, 10));
			return beacon;
		});
		this.originalBeacons = this.beacons;
	}

	getBeaconSeparations() {
		const beaconSeparations: [number, number, number, number[]][] = [];
		const beaconSeparations2 = new Map<string, number[]>();

		for (let i = 0; i < this.beacons.length; i++) {
			for (let j = 0; j < this.beacons.length; j++) {
				if (i === j) continue;
				// for (let j = i + 1; j < this.beacons.length; j++) {
				const iBeacon = this.beacons[i];
				const jBeacon = this.beacons[j];
				const diff = iBeacon.map((n, bi) => n - jBeacon[bi]);
				beaconSeparations.push([parseInt(this.name, 10), i, j, diff]);
				beaconSeparations2.set(JSON.stringify(diff), [i, j]);
			}
		}
		return { beaconSeparations, beaconSeparations2 };
	}

	rotate(facing: number, facingDirection: number, rotation: number) {
		const facingVector = [
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1]
		][facing];

		const newBeacons = this.originalBeacons.map(b => {
			const rotatedFacing = (() => {
				switch (facing) {
					case 0:
						return math.rotate(b, facingDirection * Math.PI, [0, 0, 1]);
					case 1:
						return math.rotate(b, Math.PI / 2 + facingDirection * Math.PI, [0, 0, 1]);
					default:
						return math.rotate(b, -Math.PI / 2 + facingDirection * Math.PI, [0, 1, 0]);
				}
			})();
			const rotatedAround = math.rotate(rotatedFacing, rotation * Math.PI / 2, facingVector);

			return rotatedAround.map(Math.round);
		});
		this.beacons = newBeacons;
	}

	translate(offset: number[]) {
		const newBeacons = this.beacons.map(b => {
			return [b[0] + offset[0], b[1] + offset[1], b[2] + offset[2]];
		});
		this.originalBeacons = newBeacons;
		this.beacons = newBeacons;
	}
}

const data = day19data
	.split('\n\n')
	.map(s => new Scanner(s));

main(data);
//main2();
