const defaultConstraints = {
    minLength: 0,
    minCapitalLetters: 0,
    minNumbers: 0,
    minSpecialCharacters: 0,
};
class Checkpass {
    enforce(password, constraints = defaultConstraints) {
        console.log("Password: ", password);
    }
}
// const test = new Checkpass();
// test.enforce("Rahul123#", {
//   minLength: 6,
//   minCapitalLetters: 2,
//   minNumbers: 1,
//   minSpecialCharacters: 1,
// });
// test.enforce("RaAbc!");
export default new Checkpass();
//# sourceMappingURL=checkpass.js.map