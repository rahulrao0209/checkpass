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

  #checkNoSpace(password: string) {
    if (password.includes(" ")) return "Space is not allowed";
    return "OK";
  }

  #sanitizeUserInputs(constraints: Constraints) {
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

    /* Check the required values */
    if (+minLength < 0)
      throw new Error("minLength should be a positive numeric value!");

    if (+minNumbers < 0)
      throw new Error("minNumbers should be a positive numeric value!");

    if (+minCapitalLetters < 0)
      throw new Error("minCapitalLetters should be positive numeric value!");

    if (+minSpecialCharacters < 0)
      throw new Error("minSpecialCharacters should be positive numeric value!");

    /* Check the optional values if specified */
    if (maxLength && +maxLength < 0)
      throw new Error("maxLength should be a positive numeric value!");

    if (maxNumbers && +maxNumbers < 0)
      throw new Error("maxNumbers should be a positive numeric value!");

    if (maxCapitalLetters && +maxCapitalLetters < 0)
      throw new Error("maxCapitalLetters should be a positive numeric value!");

    if (maxSpecialCharacters && +maxSpecialCharacters < 0)
      throw new Error(
        "maxSpecialCharacters should be a positive numeric value!"
      );

    if (minUniqueCharacters && +minUniqueCharacters < 0)
      throw new Error(
        "minUniqueCharacters should be a positive numeric value!"
      );

    if (disallowCharacters && disallowCharacters?.length > 0) {
      disallowCharacters.some((character) => {
        if (typeof character !== "string" || character.length > 1)
          throw new Error("disallowCharacters must be list of characters");
      });
    }

    return "OK";
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

    if (maxLength < minCapitalLetters)
      throw new Error(
        "The max-length cannot be less than min required capital letters"
      );

    if (maxLength < minNumbers)
      throw new Error(
        "The max-length cannot be less than min required numbers"
      );

    if (maxLength < minSpecialCharacters)
      throw new Error(
        "The max-length cannot be less than the min required special characters"
      );

    if (minUniqueCharacters && maxLength < minUniqueCharacters)
      throw new Error(
        "The max-length cannot be less than the min required unique characters"
      );

    if (
      maxLength <
      minCapitalLetters +
        minNumbers +
        minSpecialCharacters +
        (minUniqueCharacters || 0)
    )
      throw new Error(
        "The max-length cannot be less than the sum of min required capital letters, numbers, special and unique characters"
      );

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
    if (!minUniqueCharacters) return "OK";

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
    /* Throw errors for erroneous user inputs */
    this.#sanitizeUserInputs(constraints);

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
    if (generalSanityCheck !== "OK") return generalSanityCheck;

    /* Trim the string to remove any spaces at the start or end */
    const _password: string = password.trim();

    /* Check no space */
    const spacingConstraints = this.#checkNoSpace(_password);
    if (spacingConstraints !== "OK") return spacingConstraints;

    /* Check the length constraints */
    const lengthConstraints = this.#checklength(
      _password,
      minLength,
      maxLength
    );
    if (lengthConstraints !== "OK") return lengthConstraints;

    /* Check capital letters constraints */
    const capitalLettersConstraints = this.#checkCapitalLetters(
      _password,
      minCapitalLetters,
      maxCapitalLetters
    );
    if (capitalLettersConstraints !== "OK") return capitalLettersConstraints;

    /* Check numeric character constraints */
    const numericCharacterConstraints = this.#checkNumericCharacters(
      _password,
      minNumbers,
      maxNumbers
    );
    if (numericCharacterConstraints !== "OK")
      return numericCharacterConstraints;

    /* Check unique character constraints */
    const uniqueCharacterConstraints = this.#checkUniqueCharacters(
      _password,
      maxLength,
      minUniqueCharacters
    );
    if (uniqueCharacterConstraints !== "OK") return uniqueCharacterConstraints;

    /* Check disallowed character constraints if any */
    const disallowedCharacterConstraints = this.#checkDisallowedCharacters(
      _password,
      disallowCharacters
    );
    if (disallowedCharacterConstraints !== "OK")
      return disallowedCharacterConstraints;

    /* Check special character constraints */
    const specialCharacterConstraints = this.#checkSpecialCharacters(
      _password,
      minSpecialCharacters,
      maxSpecialCharacters
    );
    if (specialCharacterConstraints !== "OK")
      return specialCharacterConstraints;

    /* All checks passed */
    return "OK";
  }
}

export default new Checkpass().enforce.bind(new Checkpass());
