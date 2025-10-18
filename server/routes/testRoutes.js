import express from "express";
import { startTest, analyzeResults } from "../controllers/testController.js";

const router = express.Router();

router.post("/start", startTest);
router.get("/analyze/:testCode", analyzeResults);

export default router;
