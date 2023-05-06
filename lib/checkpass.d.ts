export declare type Constraints = {
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
export declare type CheckError = {
    value: boolean;
    message: string;
};
export declare type CheckErrors = {
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
declare const _default: (password: string, constraints?: Constraints) => CheckErrors;
export default _default;
