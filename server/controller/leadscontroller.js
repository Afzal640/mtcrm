import { supabase } from "../config/supabaseClient.js";

// ✅ GET LEADS
export const getLeads = async (req, res) => {
  try {
    const user = req.user;
    let query = supabase
      .from('leads')
      .select(`
        *,
        createdBy:users!leads_created_by_fkey(id, name, email),
        assignedTo:users!leads_assigned_to_fkey(id, name, email)
      `)
      .order('created_at', { ascending: false });

    if (user.role === "sales") {
      query = query.or(`assigned_to.eq.${user.id},created_by.eq.${user.id}`);
    } else if (user.role !== "admin") {
      return res.json([]);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ CREATE LEAD
export const createLead = async (req, res) => {
  try {
    const user = req.user;
    const body = req.body;
    
    const leadData = {
      client_name: body.clientName,
      company: body.company,
      country: body.country,
      contact_person: body.contactPerson,
      email: body.email,
      phone: body.phone,
      service: body.service,
      budget: body.budget,
      status: body.status || 'new',
      notes: body.notes,
      source: body.source,
      deadline: body.deadline,
      created_by: user.id,
      assigned_to: user.role === "sales" ? user.id : body.assignedTo
    };

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (leadError) {
      console.error("SUPABASE CREATE ERROR:", leadError);
      throw leadError;
    }

    await supabase.from('activities').insert([{
      type: "message",
      client_name: lead.client_name,
      notes: `New lead added by ${user.name || "team"}.`,
      outcome: "Lead Created",
      created_by: user.id,
      lead_id: lead.id
    }]);

    res.json({
      ...lead,
      clientName: lead.client_name,
      contactPerson: lead.contact_person,
      company: lead.Company,
      country: lead.Country,
      _id: lead.id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE LEAD
export const updateLead = async (req, res) => {
  try {
    const body = req.body;
    const updateData = {};
    
    if (body.clientName) updateData.client_name = body.clientName;
    if (body.contactPerson) updateData.contact_person = body.contactPerson;
    if (body.company) updateData.company = body.company;
    if (body.country) updateData.country = body.country;
    if (body.email) updateData.email = body.email;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.service) updateData.service = body.service;
    if (body.budget) updateData.budget = body.budget;
    if (body.status) {
      updateData.status = body.status;
      updateData.status_updated_at = new Date().toISOString();
    }
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.source) updateData.source = body.source;
    if (body.deadline) updateData.deadline = body.deadline;
    if (body.assignedTo) updateData.assigned_to = body.assignedTo;

    const { data: lead, error } = await supabase
      .from("leads")
      .update(updateData)
      .eq("id", req.params.id)
      .select(`
        *,
        createdBy:users!leads_created_by_fkey(id, name, email),
        assignedTo:users!leads_assigned_to_fkey(id, name, email)
      `)
      .single();

    if (error) {
      console.error("SQL UPDATE ERROR:", error);
      throw error;
    }

    res.json({
      ...lead,
      clientName: lead.client_name,
      contactPerson: lead.contact_person,
      company: lead.company,
      country: lead.country,
      _id: lead.id
    });

  } catch (error) {
    console.error("SQL UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
// ✅ DELETE LEAD
export const deleteLead = async (req, res) => {
  try {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET FOLLOW-UP LEADS (Stuck for 3+ days)
export const getFollowUpLeads = async (req, res) => {
  try {
    const user = req.user;
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    let query = supabase
      .from('leads')
      .select('*')
      .neq('status', 'closed-won')
      .neq('status', 'closed-lost')
      .neq('status', 'complete')
      .lt('status_updated_at', threeDaysAgo.toISOString());

    if (user.role === "sales") {
      query = query.eq('assigned_to', user.id);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};