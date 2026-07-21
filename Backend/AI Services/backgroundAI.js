import AIData from "../model/aidata.js";
import Projectanalysis from "../model/projectanalysis.js";
import analyzeProject from "./projectAI.js";

const backgroundAI = async (projectDetails, prompt) => {
  try {

    const result = await analyzeProject(prompt);

    console.log("AI Generated Successfully");

    const cleanText = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const analysis = JSON.parse(cleanText);

    const openDetail = new AIData({

      projectId: projectDetails._id,

      summary: analysis.summary,

      score: analysis.score,

      scoreReason: analysis.scoreReason,

      strengths: analysis.strengths,

      weaknesses: analysis.weaknesses,

      improvements: analysis.improvements,

      interviewQuestions: analysis.interviewQuestions,

      skillGap: analysis.skillGap

    });

    await openDetail.save();

    await Projectanalysis.findByIdAndUpdate(
      projectDetails._id,
      {
        aiStatus: "completed"
      }
    );

    console.log("AI Saved Successfully");

  } catch (err) {

    console.log("AI Generation Failed");

    console.log(err.message);

    await Projectanalysis.findByIdAndUpdate(
      projectDetails._id,
      {
        aiStatus: "failed"
      }
    );

  }
};

export default backgroundAI;