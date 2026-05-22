import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { supabase } from "../config/supabaseClient.js";
import { 
  getLeads, 
  createLead, 
  updateLead, 
  deleteLead,
  getFollowUpLeads
} from "../controller/leadscontroller.js";

const router = express.Router();

router.post("/:id/activities", protect, async (req, res) => {
  try {
    const leadId = req.params.id;
    const { type, title, description } = req.body;

    const user = req.user;

    const { data, error } = await supabase
      .from("lead_activities")
      .insert([
        {
          lead_id: leadId,
          type,
          title,
          description,
          created_by: user.id,
        },
      ])
      .select();

    if (error) {
      console.error("SUPABASE ACTIVITY ERROR:", error);
      return res.status(500).json(error);
    }

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post("/:id/messages", protect, async (req, res) => {
  try {
    const leadId = req.params.id;
    const { message } = req.body;

    const user = req.user; // logged in user

    const { data, error } = await supabase
      .from("lead_messages")
      .insert([
        {
          lead_id: leadId,
          sender_id: user.id,
          sender_name: user.name,
          message: message,
        },
      ])
      .select();

    if (error) return res.status(500).json(error);

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id/messages", protect, async (req, res) => {
  try {
    const leadId = req.params.id;

    const { data, error } = await supabase
      .from("lead_messages")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: true });

    if (error) return res.status(500).json(error);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET ALL LEADS & CREATE LEAD
router.get("/", protect, getLeads);
router.get("/follow-ups/all", protect, getFollowUpLeads);
router.post("/", protect, createLead);

/**
 * ✅ GET SINGLE LEAD BY ID (Supabase Version)
 */
router.get("/:id", protect, async (req, res) => {
  try {
    const { data: lead, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Frontend compatibility ke liye _id add kar rahe hain
res.json({
  ...lead,
  clientName: lead.client_name,
  contactPerson: lead.contact_person,
  company: lead.company,
  country: lead.country,
  notes: lead.notes,
  source: lead.source,
  deadline: lead.deadline,
  _id: lead.id
});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE & DELETE
router.put("/:id", protect, updateLead);
router.delete("/:id", protect, deleteLead);

export default router;