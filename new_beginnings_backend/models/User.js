const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String },
    city: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    is_active: { type: Boolean, default: true },
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

// Virtual for backward compatibility with SERIAL id (just returns the hex string)
// Mongoose already defines a virtual for `id` returning `_id.toString()` automatically.

module.exports = mongoose.model("User", userSchema);
