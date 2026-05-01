const Todo = require("../models/Todo");

// GET all todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE todo
exports.createTodo = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required." });
    }

    const todo = new Todo({
      title: title.trim(),
      description: description ? description.trim() : "",
      dueDate: dueDate || null,
    });

    const saved = await todo.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE todo
exports.updateTodo = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required." });
    }

    const updated = await Todo.findByIdAndUpdate(
      req.params.id,
      { title: title.trim(), description: description ? description.trim() : "", dueDate: dueDate || null },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Todo not found." });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TOGGLE done
exports.toggleDone = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found." });
    }

    todo.done = !todo.done;
    await todo.save();

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE todo
exports.deleteTodo = async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Todo not found." });
    }

    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
