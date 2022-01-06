"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const day4data_1 = require("./day4data");
function main1(numbers, boards) {
    const markBoards = boards.map(b => {
        return b.map(r => {
            return new Array(b.length).fill(false);
        });
    });
    let winningBoardIndex = -1;
    let score = -1;
    for (let n = 0; n < numbers.length; n++) {
        const number = numbers[n];
        for (let b = 0; b < boards.length; b++) {
            mark(boards[b], markBoards[b], number);
            if (checkBoard(markBoards[b])) {
                winningBoardIndex = b;
                break;
            }
        }
        if (winningBoardIndex > -1) {
            score = scoreBoard(boards[winningBoardIndex], markBoards[winningBoardIndex], number);
            break;
        }
    }
    console.log(score);
}
function main2(numbers, boards) {
    const markBoards = boards.map(b => {
        return b.map(r => {
            return new Array(b.length).fill(false);
        });
    });
    let lastWinningBoardIndex = -1;
    let numberAtLastWin = -1;
    let boardsAlreadyWon = [];
    for (let n = 0; n < numbers.length; n++) {
        const number = numbers[n];
        for (let b = 0; b < boards.length; b++) {
            if (boardsAlreadyWon.includes(b))
                continue;
            mark(boards[b], markBoards[b], number);
            if (checkBoard(markBoards[b])) {
                boardsAlreadyWon.push(b);
                lastWinningBoardIndex = b;
                numberAtLastWin = number;
            }
        }
    }
    const score = scoreBoard(boards[lastWinningBoardIndex], markBoards[lastWinningBoardIndex], numberAtLastWin);
    console.log(score);
}
function mark(board, markBoard, number) {
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board.length; c++) {
            if (board[r][c] === number)
                markBoard[r][c] = true;
        }
    }
}
function checkBoard(markBoard) {
    // rows
    if (markBoard.some(r => r.every(Boolean)))
        return true;
    // cols
    for (let c = 0; c < markBoard.length; c++) {
        const col = markBoard.map(r => r[c]);
        if (col.every(Boolean))
            return true;
    }
}
function scoreBoard(board, markBoard, number) {
    const flatBoard = board.flatMap(r => r);
    const flatMarkBoard = markBoard.flatMap(r => r);
    const score = flatBoard
        .map((n, i) => {
        const isMarked = flatMarkBoard[i];
        return isMarked ? 0 : n;
    })
        .reduce((p, c) => p + c, 0);
    return score * number;
}
const chunks = day4data_1.day4data.split('\n\n');
const numbers = chunks[0].split(',').map(n => parseInt(n, 10));
const boards = (() => {
    const _boards = chunks.slice(1).map(chunk => {
        const _board = chunk.split('\n').map(line => {
            return line
                .split(' ')
                .filter(Boolean)
                .map(n => parseInt(n.trim(), 10));
        });
        return _board;
    });
    return _boards;
})();
main1(numbers, boards);
main2(numbers, boards);
