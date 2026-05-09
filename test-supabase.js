const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  console.log("Testing insert...");
  const { data: insertData, error: insertError } = await supabase
    .from('travel_leads')
    .insert([{
      customer_name: "Test Node Script",
      destination: "Test Dest",
      status: "New Inquiry"
    }])
    .select();

  if (insertError) {
    console.error("Insert Error:", insertError);
  } else {
    console.log("Insert Success:", insertData);
  }

  console.log("\nTesting select...");
  const { data: selectData, error: selectError } = await supabase
    .from('travel_leads')
    .select('*');

  if (selectError) {
    console.error("Select Error:", selectError);
  } else {
    console.log("Select Success, rows found:", selectData?.length);
  }
}

testSupabase();
