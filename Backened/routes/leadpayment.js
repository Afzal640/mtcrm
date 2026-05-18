import express from "express";
import { supabase } from "../config/supabaseClient.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
====================================
ADD PAYMENT
POST /api/lead-payments
====================================
*/
router.post("/", protect, async (req, res) => {
  try {
    const {
      leadId,
      amount,
      paymentType,
      paymentDate,
      note,
    } = req.body;

    const user = req.user;

    // ADMIN ONLY
    if (user.role !== "admin") {
      return res.status(403).json({
        error: "Only admin can add payments",
      });
    }

    const { data, error } = await supabase
      .from("lead_payments")
      .insert([
        {
          lead_id: leadId,
          amount,
          payment_type: paymentType,
          payment_date: paymentDate,
          note,
          created_by: user.id,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase Payment Insert Error:", error);
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
====================================
GET PAYMENTS
GET /api/lead-payments/:leadId
====================================
*/
router.get("/:leadId", protect, async (req, res) => {
  try {
    const { leadId } = req.params;

    const { data, error } = await supabase
      .from("lead_payments")
      .select("*")
      .eq("lead_id", leadId)
      .order("payment_date", {
        ascending: false,
      });

    if (error) {
      console.error("Supabase Payment Fetch Error:", error);
      return res.status(500).json(error);
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;