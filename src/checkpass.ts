/* Checkpass is a micro-library for enforcing and verifying password constraints. */

type Constraints = {
  minLength: number;
  maxLength?: number;
  minCapitalLetters: number;
  maxCapitalLetters?: number;
  minNumbers: number;
  maxNumbers?: number;
  minSpecialCharacters: number;
  maxSpecialCharacters?: number;
  minUniqueCharacters?: number;
  disallowCharacters?: string[];
};

const defaultConstraints: Constraints = {
  minLength: 0,
  minCapitalLetters: 0,
  minNumbers: 0,
  minSpecialCharacters: 0,
};

class Checkpass {
  #checkMinMax(minValue: number, maxValue: number | undefined) {
    /* The min value of a constraint cannot be greater than the max value and vice versa */
    if (!maxValue) return 1;
    return maxValue - minValue;
  }

  #checkGeneralSanity(
    maxLength: number | undefined,
    minCapitalLetters: number,
    minNumbers: number,
    minSpecialCharacters: number,
    minUniqueCharacters: number | undefined
  ) {
    /* The min requirements for capitals, numbers, special characters or unique characters cannot be greater than the max length if specified */
    if (!maxLength) return "OK";

    if (maxLength < minCapitalLetters) return "";

    if (maxLength < minNumbers) return "";

    if (maxLength < minSpecialCharacters) return "";

    if (minUniqueCharacters && maxLength < minUniqueCharacters) return "";

    if (
      maxLength <
      minCapitalLetters +
        minNumbers +
        minSpecialCharacters +
        (minUniqueCharacters || 0)
    )
      return "";

    return "OK";
  }

  #checklength(
    password: string,
    minLength: number,
    maxLength: number | undefined
  ) {
    if (this.#checkMinMax(minLength, maxLength) < 0) {
      return "The min value of the length constraint cannot exceed the max value";
    }

    if (password.length < minLength) return "too small";

    if (maxLength && password.length > maxLength)
      return `Max ${maxLength} characters are allowed`;

    return "OK";
  }

  #checkCapitalLetters(
    password: string,
    minCapitalLetters: number,
    maxCapitalLetters: number | undefined
  ) {
    if (this.#checkMinMax(minCapitalLetters, maxCapitalLetters) < 0) {
      return "The min value of the capital letters constraint cannot exceed the max value";
    }

    const checkCapsMin = `^(.*?[A-Z]){${minCapitalLetters},}.*$`;
    const capsRegex = new RegExp(checkCapsMin);

    if (maxCapitalLetters) {
      const checkCapsMax = `^(.*?[A-Z]){${maxCapitalLetters + 1}}.*$`;
      const capsRegexMax = new RegExp(checkCapsMax);
      if (capsRegexMax.test(password))
        return `Maximum ${maxCapitalLetters} capital letters are allowed`;
    }

    if (!capsRegex.test(password))
      return `Minimum ${minCapitalLetters} capital letters are required`;

    return "OK";
  }

  #checkNumericCharacters(
    password: string,
    minNumbers: number,
    maxNumbers: number | undefined
  ) {
    if (this.#checkMinMax(minNumbers, maxNumbers) < 0) {
      return "The min value of the numeric character constraints cannot exceed the max value";
    }

    const checkNumsMin = `^(.*?[0-9]){${minNumbers},}.*$`;
    const numsRegex = new RegExp(checkNumsMin);

    if (maxNumbers) {
      const checkNumsMax = `^(.*?[0-9]){${maxNumbers + 1}}.*$`;
      const numsRegexMax = new RegExp(checkNumsMax);
      if (numsRegexMax.test(password))
        return `Maximum ${maxNumbers} numeric characters are allowed`;
    }

    if (!numsRegex.test(password))
      return `Minimum ${minNumbers} numeric characters are required`;

    return "OK";
  }

  #checkSpecialCharacters(
    password: string,
    minSpecialCharacters: number,
    maxSpecialCharacters: number | undefined
  ) {
    if (this.#checkMinMax(minSpecialCharacters, maxSpecialCharacters) < 0) {
      return "The min value of the special character constraints cannot exceed the max value";
    }

    const checkSpecialMin = `^(.*?[ -\/:-@\[-\`{-~]){${minSpecialCharacters},}.*$`;
    const specialsRegex = new RegExp(checkSpecialMin);

    if (maxSpecialCharacters) {
      const checkSpecialMax = `^(.*?[ -\/:-@\[-\`{-~]){${
        maxSpecialCharacters + 1
      }}.*$`;
      const specialsRegexMax = new RegExp(checkSpecialMax);
      if (specialsRegexMax.test(password))
        return `Maximum ${maxSpecialCharacters} special characters are allowed`;
    }

    if (!specialsRegex.test(password))
      return `Minimum ${minSpecialCharacters} special characters are required`;

    return "OK";
  }

  #checkDisallowedCharacters(
    password: string,
    disallowCharacters: string[] | undefined
  ) {
    if (!disallowCharacters) return "OK";

    if (disallowCharacters.some((character) => character.length !== 1))
      throw new Error("Specify valid characters to be disallowed");

    const passwordCharacters = [...password];
    if (
      passwordCharacters.some((character) =>
        disallowCharacters.includes(character)
      )
    )
      return `${[
        disallowCharacters,
      ]} characters cannot be used for your password`;

    return "OK";
  }

  #checkUniqueCharacters(
    password: string,
    maxLength: number | undefined,
    minUniqueCharacters: number | undefined
  ) {
    if (!minUniqueCharacters) return;

    if (maxLength && minUniqueCharacters > maxLength)
      throw new Error(
        "Required unique characters cannot be more than the maximum allowed length"
      );

    const uniqueCharacters = new Set([...password]);

    if (uniqueCharacters.size < minUniqueCharacters)
      return `Minimum ${minUniqueCharacters} unique characters are required`;

    return "OK";
  }

  enforce(password: string, constraints: Constraints = defaultConstraints) {
    console.log("Password: ", password);

    const {
      minLength,
      maxLength,
      minNumbers,
      maxNumbers,
      minCapitalLetters,
      maxCapitalLetters,
      minSpecialCharacters,
      maxSpecialCharacters,
      minUniqueCharacters,
      disallowCharacters,
    } = constraints;

    /* Perform general sanity based on the constraints specified */
    const generalSanityCheck = this.#checkGeneralSanity(
      maxLength,
      minCapitalLetters,
      minNumbers,
      minSpecialCharacters,
      minUniqueCharacters
    );
    console.log("General Sanity: ", generalSanityCheck);
    if (generalSanityCheck !== "OK") return;

    /* Check the length constraints */
    const lengthConstraints = this.#checklength(password, minLength, maxLength);

    console.log("Verify Length: ", lengthConstraints);
    if (lengthConstraints !== "OK") return;

    /* Check capital letters constraints */
    const capitalLettersConstraints = this.#checkCapitalLetters(
      password,
      minCapitalLetters,
      maxCapitalLetters
    );
    console.log("Verify Capital Letters: ", capitalLettersConstraints);
    if (capitalLettersConstraints !== "OK") return;

    /* Check numeric character constraints */
    const numericCharacterConstraints = this.#checkNumericCharacters(
      password,
      minNumbers,
      maxNumbers
    );
    console.log("Verify Numeric characters: ", numericCharacterConstraints);
    if (numericCharacterConstraints !== "OK") return;

    /* Check unique character constraints */
    const uniqueCharacterConstraints = this.#checkUniqueCharacters(
      password,
      maxLength,
      minUniqueCharacters
    );
    console.log("Verify Unique Characters: ", uniqueCharacterConstraints);
    if (uniqueCharacterConstraints !== "OK") return;

    /* Check disallowed character constraints if any */
    const disallowedCharacterConstraints = this.#checkDisallowedCharacters(
      password,
      disallowCharacters
    );
    console.log(
      "Verify Disallowed Characters: ",
      disallowedCharacterConstraints
    );
    if (disallowedCharacterConstraints !== "OK") return;

    /* Check special character constraints */
    const specialCharacterConstraints = this.#checkSpecialCharacters(
      password,
      minSpecialCharacters,
      maxSpecialCharacters
    );
    console.log("Verify Special Characters: ", specialCharacterConstraints);
    if (specialCharacterConstraints !== "OK") return;
  }
}

export default new Checkpass().enforce.bind(new Checkpass());
