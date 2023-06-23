const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { roles } = require('../config/roles');

const userSchema = new mongoose.Schema({
    fname: {
        type : String, 
        required : true,
        trim : true
    },
    lname: {
        type : String, 
        required : true,
        trim : true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
    },
    role : {
      type : String,
      enum: roles,
      default: 'user',
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    },
    
}, {timestamps : true});

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

module.exports = mongoose.model("user", userSchema)

