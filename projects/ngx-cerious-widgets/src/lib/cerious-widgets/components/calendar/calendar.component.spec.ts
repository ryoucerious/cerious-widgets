import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let fixture: ComponentFixture<CalendarComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CalendarComponent] }).compileComponents();
    fixture = TestBed.createComponent(CalendarComponent);
    el = fixture.nativeElement;
  });

  it('renders a 6x7 grid of days', () => {
    fixture.componentRef.setInput('date', new Date(2026, 5, 15)); // June 2026
    fixture.detectChanges();
    expect(el.querySelectorAll('.cw-calendar__day').length).toBe(42);
    expect(el.querySelector('.cw-calendar__title')!.textContent).toContain('2026');
  });

  it('navigates to the next and previous month', () => {
    fixture.componentRef.setInput('date', new Date(2026, 5, 15));
    fixture.detectChanges();
    const title = () => el.querySelector('.cw-calendar__title')!.textContent!.trim();
    const start = title();
    (el.querySelector('.cw-calendar__nav[aria-label="Next month"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(title()).not.toBe(start);
    (el.querySelector('.cw-calendar__nav[aria-label="Previous month"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(title()).toBe(start);
  });

  it('emits dateSelect and marks the day selected', () => {
    fixture.componentRef.setInput('date', new Date(2026, 5, 15));
    fixture.detectChanges();
    const emitted: Date[] = [];
    fixture.componentInstance.dateSelect.subscribe(d => emitted.push(d));
    const inMonth = Array.from(el.querySelectorAll<HTMLButtonElement>('.cw-calendar__day'))
      .find(b => !b.classList.contains('cw-calendar__day--other'))!;
    inMonth.click();
    fixture.detectChanges();
    expect(emitted.length).toBe(1);
    expect(el.querySelector('.cw-calendar__day--selected')).toBeTruthy();
  });

  it('renders event chips and collapses overflow into "+N more"', () => {
    const day = new Date(2026, 5, 10);
    fixture.componentRef.setInput('date', day);
    fixture.componentRef.setInput('maxEventsPerDay', 2);
    fixture.componentRef.setInput('events', [
      { date: day, title: 'A' }, { date: day, title: 'B' }, { date: day, title: 'C' }, { date: day, title: 'D' }
    ]);
    fixture.detectChanges();
    expect(el.querySelectorAll('.cw-calendar__event').length).toBe(2);
    const more = el.querySelector('.cw-calendar__more')!;
    expect(more.textContent).toContain('+2 more');
  });

  it('emits eventClick without also selecting the day', () => {
    const day = new Date(2026, 5, 10);
    fixture.componentRef.setInput('date', day);
    fixture.componentRef.setInput('events', [{ date: day, title: 'A' }]);
    fixture.detectChanges();
    const events: unknown[] = [];
    const days: Date[] = [];
    fixture.componentInstance.eventClick.subscribe(e => events.push(e));
    fixture.componentInstance.dateSelect.subscribe(d => days.push(d));
    (el.querySelector('.cw-calendar__event') as HTMLElement).click();
    fixture.detectChanges();
    expect(events.length).toBe(1);
    expect(days.length).toBe(0);
  });
});
