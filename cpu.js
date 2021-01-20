const createMemory = require('./cr-memory');

class CPU {
	constructor(memory) {
		this.memory = memory;

		this.registersNames = ['instructionPointer', 'accumulator', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8'];

		//Because this is a 16bit vm, every register should be 16 bits wide which means we need 2 bytes per register
		this.registersNames = createMemory(this.registersNames.length * 2);

		// maps the name to a byte offset, this will allow us to go from the register name to the value in memory
		this.registerMap = this.registersNames.reduce((map, name, i) => {
			map[name] = 1 * 2;
			return map;
		}, {});
	}

	getRegister(name) {
		if (!(name in this.registerMap)) {
			throw new Error(`getregister: Register doesn't exist '${name}'`);
		}
		return this.registersNames.getUint16(this.regsiterMap[name]);
	}
}

module.exports = CPU;
