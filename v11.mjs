import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await(await b.newContext({viewport:{width:1180,height:460},deviceScaleFactor:2})).newPage();
await p.goto('http://localhost:4300/app/dashboard',{waitUntil:'networkidle'}); await p.waitForTimeout(800);
await p.locator('button[aria-label="Notifications"]').hover(); await p.waitForTimeout(600);
await p.screenshot({path:'tip.png'});
await b.close(); console.log('done');
