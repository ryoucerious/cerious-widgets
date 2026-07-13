import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CwGalleriaImage, GalleriaComponent } from './galleria.component';

describe('GalleriaComponent', () => {
  let fixture: ComponentFixture<GalleriaComponent>;
  let component: GalleriaComponent;

  const images: CwGalleriaImage[] = [
    { src: 'a.jpg', alt: 'A' },
    { src: 'b.jpg', alt: 'B', thumbnail: 'b-thumb.jpg' },
    { src: 'c.jpg', alt: 'C' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [GalleriaComponent] }).compileComponents();
    fixture = TestBed.createComponent(GalleriaComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('images', images);
    fixture.detectChanges();
  });

  function mainImg(): HTMLImageElement {
    return fixture.nativeElement.querySelector('.cw-galleria__image');
  }
  function thumbs(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-galleria__thumb'));
  }
  function counter(): string {
    return (fixture.nativeElement.querySelector('.cw-galleria__counter') as HTMLElement).textContent!.trim();
  }

  it('shows the first image, a thumbnail per image and a counter', () => {
    expect(mainImg().getAttribute('src')).toBe('a.jpg');
    expect(thumbs().length).toBe(3);
    expect(counter()).toBe('1 / 3');
  });

  it('uses the thumbnail URL when provided, else the src', () => {
    const thumbImgs = thumbs().map(t => (t.querySelector('img') as HTMLImageElement).getAttribute('src'));
    expect(thumbImgs).toEqual(['a.jpg', 'b-thumb.jpg', 'c.jpg']);
  });

  it('navigates with prev/next and wraps when circular', () => {
    (fixture.nativeElement.querySelector('.cw-galleria__nav--next') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(mainImg().getAttribute('src')).toBe('b.jpg');
    expect(fixture.componentInstance.current()).toBe(1);

    (fixture.nativeElement.querySelector('.cw-galleria__nav--prev') as HTMLButtonElement).click();
    (fixture.nativeElement.querySelector('.cw-galleria__nav--prev') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(mainImg().getAttribute('src')).toBe('c.jpg'); // wrapped past 0
  });

  it('jumps to an image via its thumbnail and marks it active', () => {
    thumbs()[2].click();
    fixture.detectChanges();
    expect(mainImg().getAttribute('src')).toBe('c.jpg');
    expect(thumbs()[2].classList).toContain('cw-galleria__thumb--active');
  });

  it('emits activeIndexChange', () => {
    let emitted = -1;
    component.activeIndexChange.subscribe(i => (emitted = i));
    thumbs()[1].click();
    expect(emitted).toBe(1);
  });
});
