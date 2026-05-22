import express from "express";
import { supabase } from "../config/supabaseClient.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
=====================================
CREATE TASK
=====================================
*/
router.post("/", protect, async (req, res) => {
  try {
    const { projectId, name, assignedTo } = req.body;

    const { data, error } = await supabase
      .from("project_tasks")
      .insert([
        {
          project_id: projectId,
          name: name,
          assigned_to: assignedTo || null,
          client_status: 'pending'
        },
      ])
      .select(`
        *,
        assignedTo:users!project_tasks_assigned_to_fkey(id, name)
      `);

    if (error) {
      return res.status(500).json(error);
    }

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
=====================================
GET TASKS
=====================================
*/
router.get("/:projectId", protect, async (req, res) => {
  try {
    const { projectId } = req.params;

    const { data, error } = await supabase
      .from("project_tasks")
      .select(`
        *,
        assignedTo:users!project_tasks_assigned_to_fkey(id, name)
      `)
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json(error);
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
=====================================
UPDATE TASK STATUS
=====================================
*/
router.put("/:taskId", protect, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, progress, clientStatus } = req.body;

    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (clientStatus !== undefined) updateData.client_status = clientStatus;

    const { data, error } = await supabase
      .from("project_tasks")
      .update(updateData)
      .eq("id", taskId)
      .select(`
        *,
        assignedTo:users!project_tasks_assigned_to_fkey(id, name)
      `);

    if (error) {
      return res.status(500).json(error);
    }

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;