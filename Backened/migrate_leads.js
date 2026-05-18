import mongoose from 'mongoose';
import connectDB from './db/db.js';
import Lead from './MODELS/leads.js';

const migrate = async () => {
  await connectDB();
  // Assign all leads to their creators if they are unassigned
  const leads = await Lead.find({ assignedTo: { $exists: false } });
  console.log(`Found ${leads.length} unassigned leads.`);
  
  for (const lead of leads) {
    if (lead.createdBy) {
      lead.assignedTo = lead.createdBy;
      await lead.save();
      console.log(`Assigned lead ${lead._id} to its creator ${lead.createdBy}`);
    }
  }
  
  console.log('Migration complete!');
  process.exit(0);
};

migrate();
