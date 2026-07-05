import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {
  let fixture: ComponentFixture<AvatarComponent>;
  let component: AvatarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AvatarComponent] }).compileComponents();
    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders initials when no image is set', () => {
    fixture.componentRef.setInput('label', 'JK');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.cw-avatar__label').textContent.trim()).toBe('JK');
    expect(fixture.nativeElement.querySelector('.cw-avatar__image')).toBeNull();
  });

  it('prefers the image over the label', () => {
    fixture.componentRef.setInput('label', 'JK');
    fixture.componentRef.setInput('image', '/me.jpg');
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('.cw-avatar__image') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/me.jpg');
    expect(fixture.nativeElement.querySelector('.cw-avatar__label')).toBeNull();
  });

  it('reflects size and shape as host attributes', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.componentRef.setInput('shape', 'square');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('data-size')).toBe('large');
    expect(host.getAttribute('data-shape')).toBe('square');
  });
});
