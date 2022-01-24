import _ = require("lodash");
import { day15data } from "./day15data";
import { printGrid } from "./libs";
import { Heap } from 'heap-js';

type Vertex = [number, number];

function main1(data: number[][]) {
	//printGrid(data);

	const { d, s } = dijkstra(data);
	console.log(d);
}

/**
 * Heap-based priority queue approach.
 * https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
 */
function dijkstra(graph: number[][]) {
	const source: Vertex = [0, 0];
	const target: Vertex = [graph.length - 1, graph[0].length - 1];
	const Q = new Heap<Vertex>((a, b) => {
		return dist[vertexToString(a)] - dist[vertexToString(b)];
	});
	const dist: Record<string, number> = {};
	const prev: Record<string, [number, number]> = {};

	dist[vertexToString(source)] = 0;
	Q.push(source);

	while (Q.length > 0) {
		const u = Q.pop()!;

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
			return inBounds;
		});
		validNeighbors.forEach(v => {
			const alt = dist[vertexToString(u)] + graph[v[0]][v[1]];
			const distToV = dist[vertexToString(v)]
			if (distToV === undefined || alt < distToV) {
				dist[vertexToString(v)] = alt;
				prev[vertexToString(v)] = u;
				Q.push(v);
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

function main2(data: number[][]) {
	const bigDataX1Row = data.map(r => {
		return [...r, ...r, ...r, ...r, ...r];
	});
	const bigData = [
		...bigDataX1Row,
		..._.cloneDeep(bigDataX1Row),
		..._.cloneDeep(bigDataX1Row),
		..._.cloneDeep(bigDataX1Row),
		..._.cloneDeep(bigDataX1Row)
	];
	const diff = [
		[0, 1, 2, 3, 4],
		[1, 2, 3, 4, 5],
		[2, 3, 4, 5, 6],
		[3, 4, 5, 6, 7],
		[4, 5, 6, 7, 8]
	];
	for (let r = 0; r < bigData.length; r++) {
		for (let c = 0; c < bigData[0].length; c++) {
			const diffR = Math.floor(r / data.length);
			const diffC = Math.floor(c / data[0].length);

			bigData[r][c] += diff[diffR][diffC]
			if (bigData[r][c] > 9)
				bigData[r][c] -= 9;
		}
	}

	const { d, s } = dijkstra(bigData);
	console.log(d);
}

const data = day15data
	.split('\n')
	.map(l => l
		.split('')
		.map(n => parseInt(n, 10))
	);

main1(data);
main2(data);
