const regexNoSpecial = /^[a-zA-Z0-9 _]*$/;
const regexOnlyAt = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexCombined = /^[a-zA-Z0-9 _]*$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexPass = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+/;

const checkMinMax = (min) => (max) => (num) => {
  return (num >= min && num <= max) ? '' : `length should in range [${min},${max}]`;
};

const checkCharacters = (regex) => (type) => (str) => {
  const passcheck = 'must contain uppercase, lowercase, number, and special characters';
  return regex.test(str)
    ? ''
    : type === 'email'
      ? 'Not valid'
      : type === 'pass'
        ? passcheck
        : 'should Not have special characters';
};

const checkUserName = checkCharacters(regexNoSpecial)();
const checkUserNameOrEmail = checkCharacters(regexCombined)();
const checkEmail = checkCharacters(regexOnlyAt)("email");
const checkPassword = checkCharacters(regexPass)("pass");

const usernameRange = checkMinMax(4)(20);
const emailRange = checkMinMax(5)(50);
const passwordRange = checkMinMax(7)(100);


const handleError = (error, fieldId, fieldName) => {
  const errorcontainer = document.getElementById(`${fieldId}-error`);
  errorcontainer.innerHTML = `<p>${error ? `${fieldName} ${error}` : ''}</p>`
};

const hashData = (data) => btoa(data)
// console.log(hashData('tsest!dafA12FJKf!32'))

// console.log(checkUserNameOrEmail('newAcount@gmail.com'))