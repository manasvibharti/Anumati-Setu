const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["info", "success", "warning", "danger"],
    default: "info"
  },
  timeLabel: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
