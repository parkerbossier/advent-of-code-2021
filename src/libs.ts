export function printGrid<T>(grid: T[][], transformer?: (n: T) => string) {
	const string = grid.map(r => r.map(n => transformer?.(n) ?? n).join('')).join('\n');
	console.log(string);
}
