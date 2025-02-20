import jwt from 'jsonwebtoken';

export const generateToken = (id,res) => {
    const token = jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
    res.cookie('jwt', token, {//send the token to the client side
        httpOnly: true,//cross site scripting attack saver
        maxAge: 30*24*60*60*1000,
        sameSite:"strict",
        secure: process.env.NODE_ENV !== 'development'
    });
    return token;
}