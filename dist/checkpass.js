"use strict";
/* Checkpass is a micro-library for enforcing and verifying password constraints. */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Checkpass_instances, _Checkpass_checkMinMax, _Checkpass_checkGeneralSanity, _Checkpass_checklength, _Checkpass_checkCapitalLetters, _Checkpass_checkNumericCharacters, _Checkpass_checkSpecialCharacters, _Checkpass_checkDisallowedCharacters, _Checkpass_checkUniqueCharacters;
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
        console.log("Password: ", password);
        const { minLength, maxLength, minNumbers, maxNumbers, minCapitalLetters, maxCapitalLetters, minSpecialCharacters, maxSpecialCharacters, minUniqueCharacters, disallowCharacters, } = constraints;
        /* Perform general sanity based on the constraints specified */
        const generalSanityCheck = __classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkGeneralSanity).call(this, maxLength, minCapitalLetters, minNumbers, minSpecialCharacters, minUniqueCharacters);
        console.log("General Sanity: ", generalSanityCheck);
        if (generalSanityCheck !== "OK")
            return;
        /* Check the length constraints */
        const lengthConstraints = __classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checklength).call(this, password, minLength, maxLength);
        console.log("Verify Length: ", lengthConstraints);
        if (lengthConstraints !== "OK")
            return;
        /* Check capital letters constraints */
        const capitalLettersConstraints = __classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkCapitalLetters).call(this, password, minCapitalLetters, maxCapitalLetters);
        console.log("Verify Capital Letters: ", capitalLettersConstraints);
        if (capitalLettersConstraints !== "OK")
            return;
        /* Check numeric character constraints */
        const numericCharacterConstraints = __classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkNumericCharacters).call(this, password, minNumbers, maxNumbers);
        console.log("Verify Numeric characters: ", numericCharacterConstraints);
        if (numericCharacterConstraints !== "OK")
            return;
        /* Check unique character constraints */
        const uniqueCharacterConstraints = __classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkUniqueCharacters).call(this, password, maxLength, minUniqueCharacters);
        console.log("Verify Unique Characters: ", uniqueCharacterConstraints);
        if (uniqueCharacterConstraints !== "OK")
            return;
        /* Check disallowed character constraints if any */
        const disallowedCharacterConstraints = __classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkDisallowedCharacters).call(this, password, disallowCharacters);
        console.log("Verify Disallowed Characters: ", disallowedCharacterConstraints);
        if (disallowedCharacterConstraints !== "OK")
            return;
        /* Check special character constraints */
        const specialCharacterConstraints = __classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkSpecialCharacters).call(this, password, minSpecialCharacters, maxSpecialCharacters);
        console.log("Verify Special Characters: ", specialCharacterConstraints);
        if (specialCharacterConstraints !== "OK")
            return;
    }
}
_Checkpass_instances = new WeakSet(), _Checkpass_checkMinMax = function _Checkpass_checkMinMax(minValue, maxValue) {
    /* The min value of a constraint cannot be greater than the max value and vice versa */
    if (!maxValue)
        return 1;
    return maxValue - minValue;
}, _Checkpass_checkGeneralSanity = function _Checkpass_checkGeneralSanity(maxLength, minCapitalLetters, minNumbers, minSpecialCharacters, minUniqueCharacters) {
    /* The min requirements for capitals, numbers, special characters or unique characters cannot be greater than the max length if specified */
    if (!maxLength)
        return "OK";
    if (maxLength < minCapitalLetters)
        return "";
    if (maxLength < minNumbers)
        return "";
    if (maxLength < minSpecialCharacters)
        return "";
    if (minUniqueCharacters && maxLength < minUniqueCharacters)
        return "";
    if (maxLength <
        minCapitalLetters +
            minNumbers +
            minSpecialCharacters +
            (minUniqueCharacters || 0))
        return "";
    return "OK";
}, _Checkpass_checklength = function _Checkpass_checklength(password, minLength, maxLength) {
    if (__classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkMinMax).call(this, minLength, maxLength) < 0) {
        return "The min value of the length constraint cannot exceed the max value";
    }
    if (password.length < minLength)
        return "too small";
    if (maxLength && password.length > maxLength)
        return `Max ${maxLength} characters are allowed`;
    return "OK";
}, _Checkpass_checkCapitalLetters = function _Checkpass_checkCapitalLetters(password, minCapitalLetters, maxCapitalLetters) {
    if (__classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkMinMax).call(this, minCapitalLetters, maxCapitalLetters) < 0) {
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
}, _Checkpass_checkNumericCharacters = function _Checkpass_checkNumericCharacters(password, minNumbers, maxNumbers) {
    if (__classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkMinMax).call(this, minNumbers, maxNumbers) < 0) {
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
}, _Checkpass_checkSpecialCharacters = function _Checkpass_checkSpecialCharacters(password, minSpecialCharacters, maxSpecialCharacters) {
    if (__classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkMinMax).call(this, minSpecialCharacters, maxSpecialCharacters) < 0) {
        return "The min value of the special character constraints cannot exceed the max value";
    }
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
    if (disallowCharacters.some((character) => character.length !== 1))
        throw new Error("Specify valid characters to be disallowed");
    const passwordCharacters = [...password];
    if (passwordCharacters.some((character) => disallowCharacters.includes(character)))
        return `${[
            disallowCharacters,
        ]} characters cannot be used for your password`;
    return "OK";
}, _Checkpass_checkUniqueCharacters = function _Checkpass_checkUniqueCharacters(password, maxLength, minUniqueCharacters) {
    if (!minUniqueCharacters)
        return;
    if (maxLength && minUniqueCharacters > maxLength)
        throw new Error("Required unique characters cannot be more than the maximum allowed length");
    const uniqueCharacters = new Set([...password]);
    if (uniqueCharacters.size < minUniqueCharacters)
        return `Minimum ${minUniqueCharacters} unique characters are required`;
    return "OK";
};
exports.default = new Checkpass().enforce.bind(new Checkpass());
//# sourceMappingURL=checkpass.js.map