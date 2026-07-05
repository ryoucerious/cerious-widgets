import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutoCompleteComponent } from './autocomplete.component';

describe('AutoCompleteComponent', () => {
  let fixture: ComponentFixture<AutoCompleteComponent>;
  let component: AutoCompleteComponent;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AutoCompleteComponent] }).compileComponents();
    fixture = TestBed.createComponent(AutoCompleteComponent);
    component = fixture.componentInstance;
    overlayContainer = TestBed.inject(OverlayContainer);
    fixture.componentRef.setInput('options', ['Germany', 'France', 'Finland', 'Georgia']);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function inputEl(): HTMLInputElement {
    return fixture.nativeElement.querySelector('.cw-autocomplete__input');
  }
  function type(text: string): void {
    inputEl().value = text;
    inputEl().dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }
  function optionRows(): HTMLButtonElement[] {
    return Array.from(overlayContainer.getContainerElement().querySelectorAll('.cw-autocomplete__option'));
  }

  it('suggests matches while typing and selects on click', () => {
    const emitted: unknown[] = [];
    component.registerOnChange(v => emitted.push(v));

    type('ge');
    expect(optionRows().map(r => r.textContent!.trim())).toEqual(['Germany', 'Georgia']);

    optionRows()[0].click();
    fixture.detectChanges();

    expect(emitted).toEqual(['Germany']);
    expect(inputEl().value).toBe('Germany');
    expect(optionRows().length).toBe(0); // panel closed
  });

  it('closes the panel when nothing matches', () => {
    type('ge');
    expect(optionRows().length).toBe(2);

    type('zzz');
    expect(optionRows().length).toBe(0);
  });

  it('navigates with arrows and selects with Enter', () => {
    const emitted: unknown[] = [];
    component.registerOnChange(v => emitted.push(v));

    type('f');
    inputEl().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    inputEl().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(emitted.length).toBe(1);
    expect(inputEl().value).toBe('France');
  });

  it('virtualizes suggestions above the threshold', async () => {
    const many = Array.from({ length: 500 }, (_, i) => `Item ${i}`);
    fixture.componentRef.setInput('options', many);
    fixture.componentRef.setInput('virtualThreshold', 100);
    fixture.detectChanges();

    type('Item');
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    fixture.detectChanges();

    expect(overlayContainer.getContainerElement().querySelector('.cw-autocomplete__list--virtual cerious-scroll')).toBeTruthy();
    const rows = optionRows().length;
    expect(rows).toBeGreaterThan(0);
    expect(rows).toBeLessThan(200);
  });

  it('writeValue reflects the matching label into the input', () => {
    component.writeValue('France');
    expect(inputEl().value).toBe('France');
  });
});
