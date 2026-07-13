import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListboxComponent } from './listbox.component';

describe('ListboxComponent', () => {
  let fixture: ComponentFixture<ListboxComponent>;
  let component: ListboxComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ListboxComponent] }).compileComponents();
    fixture = TestBed.createComponent(ListboxComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', ['One', 'Two', 'Three']);
    fixture.detectChanges();
  });

  function rows(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-listbox__option'));
  }

  it('selects a single value on click', () => {
    const emitted: unknown[] = [];
    component.registerOnChange(v => emitted.push(v));

    rows()[1].click();
    fixture.detectChanges();

    expect(emitted).toEqual(['Two']);
    expect(rows()[1].classList).toContain('cw-listbox__option--selected');
  });

  it('toggles values into an array when multiple', () => {
    fixture.componentRef.setInput('multiple', true);
    component.writeValue([]);
    fixture.detectChanges();

    const emitted: unknown[] = [];
    component.registerOnChange(v => emitted.push(v));

    rows()[0].click();
    rows()[2].click();
    fixture.detectChanges();
    expect(emitted).toEqual([['One'], ['One', 'Three']]);

    rows()[0].click();
    fixture.detectChanges();
    expect(emitted[2]).toEqual(['Three']);
  });

  it('filters the list', () => {
    fixture.componentRef.setInput('filterable', true);
    fixture.detectChanges();

    const filter = fixture.nativeElement.querySelector('.cw-listbox__filter') as HTMLInputElement;
    filter.value = 'thr';
    filter.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(rows().map(r => r.textContent!.trim())).toEqual(['Three']);
  });

  it('virtualizes with cerious-scroll above the threshold', async () => {
    const many = Array.from({ length: 500 }, (_, i) => `Item ${i}`);
    fixture.componentRef.setInput('options', many);
    fixture.componentRef.setInput('virtualThreshold', 100);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.cw-listbox__list--virtual cerious-scroll')).toBeTruthy();

    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    fixture.detectChanges();

    const rendered = rows().length;
    expect(rendered).toBeGreaterThan(0);
    expect(rendered).toBeLessThan(200);
  });
});
