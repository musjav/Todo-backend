import chalk from "chalk";
import express from "express";
import mongoose from "mongoose";
import { todoModel } from "./model/todoSchema.js"; // ✅ import todo schema
import cors from "cors";




const app = express();
app.use(cors());
app.use(express.json());


const PORT = 7000;

app.use(express.json());

// ✅ MongoDB URI
const MONGODB_URI = `mongodb+srv://admin:admindb@cluster0.adl0nhz.mongodb.net/`;



// ================= MongoDB Connection =================
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log(chalk.green("✅ MongoDB connected")))
  .catch((err) => console.log(chalk.red(err)));

// ================= Todo Routes =================

// Create Todo
app.post("/api/todos", async (req, res) => {
  try {
    console.log(" Incoming body:", req.body);

    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTodo = await todoModel.create({ title, description });

    console.log("✅ Todo saved:", newTodo);
    res.json({ message: "Todo created", newTodo });
  } catch (error) {
    console.error("❌ Error in POST /api/todos:", error); // full error in terminal
    res.status(500).json({
      message: "Internal server error",
      error: error.message,     // show readable error
      stack: error.stack        // show stack trace
    });
  }
});


// Get All Todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json({ message: "All todos", todos });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

// Get Single Todo
app.get("/api/todos/:id", async (req, res) => {
  try {
    const todo = await todoModel.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Single todo", todo });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

// Update Todo
app.put("/api/todos/:id", async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const updatedTodo = await todoModel.findByIdAndUpdate(
      req.params.id,
      { title, description, completed },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Todo updated", updatedTodo });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

// Delete Todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const deletedTodo = await todoModel.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

// ================= Server Start =================
app.get("/", (req, res) => {
  res.json({ message: "Todo API is running 🚀" });
});

app.listen(PORT, () => {
  console.log(
    chalk.bgCyan.bold(`🚀 Server is running on http://localhost:${PORT}`)
  );
});
