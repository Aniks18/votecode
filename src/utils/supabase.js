import { createClient } from '@supabase/supabase-js';

// New Supabase project credentials
const supabaseUrl = 'https://jnbigurchtniauahbkpt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuYmlndXJjaHRuaWF1YWhia3B0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNDM4MDgsImV4cCI6MjA2MDcxOTgwOH0.InqbU5euYFBd3a6IkshUsM9W_6jZ_oFvKVLzVfXCQGk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;