const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const fs = require('fs');
require('dotenv').config();

/**
 * Appends rows to the specified Google Sheet.
 * @param {string} sheetId - The ID of the Google Sheet.
 * @param {Array<Object>} rows - Array of objects representing rows to add.
 */
async function appendRowsToSheet(sheetId, rows) {
    if (!rows || rows.length === 0) {
        console.log('No rows to append to sheet.');
        return;
    }

    try {
        let jwt;
        // Check environment variables for service account
        if (process.env.GOOGLE_SERVICE_ACCOUNT_FILE) {
            console.log('Using GOOGLE_SERVICE_ACCOUNT_FILE');
            if (fs.existsSync(process.env.GOOGLE_SERVICE_ACCOUNT_FILE)) {
                const creds = JSON.parse(fs.readFileSync(process.env.GOOGLE_SERVICE_ACCOUNT_FILE));
                jwt = new JWT({
                    email: creds.client_email,
                    key: creds.private_key,
                    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
                });
            } else {
                console.error(`File not found: ${process.env.GOOGLE_SERVICE_ACCOUNT_FILE}`);
                throw new Error("GOOGLE_SERVICE_ACCOUNT_FILE defined but file missing");
            }
        } else {
            console.log('Using GOOGLE_SERVICE_ACCOUNT_EMAIL from env');
            if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
                jwt = new JWT({
                    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
                });
            } else {
                // Fallback: Check if user has auth.json in root (standard from previous agents)
                if (fs.existsSync('auth.json')) { // Note: auth.json usually is for Playwright state, not service account. 
                    // Leaving this blank or throwing specific error.
                }
                console.error("Missing Google Service Account credentials in .env");
                throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY in .env");
            }
        }

        console.log(`Connecting to Google Sheet ID: ${sheetId}`);
        const doc = new GoogleSpreadsheet(sheetId, jwt);

        await doc.loadInfo();
        console.log(`Loaded Doc: ${doc.title}`);

        const sheet = doc.sheetsByIndex[0];

        // Ensure headers
        const headers = ['Name', 'Title', 'Company', 'Location', 'LinkedIn URL', 'Industry', 'Snippet'];
        await sheet.loadHeaderRow();

        if (sheet.headerValues.length === 0) {
            console.log('Sheet is empty, setting headers...');
            await sheet.setHeaderRow(headers);
        }

        // Map rows to match headers order
        const rowData = rows.map(r => ({
            'Name': r.name,
            'Title': r.title,
            'Company': r.company,
            'Location': r.location,
            'LinkedIn URL': r.profileUrl,
            'Industry': r.industry,
            'Snippet': r.snippet
        }));

        console.log(`Appending ${rowData.length} rows...`);
        await sheet.addRows(rowData);
        console.log(`Successfully appended rows.`);

    } catch (error) {
        console.error('Error appending to Google Sheet:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        throw error;
    }
}

module.exports = { appendRowsToSheet };
