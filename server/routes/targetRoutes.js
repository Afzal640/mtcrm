import express from "express";
import {
  assignTarget,
  getTargets,
  updateTargetProgress,
  assignCustomWeekly,
  deleteTarget
} from "../controller/targetcontroller.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// 🎯 TARGET ROUTES
router.post("/assign", protect, authorizeRoles("admin"), assignTarget);
router.post("/assign-custom-weekly", protect, authorizeRoles("admin"), assignCustomWeekly);
router.get("/", protect, getTargets);
router.put("/update", protect, updateTargetProgress);
router.delete("/:id", protect, authorizeRoles("admin"), deleteTarget);

export default router;