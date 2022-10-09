import checkpass from "checkpass";

/* Define a variable to set/reset constraints */
let reset = false;
let constraints: any;

/*Set button color and box shadow styles for set and reset states */
const buttonStyles = {
  setBtnColor: "#559307",
  setBtnShadow:
    "6px 6px 20px 0px rgb(85, 147, 7, 0.6), -2px 4px 10px 0px rgb(85, 147, 7, 0.6)",
  resetBtnColor: "#ff6a00",
  resetBtnShadow:
    "6px 6px 20px 0px rgb(255, 106, 0, 0.6), -2px 4px 10px 0px rgb(255, 106, 0, 0.6)",
};

/* Password input field colors */
const passwordFieldStyles = {
  successColor: "#559307",
  errorColor: "#af1717",
};

const getDomInputElement = function (identifier: string) {
  return document.getElementById(identifier)! as HTMLInputElement;
};

const getDomParaElement = function (identifier: string) {
  return document.getElementById(identifier)! as HTMLParagraphElement;
};

const getDomButtonElement = function (identifier: string) {
  return document.getElementById(identifier)! as HTMLButtonElement;
};

const getDomElements = function (identifier: string) {
  return Array.from(document.querySelectorAll(identifier)!) as HTMLElement[];
};

const addDisabledStyles = function (elements: HTMLElement[]) {
  elements.forEach((element) => {
    element.style.color = "grey";
    element.style.borderColor = "grey";
    element.style.cursor = "not-allowed";
    element.setAttribute("disabled", "true");
  });
};

const removeDisabledStyles = function (elements: HTMLElement[]) {
  elements.forEach((element) => {
    if (element.toString().includes("Span")) {
      element.style.color = "#b9b600";
      element.style.borderColor = "#b9b600";
    } else {
      element.style.color = "#fff";
      element.style.borderColor = "#fff";
    }
    element.style.cursor = "text";
    element.removeAttribute("disabled");
  });
};

const handleSetButton = function (this: HTMLButtonElement) {
  const constraintFields = getAllConstraintFields();
  constraints = getAllConstraintValues(constraintFields);
  const constraintLabels = getDomElements(".option > label");
  const constraintSpans = getDomElements(".option > span");
  const selectConstraintsText = getDomElements("#select-constraints-text");

  if (!reset) {
    /* Add the styles for making all the constraint fields look disabled */
    addDisabledStyles(constraintLabels);
    addDisabledStyles(constraintSpans);
    addDisabledStyles(constraintFields);
    addDisabledStyles(selectConstraintsText);
    this.style.backgroundColor = buttonStyles.resetBtnColor;
    this.style.boxShadow = buttonStyles.resetBtnShadow;
    this.textContent = "Reset";
  } else {
    /* Add the styles for making all the constraint fields look enable */
    removeDisabledStyles(constraintLabels);
    removeDisabledStyles(constraintSpans);
    removeDisabledStyles(constraintFields);
    removeDisabledStyles(selectConstraintsText);

    /* Reset all constraint field values */
    resetAllConstraintValues(constraintFields);

    /* Reset the password value and the checkpass response value */
    const password = getDomInputElement("password")!;
    const checkpassResponse = getDomParaElement("checkpass-response");
    password.value = "";
    checkpassResponse.innerText = "";

    this.style.backgroundColor = buttonStyles.setBtnColor;
    this.style.boxShadow = buttonStyles.setBtnShadow;
    this.textContent = "Set";
  }
  /* Toggle reset */
  reset = !reset;
};

const handlePasswordChange = function (this: HTMLInputElement) {
  /* Get the checkpass response field */
  const checkpassResponse = getDomParaElement("checkpass-response");
  const passwordVal = this.value;
  if (passwordVal) {
    const resp = checkpass(passwordVal, constraints);
    checkpassResponse.textContent = resp;

    if (resp === "OK") {
      checkpassResponse.style.color = passwordFieldStyles.successColor;
      checkpassResponse.textContent = "Well Done";
    }

    if (resp !== "OK")
      checkpassResponse.style.color = passwordFieldStyles.errorColor;
  } else {
    checkpassResponse.textContent = "";
  }
};

const resetAllConstraintValues = function (constraints: HTMLInputElement[]) {
  constraints.forEach((constraint: HTMLInputElement) => {
    if (constraint.id === "disallowCharacters") {
      constraint.value = "";
    }
    constraint.value = "0";
  });
};

const getAllConstraintValues = function (constraints: HTMLInputElement[]) {
  const constraintObj: any = {};
  constraints.forEach((constraint: HTMLInputElement) => {
    /* The disallowed character value must be a string containing all the characters we do not wish to allow */
    if (constraint.id === "disallowCharacters") {
      constraintObj[constraint.id] = [...constraint.value.replace(" ", "")];
      return;
    }
    constraintObj[constraint.id] = +constraint.value;
  });
  return constraintObj;
};

const getAllConstraintFields = function () {
  /* Get the required constraint property fields */
  const minLength = getDomInputElement("minLength");
  const minCapitalLetters = getDomInputElement("minCapitalLetters");
  const minNumericCharacters = getDomInputElement("minNumbers");
  const minSpecialCharacters = getDomInputElement("minSpecialCharacters");

  /* Get the optional constraint property fields */
  const maxLength = getDomInputElement("maxLength");
  const maxCapitalLetters = getDomInputElement("maxCapitalLetters");
  const maxNumericCharacters = getDomInputElement("maxNumbers");
  const maxSpecialCharacters = getDomInputElement("maxSpecialCharacters");
  const minUniqueCharacters = getDomInputElement("minUniqueCharacters");
  const disallowCharacters = getDomInputElement("disallowCharacters");

  return [
    minLength,
    minCapitalLetters,
    minNumericCharacters,
    minSpecialCharacters,
    maxLength,
    maxCapitalLetters,
    maxNumericCharacters,
    maxSpecialCharacters,
    minUniqueCharacters,
    disallowCharacters,
  ];
};

/* Setup event listeners on all fields */
export const init = function () {
  /* Get the password input */
  const password = getDomInputElement("password")!;

  /* Set constraints button */
  const setConstraintsBtn = getDomButtonElement("set-btn");

  /* Setup event listeners */
  setConstraintsBtn.addEventListener(
    "click",
    handleSetButton.bind(setConstraintsBtn)
  );

  /* Call checkpass with the user specified constraint values */
  password.addEventListener("input", handlePasswordChange.bind(password));
};

init();
