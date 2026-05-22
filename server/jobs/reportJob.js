import cron from "node-cron";
import { supabase } from "../config/supabaseClient.js";
import { sendWeeklyReport } from "../utils/emailService.js";

// Cron Job: Har Saturday raat 9:00 PM (0 21 * * 6)
export const initReportJob = () => {
  cron.schedule("0 21 * * 6", async () => {
    console.log("🕒 Running weekly report cron job...");
    
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const isoDate = sevenDaysAgo.toISOString();

      // 1. New Leads this week
      const { data: newLeads } = await supabase
        .from("leads")
        .select("id")
        .gte("created_at", isoDate);

      // 2. Closed Deals (Won) this week
      // Note: We check leads that have status 'closed-won' 
      // Ideally we would check a status_updated_at field if available
      const { data: closedDeals } = await supabase
        .from("leads")
        .select("budget")
        .eq("status", "closed-won")
        .gte("status_updated_at", isoDate); // Using the column we added earlier

      // 3. Follow-ups this week (Activities)
      const { data: activities } = await supabase
        .from("activities")
        .select("id")
        .gte("created_at", isoDate);

      // Calculate Revenue
      const revenue = closedDeals?.reduce((sum, l) => sum + (parseFloat(l.budget) || 0), 0) || 0;

      const reportData = {
        newLeads: newLeads?.length || 0,
        closedDeals: closedDeals?.length || 0,
        revenue: revenue,
        followUps: activities?.length || 0,
      };

      // 4. Send Email to Admin
      // Replace with your admin email or get from DB/Env
      const adminEmail = process.env.ADMIN_REPORT_EMAIL || process.env.SMTP_USER;
      
      if (adminEmail) {
        await sendWeeklyReport(adminEmail, reportData);
      } else {
        console.warn("⚠️ No admin email found for reporting.");
      }

    } catch (error) {
      console.error("❌ Cron Job Error:", error);
    }
  });
  
  console.log("🚀 Automated Weekly Report Job Scheduled (Sat 9 PM)");
};
