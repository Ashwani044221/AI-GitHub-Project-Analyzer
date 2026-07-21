import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            match:[/^\S+@\S+\.\S+$/, "Please enter a valid email"]
        },
        password:{
            type:String,
        }
});

const User=mongoose.model("userlogdata",userSchema);

export default User;