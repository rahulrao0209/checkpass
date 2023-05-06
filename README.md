![Checkpass](./public/Checkpass.png)

<p style="text-align:center">
  <b>Checkpass</b> is a TypeScript micro-library for <i>enforcing password constraints</i> and <i>improving password strength</i> with a simple API.
</p>

Checkpass allows you to specify the required password strength and then verify
whether the requirements are being met. For example you could specify the minimum
required length of the password, whether numberic characters are required, whether special characters are required, whether capital letters are required and more.
You can also pass in a deny list for disallowing certain characters from the password if necessary.

_Checkout the [Checkpass Playground](https://checkpass-playground.netlify.app/)_

## Getting Started

### Documentation

### Installation

```
npm install checkpass
```

### API and Usage

```javascript
import checkpass, { Constraints } from "checkpass";

const constraints: Constraints = {
  minLength: 6,
  minCapitalLetters: 2,
  minNumbers: 2,
  maxNumbers: 5,
  minSpecialCharacters: 2,
  maxSpecialCharacters: 6,
  minUniqueCharacters: 4,
  disallowCharacters: ["$", "*"],
};

const password = "TestingR02#Pass!?<";

/* Call checkpass with the arguments */
const result = checkpass(password, constraints);

/* 
  Checkpass returns an object providing details of all the constraints.
  You can use the return value to see if any of the constraints that you 
  had applied return true; which means that the constraint has failed the check.
*/

if (result.minLength.value) return result.minLength.message;
if (result.minCapitalLetters.value) return result.minCapitalLetters.message;
```

... and so on for all the required checks. The message will be an empty string if the value is false
which indicates that the constraint has passed the check.

The above snippet shows a use case where you check the password against the minimum length,
minimum capital letters, min and max numeric characters and special characters and disallows the
use of characters($ and \*).

If all the required checks pass, then the corresponding result object will have all the values
for the constraints set to false and the corresponding message string will be empty as shown below.

Return type for the result

```typeScript
const result: CheckErrors = {
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
```

Here is a brief list of checks against which checkpass can check your password.

- Check 1: Check for spaces and disallow any spaces that remain after trimming the string.
- Check 2: Check the specified length constraints.
- Check 3: Check the specified capital letter constraints.
- Check 4: Check the specified numeric character constraints.
- Check 5: Check the specified special character constraints.
- Check 6: Check for unique character constraints if specified. (optional)
- Check 7: Check if any characters are to be disallowed if specified. (optional)

Besides this, Checkpass also checks whether the specifed constraints can be exercised and throws an error in case of erroneous user inputs such as
if a negative number is specified for any constraint or if the minimum value constraint is larger than the maximum value for example.

### Specifying the constraints

Constraints against which the password needs to be checked can be specified using an object with the following properties.

```typeScript
  minLength: number;
  maxLength?: number; /* optional */
  minCapitalLetters: number;
  maxCapitalLetters?: number; /* optional */
  minNumbers: number;
  maxNumbers?: number; /* optional */
  minSpecialCharacters: number;
  maxSpecialCharacters?: number; /* optional */
  minUniqueCharacters?: number; /* optional */
  disallowCharacters?: string[]; /* optional */
```

In case of the required properties you can pass 0 if you do not wish to check against
that constraint.

For example

```typeScript
const constraints = {
  minLength: 8,
  minSpecialCharacters: 3,
  minCapitalLetters: 0,
  minNumbers: 0,
};
```

The _password_ being checked against the above _constraints_ object would require minimum 8 characters with 3 special characters. Here we do not need to use any numeric characters or capital letters since the value specified for them is 0.
In case no constraints object is passed checkpass will assume a default object wherein all the required properties are set to zero by default and hence the password is not being checked against anything at all!

---

## License

Checkpass is licensed under [MIT License](./LICENSE).

<p style="text-align:center"><b>Thank You!</b> for reading.</p>
