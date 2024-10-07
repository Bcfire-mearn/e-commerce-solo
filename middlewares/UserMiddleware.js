import validator from 'validator';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const loginUserValidation = (req, res, next) => {
  const { emailOrUsername, password } = req.body;
  if (
    !emailOrUsername ||
    !password ||
    validator.isEmpty(emailOrUsername) ||
    validator.isEmpty(password)
  ) {
    return res.status(400).json({ message: 'Missing required fields!' });
  }

  next();
};


const ajv = new Ajv();
addFormats(ajv);
const schema = {
  type: 'object',
  properties: {
    username: { type: 'string'    ,  minLength: 3,    
      maxLength: 30 },
    password: { type: 'string' ,     minLength: 6,    
      maxLength: 30 },
    email: { type: 'string', format: 'email' }, 
  },
  required: ['username', 'password', 'email'],
};
const validate = ajv.compile(schema);

const AJVSignUpValidation = (req, res, next) => {
  const { username, email, password } = req.body;
  const valid = validate({ username, email, password });
  if (!valid) {
    console.log(validate.errors);
    const error = {type:validate.errors[0].instancePath,message: validate.errors[0].message}
    return res.status(400).json(error);
  }

  next();
};

export  { loginUserValidation, AJVSignUpValidation };
