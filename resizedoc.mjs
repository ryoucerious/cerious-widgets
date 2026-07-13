import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await(await b.newContext({viewport:{width:1400,height:900}})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,80)));
await p.goto('http://localhost:4300/components/grid',{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
// The default "Basic" grid has resizable columns; find the "Name" header resizer
const header = p.locator('cw-grid [role="columnheader"]', {hasText:'Name'}).first();
const startW = await header.evaluate(el=>Math.round(el.getBoundingClientRect().width));
const rb = await header.locator('.column-resizer').first().boundingBox();
const cx=rb.x+rb.width/2, cy=rb.y+rb.height/2;
// off-element drag: down far below + right
await p.mouse.move(cx,cy); await p.mouse.down();
await p.mouse.move(cx+60, cy, {steps:4});
const mid = await header.evaluate(el=>Math.round(el.getBoundingClientRect().width));
await p.mouse.move(cx+140, cy+450, {steps:8}); // off the header, deep into body
await p.mouse.up(); await p.waitForTimeout(400);
const endW = await header.evaluate(el=>Math.round(el.getBoundingClientRect().width));
console.log('Name start:', startW, '| mid (+60):', mid, '(expect ~'+(startW+60)+')', '| end (+140 off-element):', endW, '(expect ~'+(startW+140)+')');
console.log('errors:', errs.length, errs.slice(0,3));
await b.close();
