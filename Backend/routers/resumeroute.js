import express from 'express';
import upload from '../Middleware/multer.js';
import authMiddleware from '../Middleware/authmiddleware.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import Resume from '../model/resumedata.js';
import {extractText} from '../services/pdf.js';
import openrouteapi from "../AI Services/openrouter.js";
import analyzeResume from '../AI Services/resuemAI.js';
import gemini from '../AI Services/gemini.js';

const route=express.Router();

route.post("/upload" ,authMiddleware,upload.single("resume"), async(req,res) => {
    try{
        // Check if file exists
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: "Resume file is required.",
          });
        }

        console.log(req.file);

        //1..api call and Extract text
        const resumeText=await extractText(req.file.path);
        console.log(resumeText);

        // 2.cloudinary
        const result=await cloudinary.uploader.upload(
            req.file.path,
            {
                folder:"resume",

                resource_type:"raw"
            }
        );

        console.log(result.secure_url);

        // 3. Delete local file
        if (fs.existsSync(req.file.path)) {
           fs.unlinkSync(req.file.path);
        }

        const prompt = `
                        You are an expert ATS Resume Reviewer.
                        
                        Analyze the following resume.
                        
                        Evaluate:
                        
                        1. ATS Score (0-100)
                        2. Professional Summary
                        3. Strengths
                        4. Weaknesses
                        5. Missing Skills
                        6. Improvements
                        7. Five Interview Questions
                        
                        Rules:
                        - Return ONLY valid JSON.
                        - Do not use markdown.
                        - Do not explain anything outside JSON.
                        - ATSScore must be between 0 and 100.
                        
                        Format:
                        
                        {
                          "ATSScore":0,
                          "summary":"",
                          "strengths":[],
                          "weaknesses":[],
                          "missingSkills":[],
                          "improvements":[],
                          "interviewQuestions":[]
                        }
                        
                        Resume:
                        
                        ${resumeText}
                        `;

        const resultText = await analyzeResume(prompt);              

        const cleanText = resultText
       .replace(/```json/g, "")
       .replace(/```/g, "")
       .trim();

       let analysis;

       try{
   
        analysis=JSON.parse(cleanText);
   
       }catch(err){
   
         return res.status(500).json({
           success: false,
           message: "AI returned invalid JSON"
         });
       }

      let resume = await Resume.findOne({ owner: req.user.id });

       if (resume) {
       
           resume.resumeUrl = result.secure_url;
           resume.public_id = result.public_id;
           resume.ATSScore = analysis.ATSScore;
           resume.summary = analysis.summary;
           resume.strengths = analysis.strengths;
           resume.weaknesses = analysis.weaknesses;
           resume.missingSkills = analysis.missingSkills;
           resume.improvements = analysis.improvements;
           resume.interviewQuestions = analysis.interviewQuestions;
       
           await resume.save();
       
       } else {
       
           resume = await Resume.create({
               owner: req.user.id,
               resumeUrl: result.secure_url,
               public_id: result.public_id,
               ATSScore: analysis.ATSScore,
               summary: analysis.summary,
               strengths: analysis.strengths,
               weaknesses: analysis.weaknesses,
               missingSkills: analysis.missingSkills,
               improvements: analysis.improvements,
               interviewQuestions: analysis.interviewQuestions
           });
       
       }

        res.status(200).json({
            success:true,
            resume:resume
        })
    }catch(err){

      // Delete local file if an error occurs
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      console.error(err);

      res.status(500).json({
        success: false,
        message: err.message || "Something went wrong.",
      });
    }

});

route.get("/",authMiddleware,async(req,res) => {
  try{
    const resResume = await Resume.findOne({ owner: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success:true,
      resume: resResume
    });

  }catch(err){

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
})

export default route;