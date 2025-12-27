const { chromium } = require('playwright');
require('dotenv').config();

// Selectors (Best effort, Sales Nav DOM changes frequently)
const SELECTORS = {
    // Login
    USERNAME: '#username',
    PASSWORD: '#password',
    LOGIN_BTN: 'button[type="submit"]',

    // Search Results Container (Sales Nav)
    RESULT_CONTAINER: 'ol.artdeco-list > li.artdeco-list__item',
    // Fallback or specific elements within a result
    NAME: '[data-anonymize="person-name"]',
    TITLE: '[data-anonymize="job-title"]',
    COMPANY: '[data-anonymize="company-name"]',
    LOCATION: '.artdeco-entity-lockup__caption', // often location is here
    LINK: 'a[data-control-name="view_lead_panel_via_search_result"]', // scraping sales nav profile link
};

/**
 * Scrapes LinkedIn Sales Navigator for leads.
 * @param {Object} filters - { industry, location, title, count }
 */
async function scrapeSalesNavigator(filters) {
    const { industry, location, title, count = 25 } = filters;
    const leads = [];

    console.log(`Starting Scraper with filters: ${JSON.stringify(filters)}`);

    const browser = await chromium.launch({
        headless: false,
        slowMo: 100 // Slower actions to appear more human and ensure fields are filled
    });
    const context = await browser.newContext({
        viewport: { width: 1366, height: 768 }
    });
    const page = await context.newPage();

    try {
        // 1. Login
        console.log('Logging in...');
        await page.goto('https://www.linkedin.com/login');

        await page.waitForSelector(SELECTORS.USERNAME, { timeout: 10000 });
        await page.fill(SELECTORS.USERNAME, process.env.LINKEDIN_EMAIL || process.env.LINKEDIN_USER);
        await page.fill(SELECTORS.PASSWORD, process.env.LINKEDIN_PASSWORD || process.env.LINKEDIN_PASS);
        await page.click(SELECTORS.LOGIN_BTN);

        // Wait for login to complete
        console.log('Waiting for navigation after login...');
        await page.waitForTimeout(5000);

        // Manual Intervention / Captcha Wait Loop
        console.log('Verifying login status...');
        let tries = 0;
        // Wait up to 60s for user to solve captcha/2FA if needed
        while (tries < 12) {
            const url = page.url();
            // If we are on feed, sales home, or search, we are good.
            if (!url.includes('/login') && !url.includes('/checkpoint') && !url.includes('/authwall')) {
                console.log('Login successful (URL moved past login).');
                break;
            }
            if (tries === 0) console.log('>> PLEASE COMPLE CAPTCHA/2FA IN BROWSER IF NEEDED <<');
            console.log(`Waiting for manual login... (${tries + 1}/12)`);
            await page.waitForTimeout(5000);
            tries++;
        }

        // Force navigate to Sales Nav just in case
        console.log('Navigating to Sales Navigator Home...');
        try {
            await page.goto('https://www.linkedin.com/sales/home', { waitUntil: 'domcontentloaded', timeout: 15000 });
        } catch (e) {
            console.log('Sales Nav load timed out, trying to proceed anyway.');
        }
        await page.waitForTimeout(5000);

        // Check if we are still on login page
        if (page.url().includes('login')) {
            throw new Error("Failed to login to Sales Navigator. See login_issue.png if generated.");
        }

        // 2. Build Search URL
        const keywords = [title, industry, location].filter(Boolean).join(' ');
        const searchUrl = `https://www.linkedin.com/sales/search/people?keywords=${encodeURIComponent(keywords)}`;

        console.log(`Navigating to search: ${searchUrl}`);
        await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(5000);

        // 3. Scrape & Scroll
        let consecutiveEmptyScrolls = 0;

        while (leads.length < count && consecutiveEmptyScrolls < 5) {

            // Wait for results
            try {
                // Wait a bit differently looking for the list
                await page.waitForSelector(SELECTORS.RESULT_CONTAINER, { timeout: 10000 });
            } catch (e) {
                console.log('No results found or page took too long.');
                await page.screenshot({ path: 'search_results_issue.png' });
                break;
            }

            // Get all visible result items
            const items = await page.$$(SELECTORS.RESULT_CONTAINER);
            let newItemsFound = 0;

            for (const item of items) {
                if (leads.length >= count) break;

                try {
                    // Extract data safely
                    const nameEl = await item.$(SELECTORS.NAME);
                    const name = nameEl ? (await nameEl.innerText()).trim() : '';

                    if (!name) continue;

                    // Avoid duplicates
                    if (leads.find(l => l.name === name)) continue;

                    const titleEl = await item.$(SELECTORS.TITLE);
                    const titleText = titleEl ? (await titleEl.innerText()).trim() : '';

                    const companyEl = await item.$(SELECTORS.COMPANY);
                    const company = companyEl ? (await companyEl.innerText()).trim() : '';

                    const locationEl = await item.$(SELECTORS.LOCATION);
                    const loc = locationEl ? (await locationEl.innerText()).trim() : location || '';

                    const linkEl = await item.$('a');
                    let profileUrl = linkEl ? await linkEl.getAttribute('href') : '';
                    if (profileUrl && !profileUrl.startsWith('http')) {
                        profileUrl = `https://www.linkedin.com${profileUrl}`;
                    }

                    const lead = {
                        name,
                        title: titleText,
                        company,
                        location: loc,
                        profileUrl,
                        industry: industry || 'N/A',
                        snippet: `${titleText} at ${company}`
                    };

                    leads.push(lead);
                    newItemsFound++;
                    console.log(`Scraped: ${name}`);

                } catch (err) {
                    console.log('Error scraping item:', err.message);
                }
            }

            if (newItemsFound === 0) {
                consecutiveEmptyScrolls++;
            } else {
                consecutiveEmptyScrolls = 0;
            }

            // Scroll down
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await page.waitForTimeout(2000);

            const nextButton = await page.$('.artdeco-pagination__button--next');
            if (nextButton && await nextButton.isVisible() && await nextButton.isEnabled()) {
                await nextButton.click();
                await page.waitForTimeout(3000);
            }
        }

    } catch (error) {
        console.error('Scraping failed:', error);
    } finally {
        await browser.close();
    }

    return leads;
}

module.exports = { scrapeSalesNavigator };
