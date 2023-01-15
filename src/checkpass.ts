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
  /* The min value of a constraint cannot be greater than the max value and vice versa */
  #checkMinMax(minValue: number, maxValue: number | undefined) {
    if (!maxValue) return 1;
    return maxValue - minValue;
  }

  #checkNoSpace(password: string) {
    if (password.includes(" ")) return "Space is not allowed";
    return "OK";
  }

  #checkInvalidInputs(constraints: Constraints) {
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
    if (+minLength < 0) throw new Error("minLength cannot be less than 0!");

    if (+minNumbers < 0) throw new Error("minNumbers cannot be less than 0!");

    if (+minCapitalLetters < 0)
      throw new Error("minCapitalLetters cannot be less than 0!!");

    if (+minSpecialCharacters < 0)
      throw new Error("minSpecialCharacters cannot be less than 0!!");

    /* Check the optional values if specified */
    if (maxLength && +maxLength < 0)
      throw new Error("maxLength cannot be less than 0!");

    if (maxNumbers && +maxNumbers < 0)
      throw new Error("maxNumbers cannot be less than 0!");

    if (maxCapitalLetters && +maxCapitalLetters < 0)
      throw new Error("maxCapitalLetters cannot be less than 0!");

    if (maxSpecialCharacters && +maxSpecialCharacters < 0)
      throw new Error("maxSpecialCharacters cannot be less than 0!");

    if (minUniqueCharacters && +minUniqueCharacters < 0)
      throw new Error("minUniqueCharacters cannot be less than 0!");

    if (disallowCharacters && disallowCharacters?.length > 0) {
      disallowCharacters.some((character) => {
        if (typeof character !== "string" || character.length > 1)
          throw new Error("disallowCharacters must be list of characters");
      });
    }

    return "OK";
  }

  /* The min requirements for capitals, numbers, special characters or unique characters cannot be greater than the max length if specified */
  #checkMinMaxConstraints(
    minLength: number,
    maxLength: number | undefined,
    minCapitalLetters: number,
    maxCapitalLetters: number | undefined,
    minNumbers: number,
    maxNumbers: number | undefined,
    minSpecialCharacters: number,
    maxSpecialCharacters: number | undefined,
    minUniqueCharacters: number | undefined
  ) {
    /* Check whether the max-length if specified is not less than any of the other specified min required constraint values */
    if (this.#checkMinMax(minLength, maxLength) < 0)
      throw new Error(
        "The max-length cannot be less than the required min-length"
      );

    if (this.#checkMinMax(minCapitalLetters, maxLength) < 0)
      throw new Error(
        "The max-length cannot be less than min required capital letters"
      );

    if (this.#checkMinMax(minNumbers, maxLength) < 0)
      throw new Error(
        "The max-length cannot be less than min required numbers"
      );

    if (this.#checkMinMax(minSpecialCharacters, maxLength) < 0)
      throw new Error(
        "The max-length cannot be less than the min required special characters"
      );

    if (
      minUniqueCharacters &&
      this.#checkMinMax(minUniqueCharacters, maxLength) < 0
    )
      throw new Error(
        "The max-length cannot be less than the min required unique characters"
      );

    if (
      this.#checkMinMax(
        minCapitalLetters +
          minNumbers +
          minSpecialCharacters +
          (minUniqueCharacters || 0),
        maxLength
      ) < 0
    )
      throw new Error(
        "The max-length cannot be less than the sum of min required capital letters, numbers and special and unique characters"
      );

    /* Check the min-max values of the eligible constraint pairs */
    if (this.#checkMinMax(minLength, maxLength) < 0)
      throw new Error(
        "The min value of the length constraint cannot exceed the max value"
      );

    if (this.#checkMinMax(minCapitalLetters, maxCapitalLetters) < 0)
      throw new Error(
        "The min value of the capital letters constraint cannot exceed the max value"
      );

    if (this.#checkMinMax(minNumbers, maxNumbers) < 0)
      throw new Error(
        "The min value of the numeric character constraints cannot exceed the max value"
      );

    if (this.#checkMinMax(minSpecialCharacters, maxSpecialCharacters) < 0)
      throw new Error(
        "The min value of the special character constraints cannot exceed the max value"
      );

    return "OK";
  }

  #checklength(
    password: string,
    minLength: number,
    maxLength: number | undefined
  ) {
    if (password.length < minLength)
      return `Min ${minLength} characters are required`;

    if (maxLength && password.length > maxLength)
      return `Max ${maxLength} characters are allowed`;

    return "OK";
  }

  #checkCapitalLetters(
    password: string,
    minCapitalLetters: number,
    maxCapitalLetters: number | undefined
  ) {
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
    minUniqueCharacters: number | undefined
  ) {
    if (!minUniqueCharacters) return "OK";

    const uniqueCharacters = new Set([...password]);

    if (uniqueCharacters.size < minUniqueCharacters)
      return `Minimum ${minUniqueCharacters} unique characters are required`;

    return "OK";
  }

  enforce(password: string, constraints: Constraints = defaultConstraints) {
    /* Throw errors for erroneous user inputs such as negative numbers */
    this.#checkInvalidInputs(constraints);

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
    const generalSanityCheck = this.#checkMinMaxConstraints(
      minLength,
      maxLength,
      minCapitalLetters,
      maxCapitalLetters,
      minNumbers,
      maxNumbers,
      minSpecialCharacters,
      maxSpecialCharacters,
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

    /* Check special character constraints */
    const specialCharacterConstraints = this.#checkSpecialCharacters(
      _password,
      minSpecialCharacters,
      maxSpecialCharacters
    );
    if (specialCharacterConstraints !== "OK")
      return specialCharacterConstraints;

    /* Check unique character constraints */
    const uniqueCharacterConstraints = this.#checkUniqueCharacters(
      _password,
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

    /* All checks passed */
    return "OK";
  }
}

export default new Checkpass().enforce.bind(new Checkpass());
