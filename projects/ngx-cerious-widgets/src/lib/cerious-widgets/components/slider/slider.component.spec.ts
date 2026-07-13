import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SliderComponent } from './slider.component';

describe('SliderComponent', () => {
  let fixture: ComponentFixture<SliderComponent>;
  let component: SliderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SliderComponent] }).compileComponents();
    fixture = TestBed.createComponent(SliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function nativeInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('.cw-slider__input');
  }
  function setNativeValue(value: string): void {
    const input = nativeInput();
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits the numeric value on input and shows it in the bubble', () => {
    const emitted: number[] = [];
    component.registerOnChange(v => emitted.push(v));

    setNativeValue('40');
    fixture.detectChanges();

    expect(emitted).toEqual([40]);
    expect(component.value()).toBe(40);
    expect(fixture.nativeElement.querySelector('.cw-slider__bubble').textContent.trim()).toBe('40');
  });

  it('computes percent from min/max', () => {
    fixture.componentRef.setInput('min', 100);
    fixture.componentRef.setInput('max', 200);
    component.writeValue(150);
    fixture.detectChanges();

    expect(component.percent()).toBe(50);
  });

  it('clamps out-of-range written values into the percent calc', () => {
    component.writeValue(500);
    fixture.detectChanges();
    expect(component.percent()).toBe(100);
  });

  it('hides the bubble when showValue is false and disables via setDisabledState', () => {
    fixture.componentRef.setInput('showValue', false);
    component.setDisabledState(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.cw-slider__bubble')).toBeNull();
    expect(nativeInput().disabled).toBeTrue();
  });
});
