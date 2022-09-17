import checkpass from "./checkpass";

// TEST 1
// checkpass("Rahul123#", {
//   minLength: 6,
//   minCapitalLetters: 2,
//   minNumbers: 1,
//   minSpecialCharacters: 1,
// });

// // TEST 2
// checkpass("RaAbc!");

// // TEST 3
// checkpass.enforce("Rahul", {
//   minLength: 6,
//   minCapitalLetters: 2,
//   minNumbers: 1,
//   minSpecialCharacters: 1,
// });

// TEST 4
// RahulR123#Pass
checkpass.enforce("RahulR123#Pass!?<", {
  minLength: 6,
  minCapitalLetters: 2,
  maxCapitalLetters: 3,
  minNumbers: 1,
  minSpecialCharacters: 4,
  maxSpecialCharacters: 6,
  minUniqueCharacters: 4,
  disallowCharacters: ["$", "*"],
});
