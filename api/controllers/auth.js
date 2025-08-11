
import { createError } from "../Utils/error.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

       
        const newUser = new User({
            username: req.body.username, 
            email: req.body.email,
            password: hash,
            isAdmin: req.body.isAdmin || false, 
        });

        await newUser.save();
        res.status(200).send("User has been created successfully.");
    } catch (err) {
       
        if (err.code === 11000) {
            return next(createError(409, "Email or Username already exists."));
        }
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
    
        const user = await User.findOne({ email: req.body.email });
        if (!user) return next(createError(404, "User not found with this email."));

        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isPasswordCorrect) return next(createError(400, "Invalid credentials."));

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT
        );

        const { password, ...otherDetails } = user._doc;
        res
            .cookie("access_token", token, {
                httpOnly: true,
                
            })
            .status(200)
            .json({ ...otherDetails }); 
    } catch (err) {
        next(err);
    }
};