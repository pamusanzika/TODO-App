const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description:{
    type: String,
    trim: true,
    default: "",
  },
  done:{
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Todo', TodoSchema);    
  