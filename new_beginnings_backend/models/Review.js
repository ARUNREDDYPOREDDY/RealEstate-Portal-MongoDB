const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    property_id: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    role_label: { type: String, default: "Member" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review_text: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Review", reviewSchema);
