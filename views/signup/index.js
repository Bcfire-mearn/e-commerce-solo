// select needed elements
const signUpApi = async (data) => {
    return postAPI(`${BASE_URL}/user/register`, data)
};


const form = document.getElementById('signup-form');
const usernameInput = document.getElementById('signupUsername');
const emailInput = document.getElementById('signupEmail');
const passwordInput = document.getElementById('signUpPassword');
const passwordConfirmInput = document.getElementById('signUpConfirmPassword');


const handleSubmit = async (e) => {
    e.preventDefault();

    const username = usernameInput.value || 'faafadd';
    const email = emailInput.value || 'fads@fa.fa';
    const blankPassword = passwordInput.value || 'tsest!dafA12FJKf!32';
    const cpassword = passwordConfirmInput.value|| 'tsest!dafA12FJKf!32';

    const usernameError =  usernameRange(username.length)  || checkUserName(username)
    const emailError =  emailRange(email.length) || checkEmail(email)
    const comparePassError = (blankPassword === cpassword)? '':'Password Not match'
    const passwordError =  passwordRange(blankPassword.length) || checkPassword(blankPassword)
    // Dynamically handle errors
    handleError(usernameError, 'username', 'Username');
    handleError(emailError, 'email', 'Email');
    handleError(comparePassError, 'confirm-password', 'Confirm');
    handleError(passwordError, 'password', 'Password');

    if(passwordError||comparePassError||emailError|| usernameError){
        console.log('BEF sent to api')
        return
    }
    const password = hashData(blankPassword)
    const postData = {username, email, password}
    try {
        const res = await signUpApi(postData); // Ensure signUpApi returns a promise
        localStorage.setItem('authStatus', 'logged');
        SuccessSwal()
    } catch (error) {
        popupErrorSwal(error.message)
    }

  };

form.addEventListener('submit', handleSubmit);