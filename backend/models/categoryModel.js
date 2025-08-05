import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Category name is required"],
      maxLength: 32,
      unique: true,             // ensures category names are not duplicated
      lowercase: true,          // stores name in lowercase to maintain uniformity
    },
  },
  {
    timestamps: true,           // auto-generates createdAt and updatedAt fields
  }
);

// Optionally, for performance on large datasets:
// categorySchema.index({ name: 1 });

export default mongoose.model("Category", categorySchema);
