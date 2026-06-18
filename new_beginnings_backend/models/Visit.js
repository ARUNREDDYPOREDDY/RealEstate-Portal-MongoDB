const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema(
  {
    property_id: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    phone: { type: String },
    visit_date: { type: Date, required: true },
    visit_time: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        if (ret.visit_date instanceof Date) {
          ret.visit_date = ret.visit_date.toISOString().split("T")[0];
        }
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Visit", visitSchema);
