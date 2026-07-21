import express, { Router } from 'express';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import User from '../model/user.js';
import { OAuth2Client } from "google-auth-library";
dotenv.config();

const route=Router();
route.post("/",async(req,res) => {
    try{
        const {credential} =req.body;
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        
        // verify Token
        const ticket =await client.verifyIdToken({
            idToken: credential,
            audience:process.env.GOOGLE_CLIENT_ID
        });

        const payload =ticket.getPayload();

        let user=await User.findOne({
            email: payload.email,
            
        });

        if(!user){

            user=await User.create({
                email:payload.email,
                name: payload.name
            })

        }

        const token=jwt.sign({id:user._id},process.env.JWT_KEY);

        res.cookie("jwtcookie", token, {
          httpOnly: true
        });

        res.json({
            success: true,
             user:{
              id:user._id,
              name:user.name,
              email:user.email
            }
        });

    }catch(err){
        console.log("Error:",err);
    }
})

export default route;