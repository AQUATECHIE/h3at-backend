// models/Hero.js
import mongoose from "mongoose";

const heroSchema = new mongoose.Schema({
  images: [
    {
      url: String,
      public_id: String,
    },
  ],
});

export default mongoose.model("Hero", heroSchema);