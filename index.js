const createMemory = require('./cr-memory');
const CPU = require('./cpu');
const instructions = require('./instruction');

//creating memory with 256 bytes
const memory = createMemory(256);
const writeableBytes = new Uint8Array(memory.buffer);

const cpu = new CPU(memory);

writeableBytes[0] = instructions.MOVE_LIT_R1;
writeableBytes[1] = 0x12;
writeableBytes[2] = 0x34;

//0x1234

writeableBytes[3] = instructions.MOVE_LIT_R2;
writeableBytes[4] = 0xab;
writeableBytes[5] = 0xcd;

//0xABCD

writeableBytes[6] = instructions.ADD_REG_REG;
writeableBytes[7] = 2; // r1 index
writeableBytes[8] = 3; // r2 index

cpu.debug();

cpu.step();
cpu.debug();
cpu.step();
cpu.debug();
cpu.step();
cpu.debug();
