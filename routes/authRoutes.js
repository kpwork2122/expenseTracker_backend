import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();	
const router = express.Router();
const JWT_SECRET = "your_secret_key";

//Register
router.post("/register", async(req, res) => {
    try{
        const {username, email, password} = req.body;

        //check for existing user
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exist"});
        }

        const user = new User({username, email, password});
        await user.save();

        res.status(201).json({message: "User registered successfully!"});

    }catch(err){
        res.status(500).json({message:"Server Error!", error:err.message})
    }
});

//Login
router.post("/login", async(req, res) => {
    try{
        const {email, password} = req.body;

        //finding user
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid username"});
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid password"});
        }

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET , {expiresIn: "7d"})

        res.status(200).json({
            token,
            user:{
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Server Error!", error: err.message});
    }
});

export default router;