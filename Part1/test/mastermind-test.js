//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected
const chai = require("chai");
const path = require("path");

const ethers = require("ethers");

const wasm_tester = require("circom_tester").wasm;

const buildPoseidon = require("circomlibjs").buildPoseidon;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617"
);
const Fr = new F1Field(exports.p);

const assert = chai.assert;

describe("Super Mastermind test", function () {
  this.timeout(100000000);
  it("validates correct guess", async () => {
    const circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
    await circuit.loadConstraints();


    // NOTE: THIS DOESN'T COMPUTE THE SAME OUTPUT AS POSEIDON FROM CIRCOM DESPITE THE INPUTS BEING THE SAME
    // let poseidon = await buildPoseidon();
    // const input = [bufToBn(salt),"5","4","3","2","1",];
    // console.log(BigInt(poseidon.F.toString(input)));
    // 9217631854407878596287361116446201812448514888741014148792743288187283888884

    const INPUT = {
      pubGuessA: "5",
      pubGuessB: "4",
      pubGuessC: "3",
      pubGuessD: "2",
      pubGuessE: "1",

      pubNumHit: "5",
      pubNumBlow: "0",
      pubSolnHash: "15205191110637363744810499938453135529666887789796835345951558480184934827613",

      privSalt: "11235",
      privSolnA: "5",
      privSolnB: "4",
      privSolnC: "3",
      privSolnD: "2",
      privSolnE: "1",
    }

    const witness = await circuit.calculateWitness(INPUT, true);

    assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
    assert(Fr.eq(Fr.e(witness[1]), Fr.e(INPUT.pubSolnHash)));
  });
});
