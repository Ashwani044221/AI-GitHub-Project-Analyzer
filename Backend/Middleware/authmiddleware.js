import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const authMiddleware=(req,res,next) => {
    const token=req.cookies.jwtcookie;

    if(!token){
        return res.status(401).json({
            message:"Login First"
        })
    }

    try{
      const decoded=jwt.verify(token,process.env.JWT_KEY);

    req.user=decoded;

    next();
    }catch(err){
        return res.status(401).json({
           message: "Invalid token"
        });
    }
    
}

export default authMiddleware;