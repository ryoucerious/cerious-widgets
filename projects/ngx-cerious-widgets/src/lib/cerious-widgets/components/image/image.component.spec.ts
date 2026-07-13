import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageComponent } from './image.component';

describe('ImageComponent', () => {
  let fixture: ComponentFixture<ImageComponent>;
  let component: ImageComponent;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ImageComponent] }).compileComponents();
    fixture = TestBed.createComponent(ImageComponent);
    component = fixture.componentInstance;
    overlayContainer = TestBed.inject(OverlayContainer);
    fixture.componentRef.setInput('src', 'photo.jpg');
    fixture.componentRef.setInput('alt', 'A photo');
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function thumb(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.cw-image__thumb');
  }
  function viewer(): HTMLElement | null {
    return overlayContainer.getContainerElement().querySelector('.cw-image__viewer');
  }

  it('renders the thumbnail image with alt text', () => {
    const img = fixture.nativeElement.querySelector('.cw-image__img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('photo.jpg');
    expect(img.alt).toBe('A photo');
  });

  it('does not preview unless enabled', () => {
    expect(thumb().disabled).toBeTrue();
    thumb().click();
    fixture.detectChanges();
    expect(viewer()).toBeNull();
  });

  it('opens a fullscreen viewer when preview is enabled', () => {
    fixture.componentRef.setInput('preview', true);
    fixture.detectChanges();

    thumb().click();
    fixture.detectChanges();
    expect(viewer()).toBeTruthy();
    expect(viewer()!.querySelector('.cw-image__full')).toBeTruthy();
  });

  it('zooms and rotates via the toolbar', () => {
    fixture.componentRef.setInput('preview', true);
    fixture.detectChanges();
    thumb().click();
    fixture.detectChanges();

    (viewer()!.querySelector('[aria-label="Zoom in"]') as HTMLButtonElement).click();
    expect(component.zoom()).toBeCloseTo(1.25, 2);

    (viewer()!.querySelector('[aria-label="Rotate"]') as HTMLButtonElement).click();
    expect(component.rotation()).toBe(90);
  });

  it('closes on Escape', () => {
    fixture.componentRef.setInput('preview', true);
    fixture.detectChanges();
    thumb().click();
    fixture.detectChanges();

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(viewer()).toBeNull();
  });
});
