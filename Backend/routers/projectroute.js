import express, { response } from "express";
import axios from 'axios';
import Projectanalysis from "../model/projectanalysis.js";
import authMiddleware from "../Middleware/authmiddleware.js";
import AIData from "../model/aidata.js";
import backgroundAI from "../AI Services/backgroundAI.js";
import projvalidate from "../Middleware/projvalid.js";
import projectschema from "../validators/urlvalidation.js";

const route =express.Router();

//create 
route.post("/project",projvalidate(projectschema),authMiddleware, async(req,res) => {
  try{
    // 1. input from frontend https://github.com/ 3.split facebook / 4.split react
    const {projecturl}=req.body;

    //2.split
    const parts=projecturl.split("/");

    //3.owner
    const owner=parts[3];

    //4.repo
    const repo=parts[4];

    //5. Github api call
    const response=await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
    
    //6.post to database
    let projectDetails = await Projectanalysis.findOne({
      owner: req.user.id,
      projecturl
    });

    if (!projectDetails) {

      projectDetails = new Projectanalysis({

        owner: req.user.id,

        projecturl,

        name: response.data.name,

        description: response.data.description,

        stars: response.data.stargazers_count,

        forks: response.data.forks_count,

        language: response.data.language,

        aiStatus: "processing"

      });

      await projectDetails.save();
    }

    const existAnalysis = await AIData.findOne({
      projectId: projectDetails._id
    });

    if (existAnalysis) {

      return res.status(200).json({
        success: true,
        project: projectDetails,
        analysis: existAnalysis,
        message: "Already analyzed"
      });

    }

    res.status(200).json({

      success: true,

      project: projectDetails,

      message: "Project Added Successfully"

    });

    //7.gemini api and promt
   const prompt = `
                    Analyze this GitHub project.
                    
                    Return ONLY valid JSON.
                    
                    Rules:
                    - Do not include markdown.
                    - Do not include code fences.
                    - Do not include explanations.
                    - Return only a valid JSON object.
                    - Generate exactly 10 interview questions.
                    - Generate exactly 8 recommended skills to learn.
                    
                    Use this JSON format exactly:
                    
                    {
                      "score": 0,
                      "scoreReason": "",
                      "summary": "",
                      "strengths": [],
                      "weaknesses": [],
                      "improvements": [],
                      "interviewQuestions": [
                        {
                          "question": "",
                          "difficulty": "Easy"
                        }
                      ],
                      "skillGap": {
                        "overallLevel": "",
                        "summary": "",
                        "roadmap": [
                          {
                            "order": 1,
                            "skill": "",
                            "reason": "",
                            "priority": "High",
                            "difficulty": "Beginner",
                            "estimatedLearningTime": ""
                          }
                        ]
                      }
                    }
                    
                    Scoring Guidelines:
                    - Give an overall project quality score between 0 and 100.
                    - Consider:
                      - Project complexity
                      - Code quality
                      - Documentation
                      - Practical usefulness
                      - Portfolio value
                      - Technologies used
                      - GitHub repository quality
                    - Explain briefly why this score was given in "scoreReason".
                    
                    Analysis Guidelines:
                    - Write a concise project summary.
                    - Identify the main strengths.
                    - Identify the major weaknesses.
                    - Suggest practical improvements that would make this project production-ready.
                    
                    Interview Question Guidelines:
                    - Act as a Senior Software Engineer interviewing the developer who built this project.
                    - Generate questions specific to THIS project.
                    - Focus on implementation instead of theory.
                    - Ask questions that require the developer to explain design decisions.
                    - Include a balanced mix of Easy, Medium, and Hard questions.
                    - Cover topics such as:
                      - Project architecture
                      - Backend logic
                      - APIs
                      - Database
                      - Authentication & Authorization (if applicable)
                      - Security
                      - Error handling
                      - Scalability
                      - Deployment
                      - Performance
                    - Avoid generic questions like:
                      - "What is JavaScript?"
                      - "What is MongoDB?"
                      - "Tell me about yourself."
                    - Every question should feel like a real SDE internship or placement interview question.
                    
                    Skill Gap Guidelines:
                    - Analyze the project and identify the developer's likely skill gaps.
                    - Recommend exactly 8 skills that would most improve the developer.
                    - Do NOT recommend technologies already implemented well in the project.
                    - Focus on practical software engineering skills.
                    - Arrange the skills in the order they should be learned.
                    - For every skill provide:
                      - order
                      - skill
                      - reason
                      - priority (High, Medium, Low)
                      - difficulty (Beginner, Intermediate, Advanced)
                      - estimatedLearningTime (for example: "3-5 days", "1 week", "2 weeks")
                    - Determine the developer's overall level as one of:
                      - Beginner
                      - Beginner+
                      - Intermediate
                      - Intermediate+
                      - Advanced
                    - Write a short summary describing the most important areas the developer should focus on next.
                    
                    Project Information:
                    
                    Project Name: ${response.data.name}
                    Description: ${response.data.description}
                    Primary Language: ${response.data.language}
                    Stars: ${response.data.stargazers_count}
                    Forks: ${response.data.forks_count}
                    `;

   backgroundAI(projectDetails, prompt).catch((err) => {
      console.error("Background AI Error:", err.message);
   });

  }catch(err){

    console.log(err);

    return res.status(500).json({
      success:false,
      message:"Internal Server Error"
    });
  }
});

