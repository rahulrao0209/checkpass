import checkpass from "./checkpass";

/*
  Test cases
  - RahulR123#Pass
  - Rahul
  - RaAbc!
  - Rahul123#
  - RahulR123#Pass!?<
*/

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
