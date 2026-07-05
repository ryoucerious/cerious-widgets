import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepsComponent } from './steps.component';

describe('StepsComponent', () => {
  let fixture: ComponentFixture<StepsComponent>;
  let component: StepsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StepsComponent] }).compileComponents();
    fixture = TestBed.createComponent(StepsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', [{ label: 'Cart' }, { label: 'Payment' }, { label: 'Done' }]);
    fixture.componentRef.setInput('activeIndex', 1);
    fixture.detectChanges();
  });

  function steps(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-steps__item'));
  }

  it('marks completed, active and upcoming steps', () => {
    expect(steps()[0].classList).toContain('cw-steps__item--done');
    expect(steps()[0].querySelector('.cw-steps__check')).toBeTruthy();
    expect(steps()[1].classList).toContain('cw-steps__item--active');
    expect(steps()[1].getAttribute('aria-current')).toBe('step');
    expect(steps()[2].classList).not.toContain('cw-steps__item--active');
  });

  it('ignores clicks unless clickable', () => {
    steps()[2].click();
    fixture.detectChanges();
    expect(component.currentIndex()).toBe(1);
  });

  it('activates a step on click when clickable and emits', () => {
    fixture.componentRef.setInput('clickable', true);
    fixture.detectChanges();

    let emitted = -1;
    component.activeIndexChange.subscribe(i => (emitted = i));
    steps()[2].click();
    fixture.detectChanges();

    expect(component.currentIndex()).toBe(2);
    expect(emitted).toBe(2);
  });
});
