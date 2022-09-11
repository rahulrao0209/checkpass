import checkpass from "./checkpass";

// TEST 1
// checkpass.enforce("Rahul123#", {
//   minLength: 6,
//   minCapitalLetters: 2,
//   minNumbers: 1,
//   minSpecialCharacters: 1,
// });

// // TEST 2
// checkpass.enforce("RaAbc!");

// // TEST 3
// checkpass.enforce("Rahul", {
//   minLength: 6,
//   minCapitalLetters: 2,
//   minNumbers: 1,
//   minSpecialCharacters: 1,
// });

// TEST 4
checkpass.enforce("RahulRao", {
  minLength: 6,
  minCapitalLetters: 2,
  maxCapitalLetters: 3,
  minNumbers: 1,
  minSpecialCharacters: 1,
});
