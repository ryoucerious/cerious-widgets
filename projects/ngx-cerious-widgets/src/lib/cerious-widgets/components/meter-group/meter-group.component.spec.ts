import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CwMeterItem, MeterGroupComponent } from './meter-group.component';

describe('MeterGroupComponent', () => {
  let fixture: ComponentFixture<MeterGroupComponent>;
  let component: MeterGroupComponent;

  const items: CwMeterItem[] = [
    { label: 'Apps', value: 40, color: '#3b82f6' },
    { label: 'Media', value: 25, color: '#22c55e' },
    { label: 'Docs', value: 15 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MeterGroupComponent] }).compileComponents();
    fixture = TestBed.createComponent(MeterGroupComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
  });

  function segments(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-meter-group__segment'));
  }

  it('renders a segment per item', () => {
    expect(segments().length).toBe(3);
  });

  it('computes percentages against an explicit max', () => {
    fixture.componentRef.setInput('max', 100);
    fixture.detectChanges();
    expect(component.segments()[0].percent).toBe(40);
    expect(component.segments()[1].percent).toBe(25);
  });

  it('defaults max to the sum of values', () => {
    // sum = 80 → Apps 40/80 = 50%
    expect(component.total()).toBe(80);
    expect(component.segments()[0].percent).toBe(50);
  });

  it('assigns palette colours when none provided', () => {
    expect(component.segments()[2].color).toBeTruthy();
    expect(component.segments()[0].color).toBe('#3b82f6');
  });

  it('renders a legend that can be hidden', () => {
    expect(fixture.nativeElement.querySelector('.cw-meter-group__legend')).toBeTruthy();
    fixture.componentRef.setInput('showLegend', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cw-meter-group__legend')).toBeNull();
  });
});