// read 
route.get("/projects",authMiddleware, async (req, res) => {
  try {

    const projects = await Projectanalysis.find({
      owner: req.user.id
    });

    res.status(200).json({
      success: true,
      projects
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
});

route.get("/project/:projectId",authMiddleware, async(req,res) => {
    try{
      const {projectId} =req.params;

      const project = await Projectanalysis.findOne({
       _id: projectId,
       owner: req.user.id
      });

      if (!project) {
        return res.status(404).json({
        success: false,
        message: "Project not found"
        });
      }

      const AIresponse= await AIData.findOne({projectId});

      res.json({success:true, analysis: AIresponse , project});
    }catch(err){

      res.status(500).json({error:err.message});

    }
});

route.post("/project/:projectId/retry", authMiddleware, async (req, res) => {
  try {

    const { projectId } = req.params;

    const project = await Projectanalysis.findOne({
      _id: projectId,
      owner: req.user.id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const existAI = await AIData.findOne({
      projectId
    });

    if (existAI) {
      await AIData.deleteOne({
        projectId
      });
    }

    project.aiStatus = "processing";
    await project.save();

    const prompt = `
                    Analyze this GitHub project.
                    
                    Return ONLY valid JSON.
                    
                    Rules:
                    - Do not include markdown.
                    - Do not include code fences.
                    - Do not include explanations.
                    - Return only a valid JSON object.
                    - Generate exactly 10 interview questions.
                    - Generate exactly 8 recommended skills to learn.
                    
                    Use this JSON format exactly:
                    
                    {
                      "score": 0,
                      "scoreReason": "",
                      "summary": "",
                      "strengths": [],
                      "weaknesses": [],
                      "improvements": [],
                      "interviewQuestions": [
                        {
                          "question": "",
                          "difficulty": "Easy"
                        }
                      ],
                      "skillGap": {
                        "overallLevel": "",
                        "summary": "",
                        "roadmap": [
                          {
                            "order": 1,
                            "skill": "",
                            "reason": "",
                            "priority": "High",
                            "difficulty": "Beginner",
                            "estimatedLearningTime": ""
                          }
                        ]
                      }
                    }
                    
                    Scoring Guidelines:
                    - Give an overall project quality score between 0 and 100.
                    - Consider:
                      - Project complexity
                      - Code quality
                      - Documentation
                      - Practical usefulness
                      - Portfolio value
                      - Technologies used
                      - GitHub repository quality
                    - Explain briefly why this score was given in "scoreReason".
                    
                    Analysis Guidelines:
                    - Write a concise project summary.
                    - Identify the main strengths.
                    - Identify the major weaknesses.
                    - Suggest practical improvements that would make this project production-ready.
                    
                    Interview Question Guidelines:
                    - Act as a Senior Software Engineer interviewing the developer who built this project.
                    - Generate questions specific to THIS project.
                    - Focus on implementation instead of theory.
                    - Ask questions that require the developer to explain design decisions.
                    - Include a balanced mix of Easy, Medium, and Hard questions.
                    - Cover topics such as:
                      - Project architecture
                      - Backend logic
                      - APIs
                      - Database
                      - Authentication & Authorization (if applicable)
                      - Security
                      - Error handling
                      - Scalability
                      - Deployment
                      - Performance
                    - Avoid generic questions like:
                      - "What is JavaScript?"
                      - "What is MongoDB?"
                      - "Tell me about yourself."
                    - Every question should feel like a real SDE internship or placement interview question.
                    
                    Skill Gap Guidelines:
                    - Analyze the project and identify the developer's likely skill gaps.
                    - Recommend exactly 8 skills that would most improve the developer.
                    - Do NOT recommend technologies already implemented well in the project.
                    - Focus on practical software engineering skills.
                    - Arrange the skills in the order they should be learned.
                    - For every skill provide:
                      - order
                      - skill
                      - reason
                      - priority (High, Medium, Low)
                      - difficulty (Beginner, Intermediate, Advanced)
                      - estimatedLearningTime (for example: "3-5 days", "1 week", "2 weeks")
                    - Determine the developer's overall level as one of:
                      - Beginner
                      - Beginner+
                      - Intermediate
                      - Intermediate+
                      - Advanced
                    - Write a short summary describing the most important areas the developer should focus on next.
                    
                    Project Information:
                    
                    Project Name: ${response.data.name}
                    Description: ${response.data.description}
                    Primary Language: ${response.data.language}
                    Stars: ${response.data.stargazers_count}
                    Forks: ${response.data.forks_count}
                    `;

    backgroundAI(project, prompt).catch((err) => {
      console.log(err.message);
    });

    res.json({
      success: true,
      message: "AI Analysis Started Again"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
});

//Delete
route.delete("/:id",authMiddleware ,async(req,res) => {
    try{
      const deleteproject=await Projectanalysis.findOneAndDelete({_id:req.params.id,owner: req.user.id});

      if(!deleteproject){
        return res.status(404).json({message:"Project Can Not Found"});
      }

      await AIData.deleteOne({
         projectId: req.params.id
      });

      res.json({message:"Project Delete Successfully"});
    }catch(err){
      console.error(err);
      res.status(500).json({ message: "Error deleting project" });
    }
});

export default route;