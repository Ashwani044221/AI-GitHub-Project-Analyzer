import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userlogdata",
      required: true,
    },

    projecturl: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "No description provided",
      trim: true,
    },

    stars: {
      type: Number,
      default: 0,
    },

    forks: {
      type: Number,
      default: 0,
    },

    language: {
      type: String,
      default: "Unknown",
    },

    aiStatus: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },

    lastAnalysisAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ owner: 1, projecturl: 1 }, { unique: true });

const Projectanalysis = mongoose.model("GithubDetails", projectSchema);

export default Projectanalysis;