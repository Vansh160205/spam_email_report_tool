// controllers/testController.js

import { supabase } from '../config/db.js'; // Import the Supabase client
import { checkZohoInbox } from "../services/zohoService.js";
import { sendReportMail } from "../utils/mailer.js";

export const startTest = async (req, res) => {
  try {
    const { userEmail } = req.body;

    // Supabase Version of "Test.create()"
    const { data, error } = await supabase
      .from('tests') // 'tests' is the table name you created
      .insert([{ user_email: userEmail }])
      .select('test_code') // Immediately select the generated test_code
      .single(); // Return it as a single object, not an array

    if (error) throw error;

    const testCode = data.test_code;

    res.json({
      message: "Test started successfully.",
      testCode,
      instructions: `Send an email to all test inboxes with this code: ${testCode}`,
    });
  } catch (error) {
    console.error("Error starting test:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const analyzeResults = async (req, res) => {
  try {
    const { testCode } = req.params;

    // Supabase Version of "Test.findOne()"
    const { data: testData, error: findError } = await supabase
      .from('tests')
      .select('user_email')
      .eq('test_code', testCode) // Find where test_code matches
      .single();

    if (findError || !testData) {
      return res.status(404).json({ error: "Test not found" });
    }

    // --- This part remains the same ---
    const results = [];
    results.push(...await checkZohoInbox(testCode));
    // ------------------------------------

    // Supabase Version of "Test.findOneAndUpdate()"
    const { error: updateError } = await supabase
      .from('tests')
      .update({ results: results }) // Update the results column
      .eq('test_code', testCode); // Where the test_code matches

    if (updateError) throw updateError;

    // Send the report email
    await sendReportMail(testData.user_email, results);

    res.json({ success: true, results });
  } catch (error) {
    console.error("Error analyzing results:", error);
    res.status(500).json({ error: "Failed to analyze emails" });
  }
};