import _ = require("lodash");
import { day15data } from "./day15data";
import { printGrid } from "./libs";

type Vertex = [number, number];

function main1(data: number[][]) {
	//printGrid(data);

	const { s, d } = dijkstra(data);
	console.log(d);
}

/**
 * 
 * https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
 */
function dijkstra(graph: number[][]) {
	const source: Vertex = [0, 0];
	const target: Vertex = [graph.length - 1, graph[0].length - 1];
	const Q: Vertex[] = [];
	const dist: Record<string, number> = {};
	const prev: Record<string, [number, number]> = {};

	for (let r = 0; r < graph.length; r++) {
		for (let c = 0; c < graph[0].length; c++) {
			const v: Vertex = [r, c];

			dist[vertexToString(v)] = Infinity;
			Q.push(v);
		}
	}
	dist[vertexToString(source)] = 0;

	while (Q.length > 0) {
		Q.sort((a, b) => {
			return dist[vertexToString(a)] - dist[vertexToString(b)];
		});
		const u = Q.splice(0, 1)[0];

		if (_.isEqual(u, target))
			break;

		const neighbors: Vertex[] = [
			[u[0] - 1, u[1]],
			[u[0], u[1] - 1],
			[u[0] + 1, u[1]],
			[u[0], u[1] + 1]
		];
		const validNeighbors = neighbors.filter(v => {
			const inBounds = (
				v[0] >= 0 && v[0] < graph.length
				&& v[1] >= 0 && v[1] < graph[0].length
			);
			const inQ = Q.find(q => _.isEqual(q, v));
			return inBounds && inQ;
		});
		validNeighbors.forEach(v => {
			const alt = dist[vertexToString(u)] + graph[v[0]][v[1]];
			if (alt < dist[vertexToString(v)]) {
				dist[vertexToString(v)] = alt;
				prev[vertexToString(v)] = u;
			}
		});
	}

	const s: Vertex[] = [];
	let u = target;
	while (u) {
		s.unshift(u);
		u = prev[vertexToString(u)];
	}

	const d = dist[vertexToString(target)];

	return { s, d };
}

function vertexToString(coords: Vertex) {
	return coords.join(',');
}

const data = day15data
	.split('\n')
	.map(l => l
		.split('')
		.map(n => parseInt(n, 10))
	);

main1(data);
