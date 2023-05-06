"use strict";
/* Checkpass is a micro-library for enforcing and verifying password constraints. */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Checkpass_instances, _Checkpass_checkMinMax, _Checkpass_checkNoSpace, _Checkpass_checkInvalidInputs, _Checkpass_checkMinMaxConstraints, _Checkpass_checklength, _Checkpass_checkCapitalLetters, _Checkpass_checkNumericCharacters, _Checkpass_checkSpecialCharacters, _Checkpass_checkDisallowedCharacters, _Checkpass_checkUniqueCharacters;
Object.defineProperty(exports, "__esModule", { value: true });
const defaultConstraints = {
    minLength: 0,
    minCapitalLetters: 0,
    minNumbers: 0,
    minSpecialCharacters: 0,
};
class Checkpass {
    constructor() {
        _Checkpass_instances.add(this);
    }
    enforce(password, constraints = defaultConstraints) {
        /* Throw errors for erroneous user inputs such as negative numbers */
        __classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkInvalidInputs).call(this, constraints);
        const { minLength, maxLength, minNumbers, maxNumbers, minCapitalLetters, maxCapitalLetters, minSpecialCharacters, maxSpecialCharacters, minUniqueCharacters, disallowCharacters, } = constraints;
        /* Perform general sanity based on the constraints specified */
        const generalSanityCheck = __classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkMinMaxConstraints).call(this, minLength, maxLength, minCapitalLetters, maxCapitalLetters, minNumbers, maxNumbers, minSpecialCharacters, maxSpecialCharacters, minUniqueCharacters);
        if (generalSanityCheck !== "OK")
            return generalSanityCheck;
        /* Trim the string to remove any spaces at the start or end */
        const _password = password.trim();
        /* Check no space */
        const spacingConstraints = __classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkNoSpace).call(this, _password);
        if (spacingConstraints !== "OK")
            return spacingConstraints;
        /* Check the length constraints */
        const lengthConstraints = __classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checklength).call(this, _password, minLength, maxLength);
        if (lengthConstraints !== "OK")
            return lengthConstraints;
        /* Check capital letters constraints */
        const capitalLettersConstraints = __classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkCapitalLetters).call(this, _password, minCapitalLetters, maxCapitalLetters);
        if (capitalLettersConstraints !== "OK")
            return capitalLettersConstraints;
        /* Check numeric character constraints */
        const numericCharacterConstraints = __classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkNumericCharacters).call(this, _password, minNumbers, maxNumbers);
        if (numericCharacterConstraints !== "OK")
            return numericCharacterConstraints;
        /* Check special character constraints */
        const specialCharacterConstraints = __classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkSpecialCharacters).call(this, _password, minSpecialCharacters, maxSpecialCharacters);
        if (specialCharacterConstraints !== "OK")
            return specialCharacterConstraints;
        /* Check unique character constraints */
        const uniqueCharacterConstraints = __classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkUniqueCharacters).call(this, _password, minUniqueCharacters);
        if (uniqueCharacterConstraints !== "OK")
            return uniqueCharacterConstraints;
        /* Check disallowed character constraints if any */
        const disallowedCharacterConstraints = __classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkDisallowedCharacters).call(this, _password, disallowCharacters);
        if (disallowedCharacterConstraints !== "OK")
            return disallowedCharacterConstraints;
        /* All checks passed */
        return "OK";
    }
}
_Checkpass_instances = new WeakSet(), _Checkpass_checkMinMax = function _Checkpass_checkMinMax(minValue, maxValue) {
    if (!maxValue)
        return 1;
    return maxValue - minValue;
}, _Checkpass_checkNoSpace = function _Checkpass_checkNoSpace(password) {
    if (password.includes(" "))
        return "Space is not allowed";
    return "OK";
}, _Checkpass_checkInvalidInputs = function _Checkpass_checkInvalidInputs(constraints) {
    const { minLength, maxLength, minNumbers, maxNumbers, minCapitalLetters, maxCapitalLetters, minSpecialCharacters, maxSpecialCharacters, minUniqueCharacters, disallowCharacters, } = constraints;
    /* Check the required values */
    if (+minLength < 0)
        throw new Error("minLength cannot be less than 0!");
    if (+minNumbers < 0)
        throw new Error("minNumbers cannot be less than 0!");
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
    if (disallowCharacters && (disallowCharacters === null || disallowCharacters === void 0 ? void 0 : disallowCharacters.length) > 0) {
        disallowCharacters.some((character) => {
            if (typeof character !== "string" || character.length > 1)
                throw new Error("disallowCharacters must be list of characters");
        });
    }
    return "OK";
}, _Checkpass_checkMinMaxConstraints = function _Checkpass_checkMinMaxConstraints(minLength, maxLength, minCapitalLetters, maxCapitalLetters, minNumbers, maxNumbers, minSpecialCharacters, maxSpecialCharacters, minUniqueCharacters) {
    /* Check whether the max-length if specified is not less than any of the other specified min required constraint values */
    if (__classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkMinMax).call(this, minLength, maxLength) < 0)
        throw new Error("The max-length cannot be less than the required min-length");
    if (__classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkMinMax).call(this, minCapitalLetters, maxLength) < 0)
        throw new Error("The max-length cannot be less than min required capital letters");
    if (__classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkMinMax).call(this, minNumbers, maxLength) < 0)
        throw new Error("The max-length cannot be less than min required numbers");
    if (__classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkMinMax).call(this, minSpecialCharacters, maxLength) < 0)
        throw new Error("The max-length cannot be less than the min required special characters");
    if (minUniqueCharacters &&
        __classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkMinMax).call(this, minUniqueCharacters, maxLength) < 0)
        throw new Error("The max-length cannot be less than the min required unique characters");
    if (__classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkMinMax).call(this, minCapitalLetters +
        minNumbers +
        minSpecialCharacters +
        (minUniqueCharacters || 0), maxLength) < 0)
        throw new Error("The max-length cannot be less than the sum of min required capital letters, numbers and special and unique characters");
    /* Check the min-max values of the eligible constraint pairs */
    if (__classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkMinMax).call(this, minLength, maxLength) < 0)
        throw new Error("The min value of the length constraint cannot exceed the max value");
    if (__classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkMinMax).call(this, minCapitalLetters, maxCapitalLetters) < 0)
        throw new Error("The min value of the capital letters constraint cannot exceed the max value");
    if (__classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkMinMax).call(this, minNumbers, maxNumbers) < 0)
        throw new Error("The min value of the numeric character constraints cannot exceed the max value");
    if (__classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkMinMax).call(this, minSpecialCharacters, maxSpecialCharacters) < 0)
        throw new Error("The min value of the special character constraints cannot exceed the max value");
    return "OK";
}, _Checkpass_checklength = function _Checkpass_checklength(password, minLength, maxLength) {
    if (password.length < minLength)
        return `Min ${minLength} characters are required`;
    if (maxLength && password.length > maxLength)
        return `Max ${maxLength} characters are allowed`;
    return "OK";
}, _Checkpass_checkCapitalLetters = function _Checkpass_checkCapitalLetters(password, minCapitalLetters, maxCapitalLetters) {
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
}, _Checkpass_checkNumericCharacters = function _Checkpass_checkNumericCharacters(password, minNumbers, maxNumbers) {
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
}, _Checkpass_checkSpecialCharacters = function _Checkpass_checkSpecialCharacters(password, minSpecialCharacters, maxSpecialCharacters) {
    const checkSpecialMin = `^(.*?[ -\/:-@\[-\`{-~]){${minSpecialCharacters},}.*$`;
    const specialsRegex = new RegExp(checkSpecialMin);
    if (maxSpecialCharacters) {
        const checkSpecialMax = `^(.*?[ -\/:-@\[-\`{-~]){${maxSpecialCharacters + 1}}.*$`;
        const specialsRegexMax = new RegExp(checkSpecialMax);
        if (specialsRegexMax.test(password))
            return `Maximum ${maxSpecialCharacters} special characters are allowed`;
    }
    if (!specialsRegex.test(password))
        return `Minimum ${minSpecialCharacters} special characters are required`;
    return "OK";
}, _Checkpass_checkDisallowedCharacters = function _Checkpass_checkDisallowedCharacters(password, disallowCharacters) {
    if (!disallowCharacters)
        return "OK";
    const passwordCharacters = [...password];
    if (passwordCharacters.some((character) => disallowCharacters.includes(character)))
        return `${[
            disallowCharacters,
        ]} characters cannot be used for your password`;
    return "OK";
}, _Checkpass_checkUniqueCharacters = function _Checkpass_checkUniqueCharacters(password, minUniqueCharacters) {
    if (!minUniqueCharacters)
        return "OK";
    const uniqueCharacters = new Set([...password]);
    if (uniqueCharacters.size < minUniqueCharacters)
        return `Minimum ${minUniqueCharacters} unique characters are required`;
    return "OK";
};
exports.default = new Checkpass().enforce.bind(new Checkpass());
//# sourceMappingURL=checkpass.js.map