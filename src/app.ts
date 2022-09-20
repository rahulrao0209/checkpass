import checkpass from "./checkpass";

/*
  Test cases
  - RahulR123#Pass
  - Rahul
  - RaAbc!
  - Rahul123#
  - RahulR123#Pass!?<
*/

const test: string = checkpass("RahulR02#Pass!?<", {
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

if (test === "OK") {
  console.log("All checks passed");
} else {
  console.log(test);
}
