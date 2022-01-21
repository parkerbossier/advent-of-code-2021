import { day15data } from "./day15data";
import { printGrid } from "./libs";

function main1(data: number[][]) {
	printGrid(data);

	function search() {
		
	}
}

const data = day15data
	.split('\n')
	.map(l => l
		.split('')
		.map(n => parseInt(n, 10))
	);

main1(data);
