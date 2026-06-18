const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["Apartment", "Villa", "Independent House", "Land / Plot", "Commercial"],
    },
    price: { type: Number, required: true },
    area: { type: Number, required: true },
    beds: { type: Number, default: 0 },
    baths: { type: Number, default: 0 },
    city: { type: String, required: true },
    locality: { type: String },
    address: { type: String },
    description: { type: String },
    owner_name: { type: String },
    owner_phone: { type: String },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, default: 0.0 },
    review_count: { type: Number, default: 0 },
    badge: { type: String, enum: ["featured", "new", "hot"], default: "new" },
    emoji: { type: String, default: "🏠" },
    lat: { type: Number },
    lng: { type: Number },
    status: {
      type: String,
      enum: ["active", "pending", "sold", "rejected"],
      default: "active",
    },
    amenities: [{ type: String }],
    images: [
      {
        url: { type: String, required: true },
        is_primary: { type: Boolean, default: false },
      },
    ],
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

module.exports = mongoose.model("Property", propertySchema);
