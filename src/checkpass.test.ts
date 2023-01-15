import checkpass from "./checkpass";
import { describe, expect, test } from "vitest";

/* 
  Test whether invalid values are provided for the mandatory inputs
*/
describe("Invalid  values for required inputs", () => {
  test("Throw an error when minLength is less than 0", () => {
    const password = "somePassword";

    expect(() =>
      checkpass(password, {
        minLength: -1,
        minNumbers: 0,
        minCapitalLetters: 0,
        minSpecialCharacters: 0,
      })
    ).toThrowError("minLength cannot be less than 0!");
  });

  test("Throw an error when minNumbers is less than 0", () => {
    const password = "somePassword";

    expect(() =>
      checkpass(password, {
        minLength: 5,
        minNumbers: -1,
        minCapitalLetters: 0,
        minSpecialCharacters: 0,
      })
    ).toThrowError("minNumbers cannot be less than 0!");
  });

  test("Throw an error when minCapitalLetters is less than 0", () => {
    const password = "somePassword";

    expect(() =>
      checkpass(password, {
        minLength: 5,
        minNumbers: 2,
        minCapitalLetters: -2,
        minSpecialCharacters: 0,
      })
    ).toThrowError("minCapitalLetters cannot be less than 0!");
  });

  test("Throw an error when minCapitalLetters is less than 0", () => {
    const password = "somePassword";

    expect(() =>
      checkpass(password, {
        minLength: 5,
        minNumbers: 2,
        minCapitalLetters: 0,
        minSpecialCharacters: -1,
      })
    ).toThrowError("minSpecialCharacters cannot be less than 0!");
  });
});

/*
  Test whether invalid values are provided for optional inputs 
*/
describe("Invalid values for optional inputs", () => {
  test("Throw an error when maxLength is less than 0", () => {
    const password = "somePassword";

    expect(() =>
      checkpass(password, {
        minLength: 0,
        minNumbers: 0,
        minCapitalLetters: 0,
        minSpecialCharacters: 0,
        maxLength: -1,
      })
    ).toThrowError("maxLength cannot be less than 0!");
  });

  test("Throw an error when maxNumbers is less than 0", () => {
    const password = "somePassword";

    expect(() =>
      checkpass(password, {
        minLength: 0,
        minNumbers: 0,
        minCapitalLetters: 0,
        minSpecialCharacters: 0,
        maxNumbers: -1,
      })
    ).toThrowError("maxNumbers cannot be less than 0!");
  });

  test("Throw an error when maxCapitalLetters is less than 0", () => {
    const password = "somePassword";

    expect(() =>
      checkpass(password, {
        minLength: 0,
        minNumbers: 0,
        minCapitalLetters: 0,
        minSpecialCharacters: 0,
        maxCapitalLetters: -1,
      })
    ).toThrowError("maxCapitalLetters cannot be less than 0!");
  });

  test("Throw an error when maxSpecialCharacters is less than 0", () => {
    const password = "somePassword";

    expect(() =>
      checkpass(password, {
        minLength: 0,
        minNumbers: 0,
        minCapitalLetters: 0,
        minSpecialCharacters: 0,
        maxSpecialCharacters: -1,
      })
    ).toThrowError("maxSpecialCharacters cannot be less than 0!");
  });

  test("Throw an error when minUniqueCharacters is less than 0", () => {
    const password = "somePassword";

    expect(() =>
      checkpass(password, {
        minLength: 0,
        minNumbers: 0,
        minCapitalLetters: 0,
        minSpecialCharacters: 0,
        minUniqueCharacters: -1,
      })
    ).toThrowError("minUniqueCharacters cannot be less than 0!");
  });

  test("Throw an error when disallowCharacters value is incorrect", () => {
    const password = "somePassword";

    expect(() =>
      checkpass(password, {
        minLength: 0,
        minNumbers: 0,
        minCapitalLetters: 0,
        minSpecialCharacters: 0,
        disallowCharacters: ["Hello", "Hey"],
      })
    ).toThrowError("disallowCharacters must be list of characters");
  });
});

/*
  Test whether invalid minmax constraints are provided as input.
  Example: If the min value provided for any constraint is greater than the maxValue for the same constraint.
*/
