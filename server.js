import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import addressRoutes from "./src/routes/addressRoutes.js";
import newsletterRoutes from "./src/routes/newsletterRoutes.js";
import heroRoutes from "./src/routes/heroRoutes.js"
import promoRoutes from "./src/routes/promoRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";


connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/promos", promoRoutes);
app.use("/api/categories", categoryRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});