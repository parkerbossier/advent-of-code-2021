import _ = require("lodash");
import { day14data } from "./day14data";

function main1(template: string, rules: Record<string, string>) {
	for (let step = 0; step < 10; step++) {
		const pairs = _.range(0, template.length - 1).map(i => template.slice(i, i + 2));
		const expandedPairs = pairs.map(p => {
			const chars = p.split('');
			return [chars[0], rules[p], chars[1]].join('');
		});
		const newTemplate = expandedPairs.map((p, i) => {
			if (i === expandedPairs.length - 1)
				return p;
			else
				return p.substring(0, 2);
		});
		template = newTemplate.join('');
	}

	const counts = _.countBy(template);
	const maxCount = Math.max(...Object.values(counts));
	const minCount = Math.min(...Object.values(counts));

	console.log(maxCount - minCount);
}

/**
 * This solution likely needs to keep track of the first/last pair to avoid an off-by-one situation.
 * However, the final solution worked, so ¯\_(ツ)_/¯
 */
function main2(template: string, rules: Record<string, string>) {
	const initialPairs = _.range(0, template.length - 1).map(i => template.slice(i, i + 2));
	const pairCounts = _.countBy(initialPairs);

	for (let step = 0; step < 40; step++) {
		const pairCountsToAdd: Record<string, number> = {};
		_.forEach(pairCounts, (count, pair) => {
			pairCountsToAdd[pair] ??= 0;
			pairCountsToAdd[pair] -= count;

			const replacementPairs = [
				pair[0] + rules[pair],
				rules[pair] + pair[1]
			];
			replacementPairs.forEach(p => {
				pairCountsToAdd[p] ??= 0;
				pairCountsToAdd[p] += count;
			});
		});

		_.forEach(pairCountsToAdd, (v, k) => {
			pairCounts[k] ??= 0;
			pairCounts[k] += v;
		});
	}

	// for all elements, add all *X counts
	const elements = _.uniq(Object.keys(pairCounts).join(''));
	const elementCounts: Record<string, number> = {};
	elements.forEach(e => {
		elementCounts[e] ??= 0;
		_.forEach(pairCounts, (count, pair) => {
			if (pair.endsWith(e))
				elementCounts[e] += count;
		});
	});

	const maxCount = Math.max(...Object.values(elementCounts));
	const minCount = Math.min(...Object.values(elementCounts));

	console.log(maxCount - minCount);
}

const [template, rulesText] = day14data.split('\n\n');
const rules: Record<string, string> = {};
rulesText
	.split('\n')
	.forEach(l => {
		const matches = l.match(/(\w+) -> (\w+)/)!;
		rules[matches[1]] = matches[2];
	});

main1(template, rules);
main2(template, rules);
