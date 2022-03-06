import _ from 'lodash';
import * as math from 'mathjs';
import { day19data } from './day19data';

/** b1 - b0 */
function subtractBeacons(b1: number[], b0: number[]) {
	return b0.map((b0n, i) => b1[i] - b0n);
}

function main(scanners: Scanner[]) {
	const [s0, ...unmatchedScanners] = scanners;
	s0.getBeaconSeparations();

	const matchedScanners = [s0];

	while (unmatchedScanners.length > 0) {

		const curScanner = unmatchedScanners.splice(0, 1)[0];
		let foundMatch = false;
		for (const matchedScanner of matchedScanners) {
			const offset = tryMatchScanners(matchedScanner, curScanner);

			if (offset) {
				curScanner.translate(offset);
				matchedScanners.push(curScanner);
				foundMatch = true;
				break;
			}
		}

		if (!foundMatch) {
			unmatchedScanners.push(curScanner);
		}
	}

	console.log({ matchedScanners, unmatchedScanners });

	const uniqueBeacons = _.uniqWith(matchedScanners.flatMap(s => s.beacons), _.isEqual);
	console.log(uniqueBeacons.length);

	let maxDistance = 0;
	for (let i = 0; i < scanners.length; i++) {
		for (let j = i + 1; j < scanners.length; j++) {
			if (i === j) continue;

			const distance = manhattanDistance(scanners[i].locationRelativeToS0, scanners[j].locationRelativeToS0);
			if (distance > maxDistance)
				maxDistance = distance;
		}
	}
	console.log(maxDistance)
}

function manhattanDistance(s0: number[], s1: number[]) {
	return s0.map((s0n, i) => Math.abs(s0n - s1[i])).reduce((a, b) => a + b, 0);
}

function tryMatchScanners(s0: Scanner, s1: Scanner) {
	const s0Seps = s0.lastBeasonSeparations;

	let offset: number[] | null = null;

	breakout:
	// facing x, y, z
	for (let facingAxis = 0; facingAxis < 3; facingAxis++) {
		// facing +, - `facingAxis`
		for (let facingAxisDirection = 0; facingAxisDirection < 2; facingAxisDirection++) {
			// rotate around facing
			for (let rotation = 0; rotation < 4; rotation++) {
				s1.rotate(facingAxis, facingAxisDirection, rotation);

				const s1Seps = s1.getBeaconSeparations();

				const matchingSeps: number[][][] = [];
				for (const s0 of s0Seps) {
					const s1 = s1Seps.get(s0[0]);
					if (s1) {
						matchingSeps.push([
							s0[1], s1
						]);
					}
				}

				if (matchingSeps.length < 12 * 6)
					continue;

				const offsets = matchingSeps.flatMap(p => {
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

				offset = JSON.parse(bestOffset[0]);

				break breakout;
			}
		}
	}

	return offset;
}

class Scanner {
	public beacons: number[][];
	public lastBeasonSeparations: Map<string, number[]> = new Map();
	public locationRelativeToS0 = [0, 0, 0];
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

	/**
	 * Get the separations between all beacons (and cache the result).
	 */
	getBeaconSeparations() {
		const beaconSeparations = new Map<string, number[]>();

		for (let i = 0; i < this.beacons.length; i++) {
			for (let j = 0; j < this.beacons.length; j++) {
				if (i === j) continue;
				const iBeacon = this.beacons[i];
				const jBeacon = this.beacons[j];
				const diff = iBeacon.map((n, bi) => n - jBeacon[bi]);
				beaconSeparations.set(JSON.stringify(diff), [i, j]);
			}
		}
		this.lastBeasonSeparations = beaconSeparations;
		return beaconSeparations;
	}

	/**
	 * (Preface: assume the original orientation of every scanner is facing [1, 0, 0] with the ceiling towards +z.)
	 * 
	 * First, rotate towards the `facing` axis (0-2 for xyz)
	 * in the `facingDirection` direction (0 = negative, 1 = positive).
	 * 
	 * Second, rotate around the new facing vector by `rotation` quarter rotations.
	 * 
	 * Note: all rotation must happen before translation.
	 */
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

	/**
	 * Translates all beacons by `offset`.
	 * Note: all transslation must happen after rotation.
	 */
	translate(offset: number[]) {
		const newBeacons = this.beacons.map(b => {
			return [b[0] + offset[0], b[1] + offset[1], b[2] + offset[2]];
		});
		this.beacons = newBeacons;
		this.locationRelativeToS0 = offset;
	}
}

const data = day19data
	.split('\n\n')
	.map(s => new Scanner(s));

main(data);
