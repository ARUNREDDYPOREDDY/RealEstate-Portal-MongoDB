const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    property_id: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
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

// Compound index for uniqueness
favoriteSchema.index({ user_id: 1, property_id: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
