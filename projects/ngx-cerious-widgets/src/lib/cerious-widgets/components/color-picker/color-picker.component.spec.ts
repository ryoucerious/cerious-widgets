import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
  let fixture: ComponentFixture<ColorPickerComponent>;
  let component: ColorPickerComponent;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ColorPickerComponent] }).compileComponents();
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    overlayContainer = TestBed.inject(OverlayContainer);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function trigger(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.cw-color-picker__trigger');
  }
  function panel(): HTMLElement | null {
    return overlayContainer.getContainerElement().querySelector('.cw-color-picker__body');
  }
  function presets(): HTMLButtonElement[] {
    return Array.from(overlayContainer.getContainerElement().querySelectorAll('.cw-color-picker__preset'));
  }

  it('reflects the value in the trigger swatch and hex label', () => {
    component.writeValue('#22c55e');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cw-color-picker__hex').textContent.trim()).toBe('#22c55e');
  });

  it('opens the panel and picks a preset', () => {
    const emitted: string[] = [];
    component.registerOnChange(v => emitted.push(v));

    trigger().click();
    fixture.detectChanges();
    expect(panel()).toBeTruthy();

    presets()[5].click(); // #22c55e in the default palette
    fixture.detectChanges();
    expect(emitted[0]).toBe('#22c55e');
    expect(component.value()).toBe('#22c55e');
  });

  it('accepts a hex typed into the field', () => {
    const emitted: string[] = [];
    component.registerOnChange(v => emitted.push(v));
    trigger().click();
    fixture.detectChanges();

    const field = overlayContainer.getContainerElement().querySelector('.cw-color-picker__field') as HTMLInputElement;
    field.value = 'ff8800';
    field.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(emitted).toEqual(['#ff8800']);
  });

  it('ignores invalid hex input', () => {
    const emitted: string[] = [];
    component.registerOnChange(v => emitted.push(v));
    component.writeValue('#3b82f6');
    trigger().click();
    fixture.detectChanges();

    const field = overlayContainer.getContainerElement().querySelector('.cw-color-picker__field') as HTMLInputElement;
    field.value = 'nothex';
    field.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(emitted).toEqual([]);
    expect(component.value()).toBe('#3b82f6');
  });
});
