import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await(await b.newContext({viewport:{width:1180,height:460},deviceScaleFactor:2})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,80)));
await p.goto('http://localhost:4300/app/products',{waitUntil:'networkidle'}); await p.waitForTimeout(1800);
await p.screenshot({path:'prod-btns.png'});
// tooltip: hover the bell, check tooltip position (below the bell)
await p.goto('http://localhost:4300/app/dashboard',{waitUntil:'networkidle'}); await p.waitForTimeout(700);
const bell = await p.locator('button[aria-label="Notifications"]').boundingBox();
await p.locator('button[aria-label="Notifications"]').hover(); await p.waitForTimeout(500);
const tip = await p.locator('.cw-tooltip, [class*="tooltip"]').first().boundingBox().catch(()=>null);
await p.screenshot({path:'tip.png'});
console.log('bell bottom:', bell && Math.round(bell.y+bell.height), '| tooltip top:', tip && Math.round(tip.y), '(tooltip should be below bell)');
console.log('errors:', errs.length);
await b.close();
