"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const day2data_1 = require("./day2data");
function main1(data) {
    let horizontal = 0;
    let depth = 0;
    data.forEach(line => {
        const [direction, amount] = line;
        switch (direction) {
            case 'forward':
                horizontal += amount;
                break;
            case 'down':
                depth += amount;
                break;
            case 'up':
                depth -= amount;
                break;
        }
    });
    console.log(horizontal * depth);
}
function main2(data) {
    let aim = 0;
    let horizontal = 0;
    let depth = 0;
    data.forEach(line => {
        const [direction, amount] = line;
        switch (direction) {
            case 'forward':
                horizontal += amount;
                depth += aim * amount;
                break;
            case 'down':
                aim += amount;
                break;
            case 'up':
                aim -= amount;
                break;
        }
    });
    console.log(horizontal * depth);
}
const data = day2data_1.day2data.split('\n').map(line => {
    const [direction, amount] = line.split(' ');
    return [direction, parseInt(amount, 10)];
});
main1(data);
main2(data);
