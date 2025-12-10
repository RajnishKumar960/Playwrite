# How to Get Google Service Account Credentials

To save leads to your Google Sheet, you need a "Service Account" (a robot account) that has permission to edit your sheet.

## Step 1: Create a Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click **Select a project** (top left) > **New Project**.
3. Name it `LinkedIn Scraper` and click **Create**.

## Step 2: Enable Google Sheets API
1. In the search bar at the top, type `Google Sheets API`.
2. Click on **Google Sheets API** (Marketplace).
3. Click **Enable**.

## Step 3: Create a Service Account
1. Search for `Credentials` in the top bar and select **Credentials (API Manager)**.
2. Click **+ CREATE CREDENTIALS** (top) > **Service Account**.
3. Name it `scraper-bot` and click **Create and Continue**.
4. **Role**: Select **Editor** (Basic > Editor). Click **Continue** then **Done**.

## Step 4: Download the Key (JSON)
1. You will see your new service account in the list (e.g., `scraper-bot@...`). Click the **Pencil icon** (Edit) or click the email address.
2. Go to the **KEYS** tab (top menu).
3. Click **ADD KEY** > **Create new key**.
4. Select **JSON** and click **Create**.
5. A file will download to your computer (e.g., `linkedin-scraper-12345.json`).

## Step 5: Share Your Sheet
1. Open your downloaded JSON file with a text editor (Notepad).
2. Copy the `client_email` address (e.g., `scraper-bot@project-id.iam.gserviceaccount.com`).
3. Go to your Google Sheet (`1JWK8FNnR0vRikE1AE-_aMYiK0RXj-ZBdHqEXYhV5haY`).
4. Click **Share** (top right).
5. Paste the email address and give it **Editor** access.
6. Click **Send** (unchecked "Notify people" if standard email, but for service accounts it doesn't matter).

## Final Step: Provide the File to the Agent
**Upload the downloaded JSON file** to the chat, OR copy its content and paste it here.
