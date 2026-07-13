import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BreadcrumbComponent] }).compileComponents();
    fixture = TestBed.createComponent(BreadcrumbComponent);
    fixture.componentRef.setInput('items', [
      { label: 'Home', url: '/' },
      { label: 'Products', url: '/products' },
      { label: 'Item' }
    ]);
    fixture.detectChanges();
  });

  it('renders links for url items and plain text for the current page', () => {
    const links = Array.from(fixture.nativeElement.querySelectorAll('.cw-breadcrumb__link')) as HTMLAnchorElement[];
    expect(links.map(a => a.textContent!.trim())).toEqual(['Home', 'Products']);
    expect(links[0].getAttribute('href')).toBe('/');

    const current = fixture.nativeElement.querySelector('[aria-current="page"]') as HTMLElement;
    expect(current.textContent!.trim()).toBe('Item');
  });

  it('renders separators between items but not after the last', () => {
    expect(fixture.nativeElement.querySelectorAll('.cw-breadcrumb__separator').length).toBe(2);
  });

  it('is labelled as breadcrumb navigation', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('role')).toBe('navigation');
    expect(host.getAttribute('aria-label')).toBe('breadcrumb');
  });
});
