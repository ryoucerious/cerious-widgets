import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingComponent } from './rating.component';

describe('RatingComponent', () => {
  let fixture: ComponentFixture<RatingComponent>;
  let component: RatingComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RatingComponent] }).compileComponents();
    fixture = TestBed.createComponent(RatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function stars(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-rating__star'));
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the configured number of stars', () => {
    fixture.componentRef.setInput('stars', 10);
    fixture.detectChanges();
    expect(stars().length).toBe(10);
  });

  it('rates on click and fills up to the clicked star', () => {
    const emitted: number[] = [];
    component.registerOnChange(v => emitted.push(v));

    stars()[2].click();
    fixture.detectChanges();

    expect(component.value()).toBe(3);
    expect(emitted).toEqual([3]);
    expect(stars().filter(s => s.classList.contains('cw-rating__star--filled')).length).toBe(3);
  });

  it('clicking the current rating clears it when cancelable', () => {
    component.writeValue(3);
    fixture.detectChanges();

    stars()[2].click();
    fixture.detectChanges();
    expect(component.value()).toBe(0);
  });

  it('does not clear when cancelable is false', () => {
    fixture.componentRef.setInput('cancelable', false);
    component.writeValue(3);
    fixture.detectChanges();

    stars()[2].click();
    fixture.detectChanges();
    expect(component.value()).toBe(3);
  });

  it('ignores interaction when readonly', () => {
    fixture.componentRef.setInput('readonly', true);
    component.writeValue(2);
    fixture.detectChanges();

    stars()[4].click();
    fixture.detectChanges();
    expect(component.value()).toBe(2);
  });

  it('adjusts the value with arrow keys', () => {
    component.writeValue(2);
    fixture.detectChanges();

    fixture.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(component.value()).toBe(3);

    fixture.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(component.value()).toBe(2);
  });
});
