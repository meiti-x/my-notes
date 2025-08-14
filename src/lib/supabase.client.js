import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lkpldyzasmjxrmgpnbzj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrcGxkeXphc21qeHJtZ3BuYnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTE3NjQsImV4cCI6MjA3MDcyNzc2NH0.56C2WbqDxK8umv1JX2gME2qvuN_VF_3KhDcheoeijyk";
export const supabase = createClient(supabaseUrl, supabaseKey);
