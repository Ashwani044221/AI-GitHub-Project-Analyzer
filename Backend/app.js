import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";
import authroute from "./routers/authroute.js";
import projectroute from './routers/projectroute.js';
import cookieParser from "cookie-parser";
import resumeroute from './routers/resumeroute.js';
import googleauth from "./routers/googleauth.js";


dotenv.config();
const app=express();

//connectdb
ConnectDB();

//Middelwares
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://ai-git-hub-project-analyzer-beta.vercel.app"
    ],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/analyzer" ,authroute);
app.use("/api/analyzer" ,projectroute);
app.use("/api/resume",resumeroute);
app.use("/api/auth/google",googleauth);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT =process.env.PORT || 5000;
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
});