import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ltgqjjxhkqunuiqxmfvl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Z3Fqanhoa3F1bnVpcXhtZnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxODA1MDgsImV4cCI6MjA4MTc1NjUwOH0.aYceExrjaaCwvL-gHOPpaJGouWHJzBOKHidhAf4ajjo';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchTechs() {
  const { data, error } = await supabase.from('technologies').select('*');
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log(JSON.stringify(data, null, 2));
}

fetchTechs();
