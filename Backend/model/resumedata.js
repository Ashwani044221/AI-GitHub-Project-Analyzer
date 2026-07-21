import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userlogdata",
    required: true
  },

  resumeUrl: {
    type: String,
    required: true
  },

  public_id: {
    type: String,
    required: true
  },

  ATSScore: {
    type: Number
  },

  summary: {
    type: String
  },

  strengths: {
    type: [String]
  },

  weaknesses: {
    type: [String]
  },

  missingSkills: {
    type: [String]
  },

  improvements: {
    type: [String]
  },

  interviewQuestions: {
    type: [String]
  }

}, {
  timestamps: true
});

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;