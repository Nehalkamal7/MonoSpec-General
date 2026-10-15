import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = path.resolve('public/screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  console.log('Launching Chrome browser for high-res screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1600,1050',
    ],
    defaultViewport: {
      width: 1600,
      height: 1000,
      deviceScaleFactor: 2,
    },
  });

  const page = await browser.newPage();

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  // Ensure English locale for international presentation
  await page.evaluate(() => {
    if (window.__monospec_store__) {
      window.__monospec_store__.getState().setLocale('en');
      window.__monospec_store__.getState().setActiveView('landing');
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Landing Hero
  console.log('Capturing 01_landing_hero.png...');
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '01_landing_hero.png'),
    clip: { x: 0, y: 0, width: 1600, height: 950 },
  });

  // 2. Landing Interactive Showcase (Switch tab to API Schema)
  console.log('Capturing 02_landing_interactive_showcase.png...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const apiTab = tabs.find(t => t.textContent?.toLowerCase().includes('openapi schema') || t.textContent?.toLowerCase().includes('api'));
    if (apiTab) apiTab.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '02_landing_interactive_showcase.png'),
    clip: { x: 0, y: 0, width: 1600, height: 950 },
  });

  // 3. Landing Features & Pipeline
  console.log('Capturing 03_landing_industries_pipeline.png...');
  await page.evaluate(() => {
    window.scrollBy({ top: 920, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '03_landing_industries_pipeline.png'),
    clip: { x: 0, y: 0, width: 1600, height: 950 },
  });

  // 4. Onboarding Step 1
  console.log('Capturing 04_onboarding_workspace_setup.png...');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    window.__monospec_store__.getState().setActiveView('onboarding');
    window.__monospec_store__.getState().setOnboardingStep(1);
    window.__monospec_store__.getState().setLocale('en');
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '04_onboarding_workspace_setup.png'),
    clip: { x: 0, y: 0, width: 1600, height: 950 },
  });

  // 5. Onboarding Step 3 (Pipeline Configuration)
  console.log('Capturing 05_onboarding_pipeline_config.png...');
  await page.evaluate(() => {
    window.__monospec_store__.getState().setOnboardingStep(3);
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '05_onboarding_pipeline_config.png'),
    clip: { x: 0, y: 0, width: 1600, height: 950 },
  });

  // 6. Workspace Split View
  console.log('Capturing 06_workspace_split_view.png...');
  await page.evaluate(() => {
    const store = window.__monospec_store__.getState();
    store.setActiveView('workspace');
    store.setLocale('en');
    store.setCanvasViewMode('split');
    store.setActiveProject('proj-awm-01');
    store.setActiveStage('tech_analysis');
    store.setDemoDrawerOpen(false);
    store.setTrainingModalOpen(false);
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '06_workspace_split_view.png'),
    clip: { x: 0, y: 0, width: 1600, height: 950 },
  });

  // 7. Workspace Spec Canvas Full View
  console.log('Capturing 07_workspace_spec_canvas.png...');
  await page.evaluate(() => {
    window.__monospec_store__.getState().setCanvasViewMode('canvas-only');
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '07_workspace_spec_canvas.png'),
    clip: { x: 0, y: 0, width: 1600, height: 950 },
  });

  // 8. Workspace AI Assistant Chat Full View
  console.log('Capturing 08_workspace_ai_assistant.png...');
  await page.evaluate(() => {
    window.__monospec_store__.getState().setCanvasViewMode('chat-only');
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '08_workspace_ai_assistant.png'),
    clip: { x: 0, y: 0, width: 1600, height: 950 },
  });

  // 9. Interactive Live Prototype Preview Drawer
  console.log('Capturing 09_workspace_interactive_drawer.png...');
  await page.evaluate(() => {
    const store = window.__monospec_store__.getState();
    store.setCanvasViewMode('split');
    store.setDemoDrawerOpen(true);
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '09_workspace_interactive_drawer.png'),
    clip: { x: 0, y: 0, width: 1600, height: 950 },
  });

  // 10. AI Datasets / Ingestion Modal
  console.log('Capturing 10_workspace_ai_datasets_modal.png...');
  await page.evaluate(() => {
    const store = window.__monospec_store__.getState();
    store.setDemoDrawerOpen(false);
    store.setTrainingModalOpen(true);
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, '10_workspace_ai_datasets_modal.png'),
    clip: { x: 0, y: 0, width: 1600, height: 950 },
  });

  await browser.close();
  console.log('Finished capturing all 10 high-fidelity system screenshots!');
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
