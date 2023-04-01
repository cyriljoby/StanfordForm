import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js';
import attachCookie from '../utils/attachCookie.js';
import { v4 as uuid } from 'uuid';


const enterCode=async(req,res)=>{
  const {code} = req.body
  if (code==''){
    throw new BadRequestError('Please Enter a Code');
  }
  console.log(code)
  const user = await User.findOne({ code });
  if (user){
    res.status(StatusCodes.OK).json({ user });
    console.log('hi')
  }
  else{
    throw new BadRequestError('Inavalid Code. Try Again or Ask Teacher for Code');
  }
}

const register = async (req, res) => {
  const { name, email, password, role, state, city, school } = req.body;
  console.log(name)
  if (!name || !email || !password  ) {
    throw new BadRequestError('please provide all values');
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError('Email already in use');
  }
  const unique_id = uuid();
  const code = unique_id.slice(0,8) 
  const user = await User.create({ name, email, password, role, state, city, school,code });

  const token = user.createJWT();
  attachCookie({ res, token });
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      state: user.state,
      city: user.city,
      school: user.school,
      name: user.name,
      role:user.role,
      password:user.password,
      code: user.code
    },

    state: user.state,
  });
};
const login = async (req, res) => {
  console.log(req.body)
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnAuthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError('Invalid Credentials');
  }
  const token = user.createJWT();
  attachCookie({ res, token });
  user.password = undefined;

  res.status(StatusCodes.OK).json({ user, state:user.state });
};
const updateUser = async (req, res) => {
  const { email, name, state, city, school } = req.body;
  if (!email || !name || !state || !city || !school) {
    throw new BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.state = state;
  user.city = city;
  user.school = school;

  await user.save();

  const token = user.createJWT();
  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({ user, state: user.location });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

const createLocation = async(req,res) =>{
  const { state, city, school } = req.body;
  if ( !state || !city || !school) {
    throw new BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.state = state;
  user.city = city;
  user.school = school;

  await user.save();

  const token = user.createJWT();
  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({ user, state: user.location });
}
export { register, login, updateUser, getCurrentUser, logout, createLocation,enterCode };
