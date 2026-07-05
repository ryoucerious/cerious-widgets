import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagComponent } from './tag.component';

describe('TagComponent', () => {
  let fixture: ComponentFixture<TagComponent>;
  let component: TagComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TagComponent] }).compileComponents();
    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the label', () => {
    fixture.componentRef.setInput('value', 'Active');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cw-tag__label').textContent.trim()).toBe('Active');
  });

  it('reflects severity and rounded shape', () => {
    fixture.componentRef.setInput('severity', 'success');
    fixture.componentRef.setInput('rounded', true);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('data-severity')).toBe('success');
    expect(host.classList).toContain('cw-tag--rounded');
  });

  it('renders a leading icon when provided', () => {
    fixture.componentRef.setInput('icon', 'cw-icon-check');
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('.cw-tag__icon') as HTMLElement;
    expect(icon).toBeTruthy();
    expect(icon.classList).toContain('cw-icon-check');
  });
});
