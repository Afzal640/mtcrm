import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendWeeklyReport = async (to, data) => {
  const htmlContent = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h1 style="color: #4f46e5;">Weekly CRM Performance Report</h1>
      <p>Here is the summary for the past 7 days:</p>
      
      <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-top: 20px;">
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
          <h3 style="margin: 0; font-size: 14px; color: #6b7280;">New Leads</h3>
          <p style="font-size: 24px; font-weight: bold; margin: 5px 0;">${data.newLeads}</p>
        </div>
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
          <h3 style="margin: 0; font-size: 14px; color: #6b7280;">Closed Deals</h3>
          <p style="font-size: 24px; font-weight: bold; margin: 5px 0;">${data.closedDeals}</p>
        </div>
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
          <h3 style="margin: 0; font-size: 14px; color: #6b7280;">Revenue Generated</h3>
          <p style="font-size: 24px; font-weight: bold; margin: 5px 0;">$${data.revenue.toLocaleString()}</p>
        </div>
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
          <h3 style="margin: 0; font-size: 14px; color: #6b7280;">Follow-ups Made</h3>
          <p style="font-size: 24px; font-weight: bold; margin: 5px 0;">${data.followUps}</p>
        </div>
      </div>

      <p style="margin-top: 30px; font-size: 12px; color: #9ca3af;">
        This is an automated report from your CRM system.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"CRM Automated Reports" <${process.env.SMTP_USER}>`,
      to,
      subject: `Weekly CRM Summary - ${new Date().toLocaleDateString()}`,
      html: htmlContent,
    });
    console.log("✅ Weekly report email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending weekly report email:", error);
  }
};
