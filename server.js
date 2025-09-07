const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Database connected successfully"))
.catch((err) => console.error("❌ Db not connected", err));

// Schema
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,   // fixed typo from require → required
    },
    description: {
        type: String,
    },
});

// Model
const Todo = mongoose.model('Todo', todoSchema);

// Routes

// Create Todo
app.post('/todos', async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTodo = new Todo({ title, description });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Get all Todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Update Todo
app.put('/todos/:id', async (req, res) => {
    try {
        const { title, description } = req.body;
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title, description },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo Not Found" });
        }

        res.json(updatedTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Delete Todo
app.delete('/todos/:id', async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo Not Found" });
        }

        res.json({ message: "Todo deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Service running on Port ${PORT}`);
});
