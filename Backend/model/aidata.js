import mongoose from "mongoose";

const AISchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GithubDetails",
      required: true,
      unique: true,
    },

    score: {
      type: Number,
      default: 0,
    },

    scoreReason: {
      type: String,
      default: "",
    },

    summary: {
      type: String,
      default: "",
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    improvements: {
      type: [String],
      default: [],
    },

    interviewQuestions: [
      {
        question: {
          type: String,
          default: "",
        },

        difficulty: {
          type: String,
          enum: ["Easy", "Medium", "Hard"],
          default: "Easy",
        },
      },
    ],

    skillGap: {
      overallLevel: {
        type: String,
        default: "",
      },

      summary: {
        type: String,
        default: "",
      },

      roadmap: [
        {
          order: Number,

          skill: String,

          reason: String,

          priority: {
            type: String,
            enum: ["High", "Medium", "Low"],
          },

          difficulty: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
          },

          estimatedLearningTime: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const AIData = mongoose.model("geminiData", AISchema);

export default AIData;