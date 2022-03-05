import _ from 'lodash';
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
function subtractBeacons(b1: number[], b0: number[]) {{
	return b0.map((b0n, i) => b1[i] - b0n);
}}

function main(scanners: Scanner[]) {
	const seps0 = scanners[0].getBeaconSeparations().beaconSeparations2;
	let seps1 = scanners[1].getBeaconSeparations().beaconSeparations2;

	breakout:
	for (let facingAxis = 0; facingAxis < 3; facingAxis++) {
		for (let facingDirection = 1; facingDirection >= -1; facingDirection -= 2) {
			for (let rotation = 0; rotation < 4; rotation++) {
				console.log({ facingAxis, facingDirection, rotation });

				scanners[1].rotate2(facingAxis, facingDirection, rotation);

				seps1 = scanners[1].getBeaconSeparations().beaconSeparations2;

				const matchingPairs: number[][][] = [];
				for (const s0 of seps0) {
					const s1 = seps1.get(s0[0]);
					if (s1) {
						matchingPairs.push([
							s0[1], s1
						]);
					}
				}

				console.log(matchingPairs);
				console.log(matchingPairs.length);

				if (matchingPairs.length >= 12) {
					const offsets = matchingPairs.flatMap(p => {
						const s0BeaconA = scanners[0].beacons[p[0][0]];
						const s0BeaconB = scanners[0].beacons[p[0][1]];
						const s1BeaconA = scanners[0].beacons[p[1][0]];
						const s1BeaconB = scanners[0].beacons[p[1][1]];

						return [
							subtractBeacons(s1BeaconA, s0BeaconA),
							subtractBeacons(s1BeaconB, s0BeaconB)
						];
					});

					console.log(_.uniqBy(offsets, a => JSON.stringify(a)));

					break breakout;
				}
			}
		}
	}

	// console.log('s0 beacons')
	// console.log(scanners[0].beacons)

	// console.log('s1 beacons')
	// console.log(scanners[1].beacons)

	// console.log('in s0 and s1')
	// console.log(_.intersectionWith(scanners[0].beacons, scanners[1].beacons, _.isEqual));
}

class Scanner {
	public beacons: number[][];
	public locationRelativeToS0?: number[];
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
			// for (let j = 0; j < this.beacons.length; j++) {
			// 	if (i === j) continue;
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

	/**
	 * 0-index values are noops
	 * @param p permute (0 - 3)
	 * @param n negate (0 - 7)
	 */
	rotate(p: number, n: number) {
		const newBecons = this.originalBeacons.map(b => {
			const permuted = permute(b, p);
			const negated = negate(permuted, n);
			return negated;
		});
		this.beacons = newBecons;
	}

	rotate2(facingAxis: number, facingDirection: number, rotation: number) {
		const newBecons = this.originalBeacons.map(b => {
			/*
				https://media.istockphoto.com/vectors/3d-coordinate-axis-vector-vector-id818268912?k=20&m=818268912&s=612x612&w=0&h=hVl9cteIRL0UHCv7BwBbWTAQcyVfajDkwosbdG5dSkE=
				
				facingAxis -> rotationAxis
				0 -> n/a
				1 -> 2
				2 -> 1 (-)
	
			
			*/

			const facingPositive = facingDirection > 0;
			const facing = (() => {
				switch (facingAxis) {
					case 0:
						return rotateBeacon(b, 2, facingPositive ? 0 : 2)
					case 1:
						return rotateBeacon(b, 2, facingPositive ? 1 : 3);
					default:
						return rotateBeacon(b, 1, facingPositive ? 3 : 1);
				}
			})();
			const rotated = (() => {
				switch (rotation) {
					case 0:
						return rotateBeacon(facing, 0, rotation)
					case 1:
						return rotateBeacon(facing, 0, rotation);
					default:
						return rotateBeacon(facing, 0, rotation);
				}
			})();

			return rotated;
		});
		this.beacons = newBecons;
	}

	// TODO: rotate diffs instead of beacons and recalcuating?
}

function rotateBeacon(b: number[], axis: number, amount = 1) {
	if (amount === 0)
		return b;

	/*
	 * initial
	 * x y z
	
	 * rotate around x
	 * x -z y
	
	 * rotate around y
	 * z y -x
	
	 * rotate around z
	 * -y x z
	 */

	let nB = [...b];
	for (let i = 0; i < amount; i++) {
		switch (axis) {
			case 0:
				nB = [nB[0], -nB[2], nB[1]];
				break;
			case 1:
				nB = [nB[2], nB[1], -nB[0]];
				break;
			case 2:
				nB = [-nB[1], nB[0], nB[2]];
		}
	}

	return nB;
}

function negate(beacon: number[], n: number) {
	const negateMap = [
		[1, 1, 1],
		[1, 1, -1],
		[1, -1, 1],
		[1, -1, -1],
		[-1, 1, 1],
		[-1, 1, -1],
		[-1, -1, 1],
		[-1, -1, -1]
	];
	return beacon.map((a, i) => {
		return a * negateMap[n][i];
	});
}

function permute(beacon: number[], p: number) {
	const permuteMap = [
		[0, 1, 2],
		[0, 2, 1],
		[1, 0, 2],
		[2, 1, 0]
	];
	return beacon.map((_a, i) => {
		const permutedIndex = permuteMap[p][i];
		return beacon[permutedIndex];
	});
}

const data = day19data
	.split('\n\n')
	.map(s => new Scanner(s));

main(data);
