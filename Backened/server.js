import app from "./api/index.js";
import dotenv from "dotenv";

import { initReportJob } from "./jobs/reportJob.js";

dotenv.config();

// Start Cron Jobs
initReportJob();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running locally on port ${PORT} 🚀`);
});

export default app;