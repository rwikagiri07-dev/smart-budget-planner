import User from "../models/User.js";
import bcrypt from "bcryptjs";

/*
|--------------------------------------------------------------------------
| Get User Settings
|--------------------------------------------------------------------------
*/

export const getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,

      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update User Settings
|--------------------------------------------------------------------------
*/

export const updateUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.name = req.body.name ?? user.name;

    user.phone = req.body.phone ?? user.phone;

    user.currency = req.body.currency ?? user.currency;

    user.timezone = req.body.timezone ?? user.timezone;

    if (req.body.darkMode !== undefined) {
      user.darkMode = req.body.darkMode;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,

      message: "Settings updated successfully",

      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,

        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,

      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
