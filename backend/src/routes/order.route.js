import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/", protectRoute, getOrder);

export default router;
