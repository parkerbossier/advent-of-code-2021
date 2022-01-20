//type 

import _ = require("lodash");
import { day12data } from "./day12data";

function main1(edges: [string, string][]) {
	const paths: string[][] = [];

	function explore(cur: string, path: string[]) {
		if (cur === 'end') {
			paths.push([...path, cur]);
			return;
		}

		const neighbors = edges
			.filter(e => e.includes(cur))
			.map(e => e[0] === cur ? e[1] : e[0]);

		neighbors.forEach(n => {
			const largeCave = n === n.toUpperCase();

			// can't visit small caves more than once
			if (!largeCave && path.includes(n))
				return;

			explore(n, [...path, cur]);
		});
	}
	explore('start', []);

	console.log(paths.length);
}

function main2(edges: [string, string][]) {
	const paths: string[][] = [];

	function explore(path: string[]) {
		const cur = path[path.length - 1];

		if (cur === 'end') {
			paths.push(path);
			return;
		}

		const neighbors = edges
			.filter(e => e.includes(cur))
			.map(e => e[0] === cur ? e[1] : e[0])
			.filter(n => n !== 'start');

		neighbors.forEach(n => {
			const largeCave = n === n.toUpperCase();

			if (!largeCave) {
				const caveCounts = {} as Record<string, number>;
				path.forEach(p => {
					if (p === p.toUpperCase())
						return;

					if (caveCounts[p])
						caveCounts[p]++;
					else
						caveCounts[p] = 1;
				});
				const maxCount = Math.max(...Object.values(caveCounts));

				const canExplore = (
					// can always visit a never-visited small cave
					caveCounts[n] === undefined
					// can only visit one small cave twice
					|| (
						maxCount === 1
						&& caveCounts[n] === 1
					)
				);

				if (!canExplore)
					return;
			}

			explore([...path, n]);
		});
	}
	explore(['start']);

	// console.log(paths.map(l => l.join(',')));

	console.log(paths.length);
}

const data = day12data.split('\n').map(r => r.split('-') as [string, string]);

main1(data);
main2(data);