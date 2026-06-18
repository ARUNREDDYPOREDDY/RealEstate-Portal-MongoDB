const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    property_id: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String },
    status: { type: String, enum: ["new", "read", "replied"], default: "new" },
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

module.exports = mongoose.model("Enquiry", enquirySchema);
