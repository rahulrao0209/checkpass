import checkpass from "./checkpass";

/*
  Test cases
  - RahulR123#Pass
  - Rahul
  - RaAbc!
  - Rahul123#
  - RahulR123#Pass!?<
*/

checkpass("RahulR02#Pass!?<", {
  minLength: 6,
  minCapitalLetters: 2,
  maxCapitalLetters: 3,
  minNumbers: 2,
  maxNumbers: 5,
  minSpecialCharacters: 2,
  maxSpecialCharacters: 6,
  minUniqueCharacters: 4,
  disallowCharacters: ["$", "*"],
});
