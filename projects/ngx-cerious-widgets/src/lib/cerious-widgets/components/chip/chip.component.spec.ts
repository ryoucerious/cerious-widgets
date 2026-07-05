import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChipComponent } from './chip.component';

describe('ChipComponent', () => {
  let fixture: ComponentFixture<ChipComponent>;
  let component: ChipComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ChipComponent] }).compileComponents();
    fixture = TestBed.createComponent(ChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the label', () => {
    fixture.componentRef.setInput('label', 'Angular');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cw-chip__label').textContent.trim()).toBe('Angular');
  });

  it('shows no remove button by default', () => {
    expect(fixture.nativeElement.querySelector('.cw-chip__remove')).toBeNull();
  });

  it('emits remove and hides itself when the ✕ is clicked', () => {
    fixture.componentRef.setInput('removable', true);
    fixture.detectChanges();

    let removed = false;
    component.remove.subscribe(() => (removed = true));

    (fixture.nativeElement.querySelector('.cw-chip__remove') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(removed).toBeTrue();
    expect((fixture.nativeElement as HTMLElement).classList).toContain('cw-chip--hidden');
  });

  it('prefers the image over the icon', () => {
    fixture.componentRef.setInput('image', 'avatar.png');
    fixture.componentRef.setInput('icon', 'cw-icon-user');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.cw-chip__image')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.cw-chip__icon')).toBeNull();
  });
});
