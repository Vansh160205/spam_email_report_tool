// config/db.js
import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // We'll call it this for clarity
console.log("🔑 Supabase URL:", supabaseUrl ? "Loaded" : "Missing");
console.log("🔑 Supabase Key:", supabaseKey ? "Loaded" : "Missing");
// Check if the variables are loaded
if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase URL or Key is missing. Check your .env file.");
  process.exit(1); // Exit if config is missing
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

console.log("✅ Supabase client initialized");