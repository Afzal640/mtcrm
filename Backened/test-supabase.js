import { supabase } from "./config/supabaseClient.js";

async function test() {
  console.log("Testing supabase query...");
  const { data, error } = await supabase.from("project_tasks").select("*").limit(1);
  if (error) {
    console.error("Supabase Error:", error);
  } else {
    console.log("Data:", data);
  }
}

test();
