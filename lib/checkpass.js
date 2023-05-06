"use strict";
/* Checkpass is a micro-library for enforcing and verifying password constraints. */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Checkpass_instances, _Checkpass_checkMinMax, _Checkpass_checkNoSpace, _Checkpass_checkInvalidInputs, _Checkpass_checkMinMaxConstraints, _Checkpass_checklength, _Checkpass_checkCapitalLetters, _Checkpass_checkNumericCharacters, _Checkpass_checkSpecialCharacters, _Checkpass_checkDisallowedCharacters, _Checkpass_checkUniqueCharacters;
Object.defineProperty(exports, "__esModule", { value: true });
const errors = {
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
        var _a, _b, _c, _d, _e, _f;
        /* Throw errors for erroneous user inputs such as negative numbers */
        __classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkInvalidInputs).call(this, constraints);
        const { minLength, maxLength, minNumbers, maxNumbers, minCapitalLetters, maxCapitalLetters, minSpecialCharacters, maxSpecialCharacters, minUniqueCharacters, disallowCharacters, } = constraints;
        /* Perform general sanity based on the constraints specified */
        __classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkMinMaxConstraints).call(this, minLength, maxLength, minCapitalLetters, maxCapitalLetters, minNumbers, maxNumbers, minSpecialCharacters, maxSpecialCharacters, minUniqueCharacters);
        /* Trim the string to remove any spaces at the start or end */
        const _password = password.trim();
        /* Check all constraints */
        __classPrivateFieldGet((_a = __classPrivateFieldGet((_b = __classPrivateFieldGet((_c = __classPrivateFieldGet((_d = __classPrivateFieldGet((_e = __classPrivateFieldGet((_f = __classPrivateFieldGet(this, _Checkpass_instances, "m", _Checkpass_checkNoSpace).call(this, _password)), _Checkpass_instances, "m", _Checkpass_checklength).call(_f, _password, minLength, maxLength)), _Checkpass_instances, "m", _Checkpass_checkCapitalLetters).call(_e, _password, minCapitalLetters, maxCapitalLetters)), _Checkpass_instances, "m", _Checkpass_checkNumericCharacters).call(_d, _password, minNumbers, maxNumbers)), _Checkpass_instances, "m", _Checkpass_checkSpecialCharacters).call(_c, _password, minSpecialCharacters, maxSpecialCharacters)), _Checkpass_instances, "m", _Checkpass_checkUniqueCharacters).call(_b, _password, minUniqueCharacters)), _Checkpass_instances, "m", _Checkpass_checkDisallowedCharacters).call(_a, _password, disallowCharacters);
        return errors;
    }
}
_Checkpass_instances = new WeakSet(), _Checkpass_checkMinMax = function _Checkpass_checkMinMax(minValue, maxValue) {
    if (!maxValue)
        return 1;
    return maxValue - minValue;
}, _Checkpass_checkNoSpace = function _Checkpass_checkNoSpace(password) {
    if (password.includes(" ")) {
        errors.disallowSpaces.value = true;
        errors.disallowSpaces.message = "Space is not allowed";
    }
    else {
        errors.disallowSpaces.value = false;
        errors.disallowSpaces.message = "";
    }
    return this;
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
    return this;
}, _Checkpass_checklength = function _Checkpass_checklength(password, minLength, maxLength) {
    if (password.length < minLength) {
        errors.minLength.value = true;
        errors.minLength.message = `Min ${minLength} characters are required`;
    }
    else {
        errors.minLength.value = false;
        errors.minLength.message = "";
    }
    if (maxLength && password.length > maxLength) {
        errors.maxLength.value = true;
        errors.maxLength.message = `Max ${maxLength} characters are allowed`;
    }
    else {
        errors.maxLength.value = false;
        errors.maxLength.message = "";
    }
    return this;
}, _Checkpass_checkCapitalLetters = function _Checkpass_checkCapitalLetters(password, minCapitalLetters, maxCapitalLetters) {
    const checkCapsMin = `^(.*?[A-Z]){${minCapitalLetters},}.*$`;
    const capsRegex = new RegExp(checkCapsMin);
    if (maxCapitalLetters) {
        const checkCapsMax = `^(.*?[A-Z]){${maxCapitalLetters + 1}}.*$`;
        const capsRegexMax = new RegExp(checkCapsMax);
        if (capsRegexMax.test(password)) {
            errors.maxCapitalLetters.value = true;
            errors.maxCapitalLetters.message = `Max ${maxCapitalLetters} capital letters are allowed`;
        }
        else {
            errors.maxCapitalLetters.value = false;
            errors.maxCapitalLetters.message = "";
        }
    }
    if (!capsRegex.test(password)) {
        errors.minCapitalLetters.value = true;
        errors.minCapitalLetters.message = `Min ${minCapitalLetters} capital letters are required`;
    }
    else {
        errors.minCapitalLetters.value = false;
        errors.minCapitalLetters.message = "";
    }
    return this;
}, _Checkpass_checkNumericCharacters = function _Checkpass_checkNumericCharacters(password, minNumbers, maxNumbers) {
    const checkNumsMin = `^(.*?[0-9]){${minNumbers},}.*$`;
    const numsRegex = new RegExp(checkNumsMin);
    if (maxNumbers) {
        const checkNumsMax = `^(.*?[0-9]){${maxNumbers + 1}}.*$`;
        const numsRegexMax = new RegExp(checkNumsMax);
        if (numsRegexMax.test(password)) {
            errors.maxNumbers.value = true;
            errors.maxNumbers.message = `Max ${maxNumbers} numeric characters are allowed`;
        }
        else {
            errors.maxNumbers.value = false;
            errors.maxNumbers.message = "";
        }
    }
    if (!numsRegex.test(password)) {
        errors.minNumbers.value = true;
        errors.minNumbers.message = `Min ${minNumbers} numeric characters are required`;
    }
    else {
        errors.minNumbers.value = false;
        errors.minNumbers.message = "";
    }
    return this;
}, _Checkpass_checkSpecialCharacters = function _Checkpass_checkSpecialCharacters(password, minSpecialCharacters, maxSpecialCharacters) {
    const checkSpecialMin = `^(.*?[ -\/:-@\[-\`{-~]){${minSpecialCharacters},}.*$`;
    const specialsRegex = new RegExp(checkSpecialMin);
    if (maxSpecialCharacters) {
        const checkSpecialMax = `^(.*?[ -\/:-@\[-\`{-~]){${maxSpecialCharacters + 1}}.*$`;
        const specialsRegexMax = new RegExp(checkSpecialMax);
        if (specialsRegexMax.test(password)) {
            errors.maxSpecialCharacters.value = true;
            errors.maxSpecialCharacters.message = `Max ${maxSpecialCharacters} special characters are allowed`;
        }
        else {
            errors.maxSpecialCharacters.value = false;
            errors.maxSpecialCharacters.message = "";
        }
    }
    if (!specialsRegex.test(password)) {
        errors.minSpecialCharacters.value = true;
        errors.minSpecialCharacters.message = `Min ${minSpecialCharacters} special characters are required`;
    }
    else {
        errors.minSpecialCharacters.value = false;
        errors.minSpecialCharacters.message = "";
    }
    return this;
}, _Checkpass_checkDisallowedCharacters = function _Checkpass_checkDisallowedCharacters(password, disallowCharacters) {
    if (!disallowCharacters)
        return "OK";
    const passwordCharacters = [...password];
    if (passwordCharacters.some((character) => disallowCharacters.includes(character))) {
        errors.disallowCharacters.value = true;
        errors.disallowCharacters.message = `${[
            disallowCharacters,
        ]} characters cannot be used for your password`;
    }
    else {
        errors.disallowCharacters.value = false;
        errors.disallowCharacters.message = "";
    }
    return this;
}, _Checkpass_checkUniqueCharacters = function _Checkpass_checkUniqueCharacters(password, minUniqueCharacters) {
    if (!minUniqueCharacters)
        return this;
    const uniqueCharacters = new Set([...password]);
    if (uniqueCharacters.size < minUniqueCharacters) {
        errors.minUniqueCharacters.value = true;
        errors.minUniqueCharacters.message = `Min ${minUniqueCharacters} unique characters are required`;
    }
    else {
        errors.minUniqueCharacters.value = false;
        errors.minUniqueCharacters.message = "";
    }
    return this;
};
exports.default = new Checkpass().enforce.bind(new Checkpass());
//# sourceMappingURL=checkpass.js.map