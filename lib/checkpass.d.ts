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
declare const _default: (password: string, constraints?: Constraints) => string;
export default _default;
