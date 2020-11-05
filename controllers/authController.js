const crypto = require('crypto');
const User = require('../models/userModel');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') options.secure = true;
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
    });
}

const AuthController = () => {
  //@desc      create user
  //@route     POST /api/v1/auth/register
  //@access    Public
  const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    sendTokenResponse(user, 201, res);
  });

  //@desc      Login user
  //@route     POST /api/v1/auth/login
  //@access    Public
  const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new ErrorResponse('Please provide a valid password and email', 400));
    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new ErrorResponse('Invalid credentials', 401));
    const isMatch = user.matchPassword(password);
    if (!isMatch) return next(new ErrorResponse('Invalid credentials', 401));
    sendTokenResponse(user, 200, res);
  });

  //@desc      Get current logged user
  //@route     GET /api/v1/auth/me
  //@access    Public
  const getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  });

  //@desc      Logout User
  //@route     POST /api/v1/auth/me
  //@access    Public
  const logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    return res.status(200).json({
      success: true,
      data: {},
    });
  });

  //@desc      Update User Details
  //@route     PUT /api/v1/auth/updatedetails
  //@access    Public
  const updateDetails = asyncHandler(async (req, res, next) => {
    const { email, name } = req.body;
    const fieldsToUpdate = { name, email };
    const user = await User.findByIdAndUpdate(req.body, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      success: true,
      data: user,
    });
  });

  //@desc      Update User Password 
  //@route     PUT /api/v1/auth/updatepassword
  //@access    Public
  const updatePassword = asyncHandler(async (req, res, next) => {
    const { newPassword, currentPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    const isMatch = user.matchPassword(currentPassword);
    if (!isMatch) return next(new ErrorResponse('password is incorrect', 401));
    user.password = newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
  });

  //@desc      Forgot password
  //@route     PUT /api/v1/auth/forgotpassword
  //@access    Private
  const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new ErrorResponse('There is no user with that email', 404));

    const token = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });


    const isMatch = user.matchPassword(currentPassword);
    if (!isMatch) return next(new ErrorResponse('password is incorrect', 401));
    user.password = newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
  });

  return {
    forgotPassword,
    updateDetails,
    updatePassword ,
    register,
    login,
    getMe,
    logout,
  }
};

module.exports = AuthController;
