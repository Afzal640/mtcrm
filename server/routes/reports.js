import express from "express";
import { supabase } from "../config/supabaseClient.js";

const router = express.Router();

router.get("/overview", async (req, res) => {
  try {

    // 1. Fetch Leads
    const { data: leads, error: leadError } = await supabase.from("leads").select("*");
    if (leadError) throw leadError;

    // 2. Fetch Payments (Separately to avoid relationship errors)
    const { data: payments, error: payError } = await supabase.from("lead_payments").select("*");
    if (payError) {
       console.warn("Lead payments table error or not found. Skipping payments.");
    }

    // 3. Fetch Activities
    const { data: activities, error: actError } = await supabase.from("activities").select("id");
    if (actError) throw actError;

    // Manual Join for Payments list
    const paymentsWithLeads = (payments || []).map(p => {
      const lead = leads.find(l => (l.id === p.lead_id || l._id === p.lead_id));
      return { 
        ...p, 
        leads: lead ? { 
          client_name: lead.client_name || lead.clientName, 
          budget: lead.budget,
          status: lead.status
        } : { client_name: "Unknown", budget: 0, status: "new" } 
      };
    });

    // Calculations
    const closedDeals = leads.filter(l => l.status === "closed-won");
    const totalRevenue = (payments || []).reduce((sum, p) => sum + Number(p.amount || 0), 0);
    
    // Budget Revenue (Pipeline) - Sanitizing budget strings
    const pipelineRevenue = closedDeals.reduce((sum, l) => {
      const b = l.budget ? String(l.budget).replace(/[^0-9.]/g, "") : 0;
      return sum + (Number(b) || 0);
    }, 0);

    const pendingLeads = leads.filter(
      l => l.status !== "closed-won" && l.status !== "closed-lost" && l.status !== "complete"
    );

    const followupLeads = leads.filter(l => l.status === "discussing" || l.status === "proposal");

    res.json({
      totalLeads: leads.length,
      closedDeals: closedDeals.length,
      revenue: totalRevenue,
      pipelineRevenue: pipelineRevenue,
      pendingLeads: pendingLeads.length,
      followupLeads: followupLeads.length,
      totalActivities: activities.length,
      recentPayments: paymentsWithLeads
    });

  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({
      error: err.message,
      details: err
    });
  }
});

export default router;