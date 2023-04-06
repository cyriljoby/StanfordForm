import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    select: false,
  },

  state: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'state',
  },
  county: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'county',
  },
  city: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'city',
  },
  district: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'district',
  },
  school: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'school',
  },
  role: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'teacher',
  },
  code: {
    type: String,
    trim: true,
    maxlength: 20,
    default: null,
  },
})

UserSchema.pre('save', async function () {
  // console.log(this.modifiedPaths())
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

export default mongoose.model('User', UserSchema)
