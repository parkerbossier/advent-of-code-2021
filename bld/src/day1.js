"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const day1data_1 = require("./day1data");
function main1(data) {
    console.log(countIncreases(data));
}
function countIncreases(data) {
    let count = 0;
    for (let i = 1; i < data.length; i++) {
        const prev = data[i - 1];
        const cur = data[i];
        if (cur > prev)
            count++;
    }
    return count;
}
function main2(data) {
    const windowedData = [];
    for (let i = 0; i < data.length; i++) {
        let movingWindow = data[i];
        if (i + 1 < data.length)
            movingWindow += data[i + 1];
        if (i + 2 < data.length)
            movingWindow += data[i + 2];
        windowedData.push(movingWindow);
    }
    console.log(countIncreases(windowedData));
}
const data = day1data_1.day1data.split('\n').map(n => parseInt(n, 10));
main1(data);
main2(data);
