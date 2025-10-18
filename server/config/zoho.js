// server/config/zoho.js

import { ImapFlow } from "imapflow";

/**
 * Creates and connects an IMAP client for a Zoho Mail account.
 * @param {string} user - The Zoho email address.
 * @param {string} pass - The 12-character App Password.
 * @returns {Promise<ImapFlow>} A connected ImapFlow client instance.
 */
export const connectZoho = async (user, pass) => {
  const client = new ImapFlow({
    host: "imap.zoho.in",
    port: 993,
    secure: true,
    auth: { user, pass },
    // Increase timeout to avoid connection issues on slow networks
    logger: false, // Set to true for deep debugging if needed
  });

  // Wait for the client to connect to the server
  await client.connect();
  return client;
};