import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CwTimelineEvent, TimelineComponent } from './timeline.component';

describe('TimelineComponent', () => {
  let fixture: ComponentFixture<TimelineComponent>;

  const events: CwTimelineEvent[] = [
    { opposite: '09:00', content: 'Order placed', severity: 'info' },
    { opposite: '11:30', content: 'Shipped', severity: 'success' },
    { opposite: '14:00', content: 'Delivered', severity: 'success' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TimelineComponent] }).compileComponents();
    fixture = TestBed.createComponent(TimelineComponent);
    fixture.componentRef.setInput('events', events);
    fixture.detectChanges();
  });

  function markers(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-timeline__marker'));
  }

  it('renders an event per entry with content and opposite labels', () => {
    const contents = Array.from(fixture.nativeElement.querySelectorAll('.cw-timeline__content'), (el: any) => el.textContent.trim());
    expect(contents).toEqual(['Order placed', 'Shipped', 'Delivered']);

    const opposites = Array.from(fixture.nativeElement.querySelectorAll('.cw-timeline__opposite'), (el: any) => el.textContent.trim());
    expect(opposites).toEqual(['09:00', '11:30', '14:00']);
  });

  it('colours markers by severity', () => {
    expect(markers()[0].getAttribute('data-severity')).toBe('info');
    expect(markers()[1].getAttribute('data-severity')).toBe('success');
  });

  it('draws a connector between events but not after the last', () => {
    expect(fixture.nativeElement.querySelectorAll('.cw-timeline__connector').length).toBe(2);
  });

  it('hides the opposite column when showOpposite is false', () => {
    fixture.componentRef.setInput('showOpposite', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cw-timeline__opposite')).toBeNull();
  });
});
