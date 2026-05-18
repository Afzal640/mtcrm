import express from "express";
import { supabase } from "../config/supabaseClient.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadfile.js";
import { uploadToSupabase } from "../utils/uploadToSupabase.js";

const router = express.Router();

// 📌 GET ALL COMMENTS FOR A PROJECT (Admin + Production)
router.get("/:projectId", protect, authorizeRoles("admin", "production"), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("project_comments")
      .select("*")
      .eq("project_id", req.params.projectId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 POST A NEW COMMENT (with optional file/image/video attachment)
router.post("/", protect, upload.single("file"), async (req, res) => {
  try {
    const { projectId, message } = req.body;

    let fileUrl = null;
    let fileType = null;
    let fileName = null;

    if (req.file) {
      fileUrl = await uploadToSupabase(req.file);
      fileName = req.file.originalname;
      const mime = req.file.mimetype;
      if (mime.startsWith("image/")) fileType = "image";
      else if (mime.startsWith("video/")) fileType = "video";
      else fileType = "file";
    }

    if ((!message || !message.trim()) && !fileUrl) {
      return res.status(400).json({ message: "Message ya file zaroor hona chahiye" });
    }

    const { data, error } = await supabase
      .from("project_comments")
      .insert([{
        project_id: projectId,
        sender_name: req.user.name,
        sender_role: req.user.role,
        message: message || "",
        file_url: fileUrl,
        file_type: fileType,
        file_name: fileName,
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 📌 DELETE COMMENT — SIRF ADMIN KAR SAKTA HAI
router.delete("/:commentId", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    // Pehle comment fetch karein taake file_url milein
    const { data: comment, error: fetchError } = await supabase
      .from("project_comments")
      .select("file_url, file_name")
      .eq("id", req.params.commentId)
      .single();

    if (fetchError || !comment) {
      return res.status(404).json({ message: "Comment nahi mila" });
    }

    // Agar koi file attached thi toh Supabase Storage se bhi delete karein
    if (comment.file_url) {
      try {
        // File ka naam URL se extract karein
        const urlParts = comment.file_url.split("/");
        const storageFileName = urlParts[urlParts.length - 1];
        await supabase.storage.from("project-files").remove([storageFileName]);
      } catch (storageErr) {
        console.warn("Storage delete warning:", storageErr.message);
        // Storage error hone par bhi DB record delete karein
      }
    }

    // Database se comment delete karein
    const { error: deleteError } = await supabase
      .from("project_comments")
      .delete()
      .eq("id", req.params.commentId);

    if (deleteError) throw deleteError;

    res.json({ message: "Comment successfully delete ho gaya", id: req.params.commentId });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
