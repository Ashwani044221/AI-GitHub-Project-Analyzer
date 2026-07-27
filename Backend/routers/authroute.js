import express, { json, Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/user.js';
import userSchema from '../validators/authvalidate.js';
import validate from '../Middleware/validate.js';
import authMiddleware from '../Middleware/authmiddleware.js';
import { success } from 'zod';


const route =Router();

route.post("/register" ,validate(userSchema), async(req,res) => {
     try{
      const {name,email,password} =req.body;
      
      const existinguser=await User.findOne({email});
      if(existinguser){
        return res.status(400).json({message:"user already exists"});
      }

      const hashpassword =await bcrypt.hash(password,10);

      const newusers = new User({
        name,
        email,
        password:hashpassword
      });

      await newusers.save();
      res.json({ message: "User registered successfully" });
     }catch(err){
       console.log("FULL ERROR:", err);
       console.log("RESPONSE:", err.response);
       console.log("DATA:", err.response?.data);

       alert(JSON.stringify(err.response?.data));
     }
});

route.post("/login", async(req,res) => {
    try{
        const {email,password}=req.body;

        const user=await User.findOne({email});
        if(!user)  return res.status(400).json({ error: "User not found" });

        const comparepass=await bcrypt.compare(password,user.password);
        if (!comparepass) return res.status(400).json({ error: "Password not match" });

        const playload={id:user.id, email:user.email};
        const token=jwt.sign(playload,process.env.JWT_KEY,{expiresIn : "7d"});

        res.cookie("jwtcookie", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ message: "Login successful",token, user: {
          id: user._id,
          name: user.name,
          email: user.email,
        }});
    }catch(err){
         res.status(400).json({ error: err.message });
    }
});

route.get("/me",authMiddleware, (req,res) => {
      res.json({
        success:true,
        user:req.user
      });
});

export default route;