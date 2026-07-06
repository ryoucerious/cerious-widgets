import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CW_LOCALE } from '../../shared/tokens/locale.token';
import { WIDGETS_CONFIG } from '../../shared/tokens/widgets-config.token';
import { DatePickerApi, DatePickerPlugin } from './date-picker.api';
import { DatePickerComponent } from './date-picker.component';

@Injectable({ providedIn: 'root' })
class RecordingPlugin implements DatePickerPlugin {
  events: string[] = [];
  api?: DatePickerApi;

  onInit(api: DatePickerApi): void {
    this.api = api;
    this.events.push('init');
  }
  onOpen(): void {
    this.events.push('open');
  }
  onMonthChange(month: number, year: number): void {
    this.events.push(`month:${month}-${year}`);
  }
}

describe('DatePickerComponent', () => {
  let fixture: ComponentFixture<DatePickerComponent>;
  let component: DatePickerComponent;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerComponent],
      providers: [{ provide: WIDGETS_CONFIG, useValue: { datePicker: { plugins: [RecordingPlugin] } } }]
    }).compileComponents();
    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    overlayContainer = TestBed.inject(OverlayContainer);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function calendar(): HTMLElement | null {
    return overlayContainer.getContainerElement().querySelector('.cw-date-picker__calendar');
  }
  function dayButtons(): HTMLButtonElement[] {
    return Array.from(overlayContainer.getContainerElement().querySelectorAll('.cw-date-picker__day'));
  }

  it('shows the placeholder until a value is written', () => {
    expect(fixture.nativeElement.textContent).toContain('Select date');

    component.writeValue(new Date(2026, 6, 2));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cw-date-picker__value').textContent).toContain('2026');
  });

  it('opens a 6×7 grid and selects a day', () => {
    const emitted: (Date | null)[] = [];
    component.registerOnChange(v => emitted.push(v));
    component.writeValue(new Date(2026, 6, 2)); // July 2026
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement).click();
    fixture.detectChanges();

    expect(calendar()).toBeTruthy();
    expect(dayButtons().length).toBe(42);

    // Click the "15" that belongs to the visible month.
    const day15 = dayButtons().find(b => b.textContent!.trim() === '15' && !b.classList.contains('cw-date-picker__day--outside'))!;
    day15.click();
    fixture.detectChanges();

    expect(emitted.length).toBe(1);
    expect(emitted[0]!.getDate()).toBe(15);
    expect(emitted[0]!.getMonth()).toBe(6);
    expect(calendar()).toBeNull(); // closes after selection
  });

  it('navigates months and disables days outside min/max', () => {
    component.writeValue(new Date(2026, 6, 2));
    fixture.componentRef.setInput('min', new Date(2026, 6, 10));
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement).click();
    fixture.detectChanges();

    const day5 = dayButtons().find(b => b.textContent!.trim() === '5' && !b.classList.contains('cw-date-picker__day--outside'))!;
    expect(day5.disabled).toBeTrue();

    (calendar()!.querySelector('[aria-label="Next month"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(calendar()!.querySelector('.cw-date-picker__title')!.textContent).toContain('August');
  });

  it('clears the value from the footer', () => {
    const emitted: (Date | null)[] = [];
    component.registerOnChange(v => emitted.push(v));
    component.writeValue(new Date(2026, 6, 2));
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement).click();
    fixture.detectChanges();
    (calendar()!.querySelector('.cw-date-picker__clear') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(emitted).toEqual([null]);
    expect(fixture.nativeElement.textContent).toContain('Select date');
  });

  it('wires plugins with the typed API', () => {
    const plugin = TestBed.inject(RecordingPlugin);
    expect(plugin.events).toContain('init');

    (fixture.nativeElement as HTMLElement).click();
    fixture.detectChanges();
    expect(plugin.events).toContain('open');

    plugin.api!.navigateTo(0, 2027);
    fixture.detectChanges();
    expect(plugin.events).toContain('month:0-2027');
    expect(calendar()!.querySelector('.cw-date-picker__title')!.textContent).toContain('2027');

    plugin.api!.setValue(new Date(2027, 0, 5));
    expect(component.api.getValue()!.getFullYear()).toBe(2027);
  });
});

describe('DatePickerComponent locale', () => {
  it('falls back to the app-wide CW_LOCALE for weekday names', () => {
    TestBed.configureTestingModule({
      imports: [DatePickerComponent],
      providers: [{ provide: CW_LOCALE, useValue: 'de-DE' }]
    });
    const fixture = TestBed.createComponent(DatePickerComponent);
    fixture.componentRef.setInput('firstDayOfWeek', 1);
    fixture.detectChanges();
    // German weekday abbreviation for Monday.
    expect(fixture.componentInstance.weekdays()[0]).toBe('Mo');
  });

  it('per-instance locale input overrides CW_LOCALE', () => {
    TestBed.configureTestingModule({
      imports: [DatePickerComponent],
      providers: [{ provide: CW_LOCALE, useValue: 'de-DE' }]
    });
    const fixture = TestBed.createComponent(DatePickerComponent);
    fixture.componentRef.setInput('locale', 'en-US');
    fixture.componentRef.setInput('firstDayOfWeek', 1);
    fixture.detectChanges();
    expect(fixture.componentInstance.weekdays()[0]).toBe('Mon');
  });
});
