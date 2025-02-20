import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';


export const protectRoute = async (req, res, next) => {//calling updateProfile function from authController.js
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "You are not logged in" });
        }else{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);//this will decode the token
            if (!decoded) {
                return res.status(401).json({ message: "Invalid token" });
            }
            const user = await User.findById(decoded.id).select('-password');//this will find the user by id and select all the fields except password
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }
            req.user = user;
            next();
        }   
    } catch (error) {
        console.log("Auth middleware error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}