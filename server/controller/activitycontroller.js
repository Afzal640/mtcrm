import { supabase } from "../config/supabaseClient.js";

// ✅ GET ALL ACTIVITIES
export const getActivities = async (req, res) => {
  try {
    const user = req.user;
    
    // Query start karein aur 'createdBy' user ka naam join karein
    let query = supabase
      .from('activities')
      .select(`
        *,
        createdBy:users!activities_created_by_fkey(name)
      `)
      .neq('outcome', 'dismissed')
      .order('created_at', { ascending: false });

    // Role-based filtering
    if (user.role !== "admin") {
      query = query.eq('created_by', user.id);
    } else if (req.query.userId) {
      // Admin filter for specific user
      query = query.eq('created_by', req.query.userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error fetching activities" });
  }
};

// ✅ CREATE ACTIVITY
export const createActivity = async (req, res) => {
  try {
    const user = req.user;
    
    // 1. Activity data prepare karein (SQL snake_case columns ke mutabiq)
    const activityData = {
      type: req.body.type,
      client_name: req.body.clientName,
      company: req.body.company,
      date: req.body.date,
      time: req.body.time,
      notes: req.body.notes,
      outcome: req.body.outcome,
      created_by: user.id,
      lead_id: req.body.leadId || null,
      next_follow_up_date: req.body.nextFollowUpDate || null
    };

    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .insert([activityData])
      .select()
      .single();

    if (activityError) throw activityError;

    // 2. 🔥 AUTOMATIC TARGET UPDATE
    if (user.role === "sales") {
      let targetType = "followups";
      if (activity.type === "call") targetType = "calls";
      if (activity.type === "meeting") targetType = "meetings";

      // SQL Upsert Logic: Pehle check karein record hai ya nahi
      const { data: existingTarget } = await supabase
        .from('targets')
        .select('*')
        .match({ user_id: user.id, period: 'daily', type: targetType })
        .single();

      if (existingTarget) {
        // Agar hai to increment karein
        await supabase
          .from('targets')
          .update({ current_value: (existingTarget.current_value || 0) + 1 })
          .eq('id', existingTarget.id);
      } else {
        // Agar nahi hai to naya insert karein (Upsert)
        await supabase
          .from('targets')
          .insert([{
            user_id: user.id,
            period: "daily",
            type: targetType,
            target_value: 10,
            current_value: 1
          }]);
      }
    }

    res.status(201).json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error creating activity" });
  }
};

// ✅ DELETE ACTIVITY (ADMIN ONLY)
export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized to delete" });
    }

    const { error } = await supabase
      .from('activities')
      .update({ outcome: 'dismissed' })
      .eq('id', id);

    if (error) throw error;
    res.json({ msg: "Activity deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error deleting activity" });
  }
};

// ✅ DELETE ALL ACTIVITIES (ADMIN ONLY)
export const deleteAllActivities = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const { error } = await supabase
      .from('activities')
      .update({ outcome: 'dismissed' })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Dismisses all

    if (error) throw error;
    res.json({ msg: "All activities deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error deleting activities" });
  }
};