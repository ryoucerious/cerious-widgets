import { fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { CwToastService } from './toast.service';

describe('ToastComponent & CwToastService', () => {
  let fixture: ComponentFixture<ToastComponent>;
  let service: CwToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ToastComponent] }).compileComponents();
    fixture = TestBed.createComponent(ToastComponent);
    service = TestBed.inject(CwToastService);
    fixture.detectChanges();
  });

  afterEach(() => {
    service.clear();
  });

  function items(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-toast__item'));
  }

  it('renders queued toasts with summary, detail and severity', () => {
    service.show({ severity: 'success', summary: 'Saved', detail: 'All changes stored.', duration: 0 });
    fixture.detectChanges();

    expect(items().length).toBe(1);
    expect(items()[0].getAttribute('data-severity')).toBe('success');
    expect(items()[0].textContent).toContain('Saved');
    expect(items()[0].textContent).toContain('All changes stored.');
  });

  it('auto-dismisses after the duration', fakeAsync(() => {
    service.show({ summary: 'Ping', duration: 1000 });
    fixture.detectChanges();
    expect(items().length).toBe(1);

    tick(1100);
    fixture.detectChanges();
    expect(items().length).toBe(0);
  }));

  it('dismisses via the close button and by id', () => {
    const id = service.show({ summary: 'One', duration: 0 });
    service.show({ summary: 'Two', duration: 0 });
    fixture.detectChanges();
    expect(items().length).toBe(2);

    service.dismiss(id);
    fixture.detectChanges();
    expect(items().length).toBe(1);
    expect(items()[0].textContent).toContain('Two');

    (items()[0].querySelector('.cw-alert__close') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(service.toasts().length).toBe(0);
  });
});
