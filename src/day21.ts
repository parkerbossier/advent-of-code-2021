const p1Start = 4;
const p2Start = 8;
// const p2Start = 9;

function main1() {
	let p1Pos = p1Start;
	let p1Score = 0;
	let p2Pos = p2Start;
	let p2Score = 0;

	let die = 1;
	let timesRolled = 0;
	function rollDie() {
		const curDie = die;
		die = (die % 100) + 1;
		timesRolled++;
		return curDie;
	}

	let player = 1;
	while (p1Score < 1000 && p2Score < 1000) {
		console.log({ p1Pos, p2Pos })
		if (player === 1) {
			p1Pos = ((p1Pos - 1 + rollDie() + rollDie() + rollDie()) % 10) + 1;
			p1Score += p1Pos;
			player = 2;
		}
		else {
			p2Pos = ((p2Pos - 1 + rollDie() + rollDie() + rollDie()) % 10) + 1;
			p2Score += p2Pos;
			player = 1;
		}
	}

	const losingScore = p1Score === 1000 ? p2Score : p1Score;
	console.log(losingScore * timesRolled);
}

interface GameState {
	player: 1 | 2;
	p1Pos: number;
	p1Score: number;
	p2Pos: number;
	p2Score: number;
	roll: 1 | 2 | 3;
}

/*

rol	frq	combinations
3	1	111
4	3	112
5	6	113,122
6	7	123,222
7	6	133,223
8	3	233
9	1	333

total
	27

*/

function main2() {
	let gameStates: GameState[] = [
		{
			player: 1,
			p1Pos: p1Start,
			p1Score: 0,
			p2Pos: p2Start,
			p2Score: 0,
			roll: 1
		}
	];

	function play() {
		
	}

	return;

	while (true) {
		const newGameStates: GameState[] = [];

		for (let i = 0; i < gameStates.length; i++) {
			const gs = gameStates[i];


		}

		break;
	}
}

main1();
main2();
