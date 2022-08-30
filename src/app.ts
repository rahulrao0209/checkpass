import checkpass from "./checkpass";

checkpass.enforce("Rahul123#", {
  minLength: 6,
  minCapitalLetters: 2,
  minNumbers: 1,
  minSpecialCharacters: 1,
});

checkpass.enforce("RaAbc!");
