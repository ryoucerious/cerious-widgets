import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AreaChartComponent } from './area-chart.component';

describe('AreaChartComponent', () => {
  let fixture: ComponentFixture<AreaChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AreaChartComponent] }).compileComponents();
    fixture = TestBed.createComponent(AreaChartComponent);
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('draws a line + area path per series with markers', () => {
    fixture.componentRef.setInput('series', [{ name: 'A', color: '#f00', data: [1, 4, 2, 8] }]);
    fixture.componentRef.setInput('labels', ['a', 'b', 'c', 'd']);
    fixture.detectChanges();
    const svg = fixture.nativeElement as HTMLElement;
    // one area + one line path
    expect(svg.querySelectorAll('path').length).toBe(2);
    // one marker per data point
    expect(svg.querySelectorAll('circle').length).toBe(4);
    // four x-axis labels
    const texts = Array.from(svg.querySelectorAll('text')).map(t => t.textContent);
    expect(texts).toContain('a');
    expect(texts).toContain('d');
  });

  it('exposes the aria-label on the svg', () => {
    fixture.componentRef.setInput('ariaLabel', 'Revenue');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('svg').getAttribute('aria-label')).toBe('Revenue');
  });

  it('hides markers when showPoints is false', () => {
    fixture.componentRef.setInput('series', [{ name: 'A', color: '#f00', data: [1, 2] }]);
    fixture.componentRef.setInput('showPoints', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('circle').length).toBe(0);
  });

  it('emits pointClick with the hovered index + values', () => {
    fixture.componentRef.setInput('series', [{ name: 'A', color: '#f00', data: [1, 2, 3] }]);
    fixture.componentRef.setInput('labels', ['a', 'b', 'c']);
    fixture.detectChanges();
    const events: any[] = [];
    fixture.componentInstance.pointClick.subscribe(e => events.push(e));
    (fixture.componentInstance as any).hoverIndex.set(1);
    fixture.componentInstance.onClick();
    expect(events.length).toBe(1);
    expect(events[0].label).toBe('b');
    expect(events[0].values[0].value).toBe(2);
  });
});
