import { generateToken } from "../utils/utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";


const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ msg: "Please fill in all fields." });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ msg: "Invalid email." });
    }
    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters long." });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: passwordHash,
    });

    await newUser.save();
    
    // Generate token
    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });

  } catch (error) {
    console.log("signup error", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credential" });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credential" });
      } else {
        generateToken(user._id, res);
        res.status(200).json({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          profilePic: user.profilePic,
          token: generateToken(user._id, res),
        });
      }
    }
  } catch (error) {
    console.log("login error", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const id = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic required" });
    }

    const uploadedResponse = await cloudinary.uploader.upload(profilePic);
    
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      {
        profilePic: uploadedResponse.secure_url
      }, 
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser); // Fixed typo: req.status to res.status
  } catch (error) {
    console.log("update profile error", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
export const checkAuth = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    res.status(200).json(req.user);
  } catch (error) {
    console.log("checkAuth error", error.message);
    return res.status(500).json({ msg: "Server error" });
  }
};