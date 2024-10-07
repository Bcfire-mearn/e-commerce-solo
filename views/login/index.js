// select needed elements
const loginApi = async (data) => {
  return postAPI(`${BASE_URL}/user/login`, data)
};


const form = document.getElementById('login-form');
const usernameInput = document.getElementById('UsernameInput');
const passwordInput = document.getElementById('PasswordInput');

const handleSubmit = async (e) => {
  e.preventDefault();
  const emailOrUsername = usernameInput.value || 'faafad';
  const blankPassword = passwordInput.value || 'tsest!dafA12FJKf!32';


  const emailOrUsernameError =  emailRange(emailOrUsername.length) || checkUserNameOrEmail(emailOrUsername)
  const passwordError =  passwordRange(blankPassword.length) || checkPassword(blankPassword)
  // Dynamically handle errors
  handleError(emailOrUsernameError, 'username', 'Username or Email');
  handleError(passwordError, 'password', 'Password');

  if(emailOrUsernameError||passwordError){
      console.log('Input error, stop sent to BFF')
      return
  }
  const password = hashData(blankPassword)
  const postData = {emailOrUsername,password}
  try {
      const res = await loginApi(postData); // Ensure signUpApi returns a promise
      localStorage.setItem('authStatus', 'logged');
      SuccessSwal()
  } catch (error) {
      popupErrorSwal(error.message)
  }

};

form.addEventListener('submit', handleSubmit);