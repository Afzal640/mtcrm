import mongoose from 'mongoose';
import connectDB from './db/db.js';
import Lead from './MODELS/leads.js';

const check = async () => {
  await connectDB();
  const all = await Lead.find();
  console.log('Total Leads:', all.length);
  const unassigned = all.filter(l => !l.assignedTo);
  console.log('Unassigned Leads:', unassigned.length);
  if (all.length > 0) {
    console.log('Example Lead:', all[0]);
  }
  process.exit(0);
};

check();
