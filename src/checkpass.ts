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

type CheckError = {
  value: boolean;
  message: string;
};

type CheckErrors = {
  minLength: CheckError;
  maxLength: CheckError;
  minCapitalLetters: CheckError;
  maxCapitalLetters: CheckError;
  minNumbers: CheckError;
  maxNumbers: CheckError;
  minSpecialCharacters: CheckError;
  maxSpecialCharacters: CheckError;
  minUniqueCharacters: CheckError;
  disallowCharacters: CheckError;
  disallowSpaces: CheckError;
};

const errors: CheckErrors = {
  minLength: { value: false, message: "" },
  maxLength: { value: false, message: "" },
  minCapitalLetters: { value: false, message: "" },
  maxCapitalLetters: { value: false, message: "" },
  minNumbers: { value: false, message: "" },
  maxNumbers: { value: false, message: "" },
  minSpecialCharacters: { value: false, message: "" },
  maxSpecialCharacters: { value: false, message: "" },
  minUniqueCharacters: { value: false, message: "" },
  disallowCharacters: { value: false, message: "" },
  disallowSpaces: { value: false, message: "" },
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
    if (password.includes(" ")) {
      errors.disallowSpaces.value = true;
      errors.disallowSpaces.message = "Space is not allowed";
    }
    return this;
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

    return this;
  }

  #checklength(
    password: string,
    minLength: number,
    maxLength: number | undefined
  ) {
    if (password.length < minLength) {
      errors.minLength.value = true;
      errors.minLength.message = `Min ${minLength} characters are required`;
    }

    if (maxLength && password.length > maxLength) {
      errors.minLength.value = true;
      errors.minLength.message = `Min ${minLength} characters are required`;
    }

    return this;
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
      if (capsRegexMax.test(password)) {
        errors.maxCapitalLetters.value = true;
        errors.maxCapitalLetters.message = `Maximum ${maxCapitalLetters} capital letters are allowed`;
      }
    }

    if (!capsRegex.test(password)) {
      errors.minCapitalLetters.value = true;
      errors.minCapitalLetters.message = `Minimum ${minCapitalLetters} capital letters are required`;
    }

    return this;
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
      if (numsRegexMax.test(password)) {
        errors.maxNumbers.value = true;
        errors.maxNumbers.message = `Maximum ${maxNumbers} numeric characters are allowed`;
      }
    }

    if (!numsRegex.test(password)) {
      errors.minNumbers.value = true;
      errors.minNumbers.message = `Minimum ${minNumbers} numeric characters are required`;
    }

    return this;
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
      if (specialsRegexMax.test(password)) {
        errors.maxSpecialCharacters.value = true;
        errors.maxSpecialCharacters.message = `Maximum ${maxSpecialCharacters} special characters are allowed`;
      }
    }

    if (!specialsRegex.test(password)) {
      errors.minSpecialCharacters.value = true;
      errors.minSpecialCharacters.message = `Minimum ${minSpecialCharacters} special characters are required`;
    }

    return this;
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
    ) {
      errors.disallowCharacters.value = true;
      errors.disallowCharacters.message = `${[
        disallowCharacters,
      ]} characters cannot be used for your password`;
    }

    return this;
  }

  #checkUniqueCharacters(
    password: string,
    minUniqueCharacters: number | undefined
  ) {
    if (!minUniqueCharacters) return this;

    const uniqueCharacters = new Set([...password]);

    if (uniqueCharacters.size < minUniqueCharacters) {
      errors.minUniqueCharacters.value = true;
      errors.minUniqueCharacters.message = `Minimum ${minUniqueCharacters} unique characters are required`;
    }

    return this;
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
    this.#checkMinMaxConstraints(
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

    /* Trim the string to remove any spaces at the start or end */
    const _password: string = password.trim();

    /* Check all constraints */
    this.#checkNoSpace(_password)
      .#checklength(_password, minLength, maxLength)
      .#checkCapitalLetters(_password, minCapitalLetters, maxCapitalLetters)
      .#checkNumericCharacters(_password, minNumbers, maxNumbers)
      .#checkSpecialCharacters(
        _password,
        minSpecialCharacters,
        maxSpecialCharacters
      )
      .#checkUniqueCharacters(_password, minUniqueCharacters)
      .#checkDisallowedCharacters(_password, disallowCharacters);

    return errors;
  }
}

export default new Checkpass().enforce.bind(new Checkpass());
