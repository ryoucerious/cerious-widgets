import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  let fixture: ComponentFixture<BadgeComponent>;
  let component: BadgeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BadgeComponent] }).compileComponents();
    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the value when not a dot', () => {
    fixture.componentRef.setInput('value', 7);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('7');
  });

  it('reflects severity and size as host attributes', () => {
    fixture.componentRef.setInput('severity', 'danger');
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('data-severity')).toBe('danger');
    expect(host.getAttribute('data-size')).toBe('large');
  });

  it('renders no text and a dot class when dot is set', () => {
    fixture.componentRef.setInput('value', 7);
    fixture.componentRef.setInput('dot', true);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.classList).toContain('cw-badge--dot');
    expect(host.textContent?.trim()).toBe('');
  });
});
