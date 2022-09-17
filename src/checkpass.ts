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
  #checklength(
    password: string,
    minLength: number,
    maxLength: number | undefined
  ) {
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

    if (disallowCharacters.some((character) => character.length !== 1))
      throw new Error("Specify valid characters to be disallowed");

    const passwordCharacters = [...password];
    if (
      passwordCharacters.some((character) =>
        disallowCharacters.includes(character)
      )
    )
      return "These characters cannot be used for your password";

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

    /* Check the length constraints */
    const lengthConstraints = this.#checklength(
      password,
      constraints.minLength,
      constraints.maxLength
    );

    console.log("Verify Length: ", lengthConstraints);
    if (lengthConstraints !== "OK") return;

    /* Check capital letters constraints */
    const capitalLettersConstraints = this.#checkCapitalLetters(
      password,
      constraints.minCapitalLetters,
      constraints.maxCapitalLetters
    );
    console.log("Verify Capital Letters: ", capitalLettersConstraints);
    if (capitalLettersConstraints !== "OK") return;

    /* Check unique character constraints */
    const uniqueCharacterConstraints = this.#checkUniqueCharacters(
      password,
      constraints.maxLength,
      constraints.minUniqueCharacters
    );
    console.log("Verify Unique Characters: ", uniqueCharacterConstraints);
    if (uniqueCharacterConstraints !== "OK") return;

    /* Check disallowed character constraints if any */
    const disallowedCharacterConstraints = this.#checkDisallowedCharacters(
      password,
      constraints.disallowCharacters
    );
    console.log(
      "Verify Disallowed Characters: ",
      disallowedCharacterConstraints
    );
    if (disallowedCharacterConstraints !== "OK") return;

    /* Check special character constraints */
    const specialCharacterConstraints = this.#checkSpecialCharacters(
      password,
      constraints.minSpecialCharacters,
      constraints.maxSpecialCharacters
    );
    console.log("Verify Special Characters: ", specialCharacterConstraints);
    if (specialCharacterConstraints !== "OK") return;
  }
}

export default new Checkpass();
