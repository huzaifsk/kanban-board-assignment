// models/Task.js
const mongoose = require("mongoose");

// Sub-schema for Audit Logging [cite: 26, 28, 29]
const AuditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["create", "edit", "delete"],
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, 
    performedAt: {
      type: Date,
      default: Date.now,
    },
    details: Object,
  },
  { _id: false }
); 

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
      required: true,
    },
    position: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    auditLog: [AuditLogSchema], 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
