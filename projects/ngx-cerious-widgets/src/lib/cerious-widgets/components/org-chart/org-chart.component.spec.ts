import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CwOrgNode, OrgChartComponent, OrgNodeDirective } from './org-chart.component';

const TREE: CwOrgNode = {
  key: 'ceo',
  label: 'CEO',
  subtitle: 'Chief',
  children: [
    { key: 'cto', label: 'CTO', children: [{ key: 'eng', label: 'Engineer' }] },
    { key: 'cfo', label: 'CFO' }
  ]
};

describe('OrgChartComponent', () => {
  let fixture: ComponentFixture<OrgChartComponent>;
  let component: OrgChartComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OrgChartComponent] }).compileComponents();
    fixture = TestBed.createComponent(OrgChartComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('root', TREE);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('renders a card per node in the tree', () => {
    const cards = fixture.nativeElement.querySelectorAll('.cw-org-chart__card');
    expect(cards.length).toBe(4);
  });

  it('renders label and subtitle', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('CEO');
    expect(el.textContent).toContain('Chief');
    expect(el.textContent).toContain('Engineer');
  });

  it('emits and marks selection on click', () => {
    const selected: CwOrgNode[] = [];
    component.nodeSelect.subscribe((n) => selected.push(n));
    const firstCard: HTMLButtonElement = fixture.nativeElement.querySelector('.cw-org-chart__card');
    firstCard.click();
    fixture.detectChanges();

    expect(selected.length).toBe(1);
    expect(selected[0].label).toBe('CEO');
    expect(component.isSelected(TREE)).toBeTrue();
    expect(firstCard.classList).toContain('cw-org-chart__card--selected');
  });

  it('falls back to label as id when key is absent', () => {
    expect(component.nodeId({ label: 'Solo' })).toBe('Solo');
  });
});

@Component({
  standalone: true,
  imports: [OrgChartComponent, OrgNodeDirective],
  template: `
    <cw-org-chart [root]="root">
      <ng-template cwOrgNode let-node>
        <span class="custom">{{ node.label }}!</span>
      </ng-template>
    </cw-org-chart>
  `
})
class HostComponent {
  root: CwOrgNode = { label: 'Root' };
}

describe('OrgChartComponent custom template', () => {
  it('projects a custom node template', () => {
    const fixture = TestBed.configureTestingModule({ imports: [HostComponent] }).createComponent(HostComponent);
    fixture.detectChanges();
    const custom = fixture.nativeElement.querySelector('.custom');
    expect(custom).toBeTruthy();
    expect(custom.textContent).toBe('Root!');
  });
});
