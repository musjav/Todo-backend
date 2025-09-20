// model/todoSchema.js
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const todoModel = mongoose.model("Todo", todoSchema);
