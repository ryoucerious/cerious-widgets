import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KnobComponent } from './knob.component';

describe('KnobComponent', () => {
  let fixture: ComponentFixture<KnobComponent>;
  let component: KnobComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [KnobComponent] }).compileComponents();
    fixture = TestBed.createComponent(KnobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function host(): HTMLElement {
    return fixture.nativeElement;
  }

  it('reflects the value in the centre label and aria', () => {
    component.writeValue(42);
    fixture.detectChanges();

    expect(host().querySelector('.cw-knob__value')!.textContent!.trim()).toBe('42');
    expect(host().getAttribute('aria-valuenow')).toBe('42');
    expect(host().getAttribute('role')).toBe('slider');
  });

  it('changes value with arrow keys and emits, clamped to range', () => {
    const emitted: number[] = [];
    component.registerOnChange(v => emitted.push(v));
    fixture.componentRef.setInput('min', 0);
    fixture.componentRef.setInput('max', 100);
    fixture.componentRef.setInput('step', 10);
    component.writeValue(95);
    fixture.detectChanges();

    host().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    fixture.detectChanges();
    expect(component.value()).toBe(100); // clamped, not 105
    expect(emitted).toEqual([100]);

    host().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    expect(component.value()).toBe(90);
  });

  it('jumps to bounds with Home/End', () => {
    fixture.componentRef.setInput('min', 5);
    fixture.componentRef.setInput('max', 50);
    component.writeValue(20);
    fixture.detectChanges();

    host().dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    fixture.detectChanges();
    expect(component.value()).toBe(50);

    host().dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    fixture.detectChanges();
    expect(component.value()).toBe(5);
  });

  it('applies the value template', () => {
    fixture.componentRef.setInput('valueTemplate', '{value}%');
    component.writeValue(30);
    fixture.detectChanges();
    expect(host().querySelector('.cw-knob__value')!.textContent!.trim()).toBe('30%');
  });

  it('computes the filled fraction for the arc', () => {
    fixture.componentRef.setInput('min', 0);
    fixture.componentRef.setInput('max', 200);
    component.writeValue(50);
    fixture.detectChanges();
    expect(component.percent()).toBeCloseTo(0.25, 5);
  });
});
