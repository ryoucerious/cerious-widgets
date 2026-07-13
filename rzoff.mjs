import { chromium } from 'playwright';
const b=await chromium.launch(); const p=await(await b.newContext({viewport:{width:1400,height:900}})).newPage();
const moves=[]; p.on('console',m=>{ if(m.text().includes('[RZmove]')) moves.push(m.text()); });
await p.goto('http://localhost:4300/components/grid',{waitUntil:'networkidle'}); await p.waitForTimeout(2500);
const header = p.locator('cw-grid [role="columnheader"]', {hasText:'Name'}).first();
const startW = await header.evaluate(el=>Math.round(el.getBoundingClientRect().width));
const rb = await header.locator('.column-resizer').first().boundingBox();
await p.mouse.move(rb.x+3, rb.y+3); await p.mouse.down();
// move FAR into the grid body (down 250, right 120) — nowhere near the resizer
await p.mouse.move(rb.x+120, rb.y+250, {steps:12});
await p.mouse.up(); await p.waitForTimeout(300);
const endW = await header.evaluate(el=>Math.round(el.getBoundingClientRect().width));
console.log('moves captured while dragging OFF the resizer:', moves.length);
moves.slice(-3).forEach(m=>console.log('  '+m));
console.log('start='+startW+' end='+endW+' delta='+(endW-startW));
await b.close();
