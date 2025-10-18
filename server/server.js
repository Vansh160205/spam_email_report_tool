// server.js

import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import testRoutes from "./routes/testRoutes.js";
// The connectDB import is now gone!


const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Email Spam Report Tool API Running ✅"));
app.use("/api/test", testRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));