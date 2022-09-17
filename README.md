## Checkpass

Checkpass is a micro-library for checking and enforcing password constraints.

Project Status: Ongoing.

    Checkpass is a micro-library for enforcing and verifying password constraints.
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
    Check 9: Specify the number of unique characters required (optional)
    Check 9: Allow options to provide a deny list to prevent certain characters/special
             characters from being used.
