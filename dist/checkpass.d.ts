declare type Constraints = {
    minLength: number;
    maxLength?: number;
    minCapitalLetters: number;
    maxCapitalLetters?: number;
    minNumbers: number;
    maxNumbers?: number;
    minSpecialCharacters: number;
    maxSpecialCharacters?: number;
};
declare class Checkpass {
    enforce(password: string, constraints?: Constraints): void;
}
declare const _default: Checkpass;
export default _default;
