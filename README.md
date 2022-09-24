![Checkpass](https://drive.google.com/uc?export=view&id=1qlrqFN9n_MygH97Zo2DJzdhjKi38dF2w)

<p style="text-align:center">
  <b>Checkpass</b> is a TypeScript micro-library for <i>enforcing password constraints</i> and <i>improving password strength</i> with a simple API.
</p>

Checkpass allows you to specify the required password strength and then verify
whether the requirements are being met. For example you could specify the minimum
required length of the password, whether numberic characters are required, whether special characters are required, whether capital letters are required and more.
You can also pass in a deny list for disallowing certain characters from the password if necessary.

---

## Getting Started

### Documentation

### Installation

```
npm install checkpass
```

### API and Usage

```javascript
import checkpass from "checkpass";

const constraints = {
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
const check = checkpass(password, constraints);

if (check === "OK") {
  console.log("Well Done. All checks passed!");
} else {
  console.log(check);
}
```

The above snippet shows a use case where you check the password against the minimum length,
minimum capital letters, min and max numeric characters and special characters and disallows the
use of characters($ and \*).

If all the required checks pass you will get a string value "OK" in return from checkpass, else you will
receive a string message declaring the check which has failed in order to prompt the user to fix it.

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

```typescript
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

```javascript
const constraints = {
  minLength: 8;
  minSpecialCharacters: 3;
  minCapitalLetters: 0;
  minNumbers: number;
}
```

The _password_ being checked against the above _constraints_ object would require minimum 8 characters with 3 special characters. Here we do not need to use any numeric characters or capital letters since the value specified for them is 0.
In case no constraints object is passed checkpassed will assume a default object wherein all the required properties are set to zero by default and hence the password is not being checked against anything at all!

<p style="text-align: center"><b>Thank You!</b> for reading.</p>
