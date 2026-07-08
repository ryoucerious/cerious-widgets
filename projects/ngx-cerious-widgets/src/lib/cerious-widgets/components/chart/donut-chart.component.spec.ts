import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonutChartComponent } from './donut-chart.component';

describe('DonutChartComponent', () => {
  let fixture: ComponentFixture<DonutChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DonutChartComponent] }).compileComponents();
    fixture = TestBed.createComponent(DonutChartComponent);
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a track + one arc circle per segment', () => {
    fixture.componentRef.setInput('segments', [
      { label: 'A', value: 60, color: '#f00' },
      { label: 'B', value: 40, color: '#0f0' }
    ]);
    fixture.detectChanges();
    // 1 background track + 2 arcs
    expect(fixture.nativeElement.querySelectorAll('circle').length).toBe(3);
  });

  it('computes proportional dash lengths', () => {
    fixture.componentRef.setInput('segments', [
      { label: 'A', value: 75, color: '#f00' },
      { label: 'B', value: 25, color: '#0f0' }
    ]);
    fixture.detectChanges();
    const [a, b] = fixture.componentInstance.arcs();
    expect(a.dash / fixture.componentInstance.circ()).toBeCloseTo(0.75, 5);
    expect(b.offset).toBeLessThan(0); // second slice is offset
  });

  it('shows the centre value + label', () => {
    fixture.componentRef.setInput('segments', [{ label: 'A', value: 1, color: '#f00' }]);
    fixture.componentRef.setInput('centerValue', '100');
    fixture.componentRef.setInput('centerLabel', 'Total');
    fixture.detectChanges();
    const texts = Array.from(fixture.nativeElement.querySelectorAll('text')).map((t: any) => t.textContent);
    expect(texts).toContain('100');
    expect(texts).toContain('Total');
  });

  it('emits segmentClick when a slice is clicked', () => {
    fixture.componentRef.setInput('segments', [
      { label: 'A', value: 60, color: '#f00' }, { label: 'B', value: 40, color: '#0f0' }
    ]);
    fixture.detectChanges();
    const events: any[] = [];
    fixture.componentInstance.segmentClick.subscribe(e => events.push(e));
    // circles = [track, A, B]
    const arcA = fixture.nativeElement.querySelectorAll('circle')[1];
    arcA.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(events.length).toBe(1);
    expect(events[0].label).toBe('A');
  });

  it('shows the hovered slice value in the centre', () => {
    fixture.componentRef.setInput('segments', [
      { label: 'A', value: 60, color: '#f00' }, { label: 'B', value: 40, color: '#0f0' }
    ]);
    fixture.componentRef.setInput('centerValue', '100');
    fixture.detectChanges();
    const arcA = fixture.nativeElement.querySelectorAll('circle')[1];
    arcA.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();
    const texts = Array.from(fixture.nativeElement.querySelectorAll('text')).map((t: any) => t.textContent);
    expect(texts).toContain('60');
    expect(texts).toContain('A');
  });
});
