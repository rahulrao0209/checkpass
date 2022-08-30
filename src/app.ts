import Checkpass from "./checkpass";

Checkpass.enforce("Rahul123#", {
  minLength: 6,
  minCapitalLetters: 2,
  minNumbers: 1,
  minSpecialCharacters: 1,
});

Checkpass.enforce("RaAbc!");
