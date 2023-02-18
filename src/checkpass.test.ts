import checkpass from "./checkpass";
import { describe, expect, test } from "vitest";

/* 
  Test whether invalid values are provided for the mandatory inputs
*/
describe("Invalid values for required inputs", () => {
  const password = "somePassword";

  test("Throw an error when minLength is less than 0", () => {
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
  const password = "somePassword";

  test("Throw an error when maxLength is less than 0", () => {
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
describe("Invalid minmax constraints", () => {
  const password = "somePassword";

  /* 
    Test the value of maxLength if specified against other all other required constraints
  */
  test("Throw an error if the specified maxLength constraint is less than the minLength constraint", () => {
    expect(() =>
      checkpass(password, {
        minLength: 5,
        maxLength: 3,
        minNumbers: 0,
        minCapitalLetters: 0,
        minSpecialCharacters: 0,
      })
    ).toThrowError(
      "The max-length cannot be less than the required min-length"
    );
  });

  test("Throw an error if the specified maxLength constraint is less than the minCapitalLetters constraint", () => {
    expect(() =>
      checkpass(password, {
        minLength: 5,
        maxLength: 5,
        minNumbers: 0,
        minCapitalLetters: 6,
        minSpecialCharacters: 0,
      })
    ).toThrowError(
      "The max-length cannot be less than min required capital letters"
    );
  });

  test("Throw an error if the specified maxLength constraint is less than the minNumbers constraint", () => {
    expect(() =>
      checkpass(password, {
        minLength: 5,
        maxLength: 5,
        minNumbers: 6,
        minCapitalLetters: 2,
        minSpecialCharacters: 0,
      })
    ).toThrowError("The max-length cannot be less than min required numbers");
  });

  test("Throw an error if the specified maxLength constraint is less than the minSpecialCharacters constraint", () => {
    expect(() =>
      checkpass(password, {
        minLength: 5,
        maxLength: 5,
        minNumbers: 0,
        minCapitalLetters: 2,
        minSpecialCharacters: 6,
      })
    ).toThrowError(
      "The max-length cannot be less than the min required special characters"
    );
  });

  test("Throw an error if the specified maxLength constraint is less than the minUniqueCharacters constraint", () => {
    expect(() =>
      checkpass(password, {
        minLength: 5,
        maxLength: 5,
        minNumbers: 0,
        minCapitalLetters: 0,
        minSpecialCharacters: 0,
        minUniqueCharacters: 6,
      })
    ).toThrowError(
      "The max-length cannot be less than the min required unique characters"
    );
  });

  test("Throw an error if the specified maxLength constraint is less than the sum of capital letters, numbers and special and unique character constraints", () => {
    expect(() =>
      checkpass(password, {
        minLength: 5,
        maxLength: 5,
        minNumbers: 2,
        minCapitalLetters: 2,
        minSpecialCharacters: 4,
      })
    ).toThrowError(
      "The max-length cannot be less than the sum of min required capital letters, numbers and special and unique characters"
    );
  });

  /* 
    Test the min-max values of the eligible constraint pairs (Example: minNumbers/maxNumbers pair)
  */
  test("Throw an error if the maxCapitalLetters constraint is specified and is less than the minCapitalLetters constraint", () => {
    expect(() =>
      checkpass(password, {
        minLength: 5,
        minNumbers: 0,
        minCapitalLetters: 3,
        maxCapitalLetters: 2,
        minSpecialCharacters: 0,
      })
    ).toThrowError(
      "The min value of the capital letters constraint cannot exceed the max value"
    );
  });

  test("Throw an error if the maxNumbers constraint is specified and is less than the minNumbers constraint", () => {
    expect(() =>
      checkpass(password, {
        minLength: 5,
        minNumbers: 3,
        maxNumbers: 2,
        minCapitalLetters: 0,
        minSpecialCharacters: 0,
      })
    ).toThrowError(
      "The min value of the numeric character constraints cannot exceed the max value"
    );
  });

  test("Throw an error if the maxSpecialCharacters constraint is specified and is less than the minSpecialCharacters constraint", () => {
    expect(() =>
      checkpass(password, {
        minLength: 5,
        minNumbers: 0,
        minCapitalLetters: 0,
        minSpecialCharacters: 2,
        maxSpecialCharacters: 1,
      })
    ).toThrowError(
      "The min value of the special character constraints cannot exceed the max value"
    );
  });
});

/* 
  If no invalid or incorrect constraints are provided, test the user entered password against the provided constraints.
*/
describe("Test the user entered password against the constraints provided", () => {
  let errors;
  test("There should be no spaces in the password", () => {
    errors = checkpass("Test Pass123", {
      minLength: 0,
      minNumbers: 0,
      minCapitalLetters: 0,
      minSpecialCharacters: 0,
    });

    expect(errors.disallowSpaces.value).toBe(true);
    expect(errors.disallowSpaces.message).toBe("Space is not allowed");
  });

  test("Test if minLength of password fails the check", () => {
    errors = checkpass("TestPass", {
      minLength: 10,
      minNumbers: 0,
      minCapitalLetters: 0,
      minSpecialCharacters: 0,
    });

    expect(errors.minLength.value).toBe(true);
    expect(errors.minLength.message).toBe("Min 10 characters are required");
  });

  test("Test if maxLength of password fails the check", () => {
    errors = checkpass("TestPass", {
      minLength: 5,
      maxLength: 6,
      minNumbers: 0,
      minCapitalLetters: 0,
      minSpecialCharacters: 0,
    });

    expect(errors.maxLength.value).toBe(true);
    expect(errors.maxLength.message).toBe("Max 6 characters are allowed");
  });

  test("Test if minCapitalLetters constraint fails the check", () => {
    errors = checkpass("TestPass", {
      minLength: 0,
      minNumbers: 0,
      minCapitalLetters: 3,
      minSpecialCharacters: 0,
    });

    expect(errors.minCapitalLetters.value).toBe(true);
    expect(errors.minCapitalLetters.message).toBe(
      "Min 3 capital letters are required"
    );
  });

  test("Test if maxCapitalLetters constraint fails the check", () => {
    errors = checkpass("TestPASS", {
      minLength: 0,
      minNumbers: 0,
      minCapitalLetters: 0,
      maxCapitalLetters: 2,
      minSpecialCharacters: 0,
    });

    expect(errors.maxCapitalLetters.value).toBe(true);
    expect(errors.maxCapitalLetters.message).toBe(
      "Max 2 capital letters are allowed"
    );
  });

  test("Test if minNumbers constraint fails the check", () => {
    errors = checkpass("TestPass", {
      minLength: 0,
      minNumbers: 2,
      minCapitalLetters: 0,
      minSpecialCharacters: 0,
    });

    expect(errors.minNumbers.value).toBe(true);
    expect(errors.minNumbers.message).toBe(
      "Min 2 numeric characters are required"
    );
  });

  test("Test if maxNumbers constraint fails the check", () => {
    errors = checkpass("TestPass123", {
      minLength: 0,
      minNumbers: 0,
      maxNumbers: 2,
      minCapitalLetters: 0,
      minSpecialCharacters: 0,
    });

    expect(errors.maxNumbers.value).toBe(true);
    expect(errors.maxNumbers.message).toBe(
      "Max 2 numeric characters are allowed"
    );
  });

  test("Test if minSpecialCharacters constraint fails the check", () => {
    errors = checkpass("TestPass", {
      minLength: 0,
      minNumbers: 0,
      minCapitalLetters: 0,
      minSpecialCharacters: 2,
    });

    expect(errors.minSpecialCharacters.value).toBe(true);
    expect(errors.minSpecialCharacters.message).toBe(
      "Min 2 special characters are required"
    );
  });

  test("Test if maxSpecialCharacters constraint fails the check", () => {
    errors = checkpass("TestPass#@!", {
      minLength: 0,
      minNumbers: 0,
      minCapitalLetters: 0,
      minSpecialCharacters: 0,
      maxSpecialCharacters: 2,
    });

    expect(errors.maxSpecialCharacters.value).toBe(true);
    expect(errors.maxSpecialCharacters.message).toBe(
      "Max 2 special characters are allowed"
    );
  });

  test("Test if minUniqueCharacters constraint fails the check", () => {
    errors = checkpass("TestTest", {
      minLength: 0,
      minNumbers: 0,
      minCapitalLetters: 0,
      minSpecialCharacters: 0,
      minUniqueCharacters: 5,
    });

    expect(errors.minUniqueCharacters.value).toBe(true);
    expect(errors.minUniqueCharacters.message).toBe(
      "Min 5 unique characters are required"
    );
  });

  test("Test if disallowCharacters constraint fails the check", () => {
    errors = checkpass("Test123@!", {
      minLength: 0,
      minNumbers: 0,
      minCapitalLetters: 0,
      minSpecialCharacters: 0,
      disallowCharacters: ["@", "#"],
    });

    expect(errors.disallowCharacters.value).toBe(true);
    expect(errors.disallowCharacters.message).toBe(
      "@,# characters cannot be used for your password"
    );
  });

  test("Test if password fullfills all constraints", () => {
    errors = checkpass("TestPass123@!", {
      minLength: 5,
      maxLength: 15,
      minNumbers: 2,
      maxNumbers: 4,
      minCapitalLetters: 2,
      minSpecialCharacters: 2,
      minUniqueCharacters: 6,
      disallowCharacters: [",", "(", ")"],
    });

    expect(errors.minLength.value).toBe(false);
    expect(errors.maxLength.value).toBe(false);
    expect(errors.minNumbers.value).toBe(false);
    expect(errors.maxNumbers.value).toBe(false);
    expect(errors.minCapitalLetters.value).toBe(false);
    expect(errors.minSpecialCharacters.value).toBe(false);
    expect(errors.minUniqueCharacters.value).toBe(false);
    expect(errors.disallowCharacters.value).toBe(false);
    expect(errors.disallowSpaces.value).toBe(false);
  });
});
