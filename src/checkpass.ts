/*
    Checkpass is a library for enforcing and verifying password constraints.
    We should be able to specify the required password strength and then verify 
    whether the requirements are being met. For example we could specify the minimum
    length of the password string, whether numbers are required, whether special characters
    are required, whether capital letters are required. We can use allow lists or deny lists
    for implementing the same if required.

    Check 1: Specify the min length.
    Check 2: Specify the max length (optional)
    Check 3: Specify if capital letters are required
    Check 4: Specify the min and max number of capital letters(optional)
    Check 5: Specify if numbers are required
    Check 6: Specify the min and max number of numbers(optional)
    Check 7: Specify if special characters are required
    Check 8: Specify the min and max number of special characters(optional)
    Check 9: Allow options to provide a deny list to prevent certain characters/special
             characters from being used.
*/
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

  #checkSpecialCharacters() {
    // TODO
  }

  #checkUniqueCharacters(
    password: string,
    minLength: number,
    minUniqueCharacters: number | undefined
  ) {
    if (!minUniqueCharacters) return;

    if (minUniqueCharacters > minLength)
      throw new Error(
        "The minimum length requirements cannot be less than the minimum unique character requirements"
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
      constraints.minLength,
      constraints.minUniqueCharacters
    );
    console.log("Verify Unique Characters: ", uniqueCharacterConstraints);
    if (uniqueCharacterConstraints !== "OK") return;
  }
}

export default new Checkpass();
