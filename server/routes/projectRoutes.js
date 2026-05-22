import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProjectStatus,
  addProjectFile,
  createProjectFromLead,
  handleProjectFileUpload,
  updateProject,
  deleteProject,
  deleteProjectFile
} from "../controller/projectcontroller.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadfile.js";

const router = express.Router();

// --- ROUTES ---

// 1. ✅ CONVERT LEAD TO PROJECT (Admin Only)
router.post("/from-lead", protect, authorizeRoles("admin"), createProjectFromLead);

// 2. ✅ GET ALL PROJECTS (Filtered for Admin/Production/Sales)
router.get("/", protect, authorizeRoles("admin", "production", "sales"), getProjects);

// 3. ✅ CREATE PROJECT (Admin Only)
router.post("/", protect, authorizeRoles("admin"), createProject);

// 4. ✅ GET SINGLE PROJECT
router.get("/:id", protect, getProjectById);

// 5. ✅ UPDATE PROJECT (Admin Only for full edit)
router.put("/:id", protect, authorizeRoles("admin"), updateProject);

// 6. ✅ DELETE PROJECT (Admin Only)
router.delete("/:id", protect, authorizeRoles("admin"), deleteProject);

// 7. ✅ UPDATE STATUS (Admin/Production)
router.patch("/:id/status", protect, authorizeRoles("admin", "production"), updateProjectStatus);

// 8. ✅ UPLOAD PROJECT FILE (Using Supabase Storage)
router.post("/:id/upload", protect, upload.single("file"), handleProjectFileUpload);

// 9. ✅ ADD PROJECT FILE RECORD (Database only)
router.post("/:id/files", protect, authorizeRoles("admin", "production"), addProjectFile);

// 10. ✅ DELETE PROJECT FILE (Admin Only)
router.delete("/:id/files", protect, authorizeRoles("admin"), deleteProjectFile);

export default router;