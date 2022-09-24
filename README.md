## Checkpass

Checkpass is a _micro-library_ for _enforcing password constraints_ and _improving password strength_

```
npm install checkpass
```

![Checkpass](https://drive.google.com/uc?export=view&id=1TinnjosjJaFPs5V_dqgA_Nq1GyMnMzlx)

Checkpass allows you to specify the required password strength and then verify
whether the requirements are being met. For example you could specify the minimum
required length of the password, whether numberic characters are required, whether special characters are required, whether capital letters are required and more.
You can also pass in a deny list for disallowing certain characters from the password if necessary.

---

Usage

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

If all the required checks pass you will get a string value "OK" in return from checkpass else you will
receive a string message declaring the check which has failed in order to prompt the user to fix it.

Here is a brief list of checks against which checkpass can check your password.

- Check 1: Specify the min length.
- Check 2: Specify the max length (optional)
- Check 3: Specify if capital letters are required
- Check 4: Specify the min and max number of capital letters(optional)
- Check 5: Specify if numbers are required
- Check 6: Specify the min and max number of numbers(optional)
- Check 7: Specify if special characters are required
- Check 8: Specify the min and max number of special characters(optional)
- Check 9: Specify the number of unique characters required (optional)
- Check 9: Allow options to provide a deny list to prevent certain characters/special characters from being used.
