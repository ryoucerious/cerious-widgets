import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CwTreeNode, TreeComponent } from './tree.component';

const NODES: CwTreeNode[] = [
  {
    key: 'src', label: 'src', expanded: true, children: [
      { key: 'app', label: 'app', children: [{ key: 'main', label: 'main.ts' }] },
      { key: 'index', label: 'index.html' }
    ]
  },
  { key: 'readme', label: 'README.md' }
];

describe('TreeComponent', () => {
  let fixture: ComponentFixture<TreeComponent>;
  let component: TreeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TreeComponent] }).compileComponents();
    fixture = TestBed.createComponent(TreeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('nodes', NODES);
    fixture.detectChanges();
  });

  function rows(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-tree__node'));
  }
  function labels(): string[] {
    return rows().map(r => r.querySelector('.cw-tree__label')!.textContent!.trim());
  }

  it('flattens visible nodes honouring the initial expanded flag', () => {
    // src is expanded → its children show; app is collapsed → main.ts hidden.
    expect(labels()).toEqual(['src', 'app', 'index.html', 'README.md']);
  });

  it('expands and collapses a branch on toggle', () => {
    const appRow = rows().find(r => r.textContent!.includes('app'))!;
    (appRow.querySelector('.cw-tree__toggle') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(labels()).toContain('main.ts');

    (rows().find(r => r.textContent!.includes('app'))!.querySelector('.cw-tree__toggle') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(labels()).not.toContain('main.ts');
  });

  it('selects a node and emits nodeSelect', () => {
    const selected: CwTreeNode[] = [];
    component.nodeSelect.subscribe(n => selected.push(n));

    rows().find(r => r.textContent!.includes('README.md'))!.click();
    fixture.detectChanges();

    expect(selected.map(n => n.key)).toEqual(['readme']);
    expect(component.selectedKey()).toBe('readme');
  });

  it('applies increasing indent by depth', () => {
    const appRow = rows().find(r => r.textContent!.includes('app'))! as HTMLElement;
    const srcRow = rows().find(r => r.querySelector('.cw-tree__label')!.textContent!.trim() === 'src')! as HTMLElement;
    expect(parseFloat(appRow.style.paddingLeft)).toBeGreaterThan(parseFloat(srcRow.style.paddingLeft));
  });

  it('virtualizes a large flattened tree', async () => {
    const many: CwTreeNode[] = [{
      key: 'root', label: 'root', expanded: true,
      children: Array.from({ length: 300 }, (_, i) => ({ key: `n${i}`, label: `Node ${i}` }))
    }];
    fixture.componentRef.setInput('nodes', many);
    fixture.componentRef.setInput('virtualThreshold', 100);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.cw-tree__list--virtual cerious-scroll')).toBeTruthy();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    fixture.detectChanges();

    const rendered = rows().length;
    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(200);
  });
});
