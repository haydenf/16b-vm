const createMemory = require('./cr-memory');
const instructions = require('./instruction');

class CPU {
	constructor(memory) {
		this.memory = memory;

		this.registerNames = ['ip', 'acc', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8'];

		//Because this is a 16bit vm, every register should be 16 bits wide which means we need 2 bytes per register
		this.registers = createMemory(this.registerNames.length * 2);

		// maps the name to a byte offset, this will allow us to go from the register name to the value in memory
		this.registerMap = this.registerNames.reduce((map, name, i) => {
			map[name] = i * 2;
			return map;
		}, {});
	}

	debug() {
		this.registerNames.forEach((name) => {
			//looping through register names, printing out name and value in hexDec.
			console.log(`${name}: 0x${this.getRegister(name).toString(16).padStart(4, '0')}`);
		});
		console.log();
	}

	getRegister(name) {
		if (!(name in this.registerMap)) {
			throw new Error(`getRegister: Register doesn't exist ${name}`);
		}
		return this.registers.getUint16(this.registerMap[name]);
	}

	setRegister(name, value) {
		if (!(name in this.registerMap)) {
			throw new Error(`getRegister: Register doesn't exist ${name}`);
		}
		return this.registers.getUint16(this.registerMap[name], value);
	}

	fetch() {
		const nextInstructionAddress = this.getRegister('ip');
		const instruction = this.memory.getUint8(nextInstructionAddress);
		this.setRegister('ip', nextInstructionAddress + 1);
		return instruction;
		// everytime we call fetch, we get the instruction and move the IP by one byte
	}

	fetch16() {
		const nextInstructionAddress = this.getRegister('ip');
		const instruction = this.memory.getUint16(nextInstructionAddress);
		this.setRegister('ip', nextInstructionAddress + 2);
		return instruction;
		// this is for 16 bit values, every fetch call we get the instruction and move the IP by two bytes
	}

	execute(instruction) {
		switch (instruction) {
			// move literal value into the r1 register
			case instructions.MOVE_LIT_R1: {
				const literal = this.fetch16();
				this.setRegister('r1', literal);
				return;
			}
			case instructions.MOVE_LIT_R2: {
				const literal = this.fetch16();
				this.setRegister('r2', literal);
				return;
			}
			case instructions.ADD_REG_REG: {
				const r1 = this.fetch();
				const r2 = this.fetch();
				const registerValue1 = this.registers.getUint16(r1 * 2);
				const registerValue2 = this.registers.getUint16(r2 * 2);
				this.setRegister('acc', registerValue1 + registerValue2);
				return;
			}
		}
	}

	step() {
		const instruction = this.fetch();
		return this.execute(instruction);
	}
}

module.exports = CPU;
