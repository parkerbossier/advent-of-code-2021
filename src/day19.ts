import _ from 'lodash';
import { day19data } from './day19data';

function main(scanners: Scanner[]) {
	const seps0 = scanners[0].getBeaconSeparations();
	const seps1 = scanners[1].getBeaconSeparations();

	const intersection = _.intersectionBy(seps0, seps1, s => {
		return s[2].map(n => Math.abs(n)).join(',');
	});

	// console.log(intersection);

	console.log(seps0.slice(0, 2))
	console.log(seps1.slice(0, 2))
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
		const beaconSeparations: [number, number, number[]][] = [];
		for (let i = 0; i < this.beacons.length; i++) {
			for (let j = i + 1; j < this.beacons.length; j++) {
				const iBeacon = this.beacons[i];
				const jBeacon = this.beacons[j];
				const diff = iBeacon.map((n, bi) => n - jBeacon[bi]);
				beaconSeparations.push([i, j, diff]);
			}
		}
		return beaconSeparations;
	}
}

const data = day19data
	.split('\n\n')
	.map(s => new Scanner(s));

main(data);
