// server/services/zohoService.js

import { connectZoho } from "../config/zoho.js"; // <-- Import from your new config file

async function checkSingleZoho(user, pass, testCode) {
  let client;
  try {
    // The connection logic is now cleaner!
    client = await connectZoho(user, pass);

    // --- The rest of this function remains exactly the same ---

    // Search Inbox
    let lock = await client.getMailboxLock("INBOX");
    try {
      const messages = await client.search({ or: [{ subject: testCode }, { text: testCode }] });
      if (messages.length > 0) return { provider: "Zoho", email: user, status: "Received", folder: "Inbox" };
    } finally {
      lock.release();
    }

    // Search Spam
    lock = await client.getMailboxLock("Spam");
    try {
      const messages = await client.search({ or: [{ subject: testCode }, { text: testCode }] });
      if (messages.length > 0) return { provider: "Zoho", email: user, status: "Received", folder: "Spam" };
    } finally {
      lock.release();
    }

    return { provider: "Zoho", email: user, status: "Not Found", folder: "N/A" };
  } catch (error) {
    console.error(`Error checking Zoho for ${user}:`, error);
    return { provider: "Zoho", email: user, status: "Error", folder: "N/A" };
  } finally {
    if (client) await client.logout();
  }
}

// This main function does not need to change
export const checkZohoInbox = async (testCode) => {
  const ZOHO_ACCOUNTS = [
    { user: process.env.ZOHO_USER_1, pass: process.env.ZOHO_PASS_1 },
    { user: process.env.ZOHO_USER_2, pass: process.env.ZOHO_PASS_2 },
    { user: process.env.ZOHO_USER_3, pass: process.env.ZOHO_PASS_3 },
    { user: process.env.ZOHO_USER_4, pass: process.env.ZOHO_PASS_4 },
    { user: process.env.ZOHO_USER_5, pass: process.env.ZOHO_PASS_5 },
    
  ];

  const results = [];
  for (const account of ZOHO_ACCOUNTS) {
    results.push(await checkSingleZoho(account.user, account.pass, testCode));
  }
  return results;
};