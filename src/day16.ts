import { isNumber } from 'lodash';
import _ = require('lodash');
import { day16data } from './day16data';

interface Packet {
	literalValue?: number;
	subpackets?: Packet[];
	typeId: number;
	version: number;
}

function main1and2(bits: string) {
	const { packet } = parsePacket(bits);

	let versionSum = 0;
	function crawl(p: Packet) {
		versionSum += p.version;
		p.subpackets?.forEach(crawl);
	}
	crawl(packet);

	console.log(versionSum);

	const result = evaluate(packet);
	console.log(result);
}

function parsePacket(message: string) {
	let i = 0;

	const version = parseInt(message.slice(i, i + 3), 2);
	i += 3;
	const typeId = parseInt(message.slice(i, i + 3), 2);
	i += 3;

	const packet: Packet = {
		typeId,
		version
	};

	switch (typeId) {
		case 4: {
			let l = i;
			let fullValue = '';
			while (true) {
				const chunk = message.slice(l, l + 5);
				l += 5;

				fullValue += chunk.slice(1);

				const firstBit = chunk[0];
				if (firstBit === '0')
					break;
			}
			i = l;

			// account for trailing 0s caused by hex
			//if (i % 4)

			packet.literalValue = parseInt(fullValue, 2);
			break;
		}

		default: {
			packet.subpackets = [];

			const lengthTypeId = message[i];
			i++;

			if (lengthTypeId === '0') {
				const subpacketsLength = parseInt(message.slice(i, i + 15), 2);
				i += 15;

				const lastIndexOfPackets = i + subpacketsLength - 1;
				while (i <= lastIndexOfPackets) {
					const result = parsePacket(message.slice(i));
					packet.subpackets.push(result.packet);
					i += result.length;
				}
			}
			else {
				const subpacketsCount = parseInt(message.slice(i, i + 11), 2);
				i += 11;

				let s = subpacketsCount;
				while (s > 0) {
					const result = parsePacket(message.slice(i));
					packet.subpackets.push(result.packet);
					i += result.length;
					s--;
				}
			}

			break;
		}
	}

	return {
		length: i,
		packet
	};
}

function evaluate(p: Packet) {
	if (isNumber(p.literalValue))
		return p.literalValue;

	let result = 0;
	switch (p.typeId) {
		case 0:
			result = p.subpackets!.reduce(
				(prev, c) => prev + evaluate(c),
				0
			);
			break;
		case 1:
			result = p.subpackets!.reduce(
				(prev, c) => prev * evaluate(c),
				1
			);
			break;
		case 2:
			result = Math.min(...p.subpackets!.map(evaluate));
			break;
		case 3:
			result = Math.max(...p.subpackets!.map(evaluate));
			break;
		case 5:
			result = (evaluate(p.subpackets![0]) > evaluate(p.subpackets![1])) ? 1 : 0;
			break;
		case 6:
			result = (evaluate(p.subpackets![0]) < evaluate(p.subpackets![1])) ? 1 : 0;
			break;
		case 7:
			result = (evaluate(p.subpackets![0]) === evaluate(p.subpackets![1])) ? 1 : 0;
			break;
	}

	return result;
}

const bits = day16data
	.split('')
	.map(hex =>
		parseInt(hex, 16).toString(2).padStart(4, '0')
	)
	.join('');

main1and2(bits);
