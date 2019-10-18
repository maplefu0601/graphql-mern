//resolvers/handlerGenerators/auth.js

import User from '../../../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { decode } from 'punycode';

export async function createUser(args) {
  try {
    console.log('create user:', args);
    const { email, password, confirm } = args.userInput;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(existingUser);
      throw new Error('User already exists!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword }, (err) => {
      if (err) {
        throw err;
      }
    });

    user.save();

    //create a token
    const token = jwt.sign({ id: user._id }, 'mysecret');

    return { token, password: null, ...user._doc };
  } catch (err) {
    throw err;
  }
}

export async function login(args) {
  try {
    console.log('login', args);
    const user = await User.findOne({ email: args.email });
    if (!user) throw new Error('Email does not exist');

    const passwordIsValid = await bcrypt.compareSync(
      args.password,
      user.password,
    );
    if (!passwordIsValid) throw new Error('Password incorrect');

    const token = jwt.sign({ id: user._id }, 'mysecret');
    return { token, password: null, ...user._doc };
  } catch (err) {
    throw err;
  }
}

export async function verifyToken(args) {
  try {
    console.log('verifyToken', args);
    const decoded = jwt.verify(args.token, 'mysecret');
    console.log('decoded token:', decoded);
    const user = await User.findOne({ _id: decoded.id });
    console.log(user);
    return { ...user._doc, password: null, token: args.token };
  } catch (err) {
    console.log('verifyToken ERROR:', err);
    throw err;
  }
}
